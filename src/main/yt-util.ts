/*
  YouTube related utility methods

  Some of the packages that are used for YouTube integration
  require some setup before running (e.g. ffmpeg, googleapis).
  Moving all of them to this file helps centralize the setup
  code, and avoid duplication across the codebase.
*/

import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import { createHash } from 'crypto';
import { ipcMain } from 'electron';
import storage from 'electron-json-storage';
import ffmpeg from 'fluent-ffmpeg';
import { promises } from 'fs';
import he from 'he';
import path from 'path';
import ytdl from 'ytdl-core';
import ytsr, { Video } from 'ytsr';
import { Song, SongID, VideoSong } from '../renderer/types';
import { readableViews } from '../renderer/util';
// import { google } from "googleapis";

// const youtube = google.youtube({
//   version: "v3",
//   auth: process.env.ELECTRON_WEBPACK_APP_YT_API
// });

ffmpeg.setFfmpegPath(ffmpegPath.path.replace('app.asar', 'app.asar.unpacked'));

export function registerYoutube() {
  ipcMain.handle('yt-util-getStreamURL', async (_, id: SongID) => {
    const info = await ytdl.getInfo(id);

    const format = ytdl.chooseFormat(info.formats, {
      quality: 'highestaudio'
    });

    return format.url;
  });

  ipcMain.handle('yt-util-downloadVideo', async (event, id: SongID) => {
    /*
      This method fetches the audio of a YouTube video, and downloads it
      to download.mp3, while converting to a mp3 file. Once it finishes,
      it renames the file to the title of the video, applies metadata tags,
      and returns the new song object.
    */

    const dataPath = storage.getDataPath();
    const dlPath = path.join(dataPath, `download-${id}.mp3`);

    const info = await ytdl.getInfo(id);
    let currDuration = 0;

    // Sanitize for file name
    const safeName =
      info.videoDetails.title.replace(/[/\\?%*:|"<>. ]/g, '_') + '.mp3';
    const filepath = path.join(storage.getDataPath(), safeName);

    return new Promise<Song | null>(resolve => {
      ffmpeg(ytdl.downloadFromInfo(info, { quality: 'highestaudio' }))
        .audioBitrate(128)
        .outputOptions('-metadata', 'title=' + info.videoDetails.title)
        .outputOptions('-metadata', 'artist=' + info.videoDetails.author.name)
        .on('progress', progress => {
          /*
          ffmpeg's progress event contains a "percent" property, but
          it can be really inaccurate at times.

          The info object from ytdl contains a "length_seconds" value,
          but it's only precise to seconds. The progress event from ffmpeg
          has a precision of 0.01s, but doesn't contain total duration information.

          The following calculation uses ytdl's info as an approximate duration
          to calculate percent downloaded. Then, it uses the last duration from
          ffmpeg's progress to store as song duration metadata.
        */
          const [h, m, s] = progress.timemark.split(':').map(Number);
          currDuration = h * 3600 + m * 60 + s;

          const percent = Math.min(
            100 * (currDuration / Number(info.videoDetails.lengthSeconds)),
            100
          );

          event.sender.send('dl-progress', percent);
        })
        .save(dlPath)
        .on('end', async () => {
          try {
            await promises.rename(dlPath, filepath);
            const song: Song = {
              id: createHash('sha256')
                .update(info.videoDetails.videoId)
                .digest('hex'),
              filepath,
              title: info.videoDetails.title,
              artist: info.videoDetails.author.name,
              duration: currDuration,
              playlists: [],
              date: Date.now(),
              source: 'LOCAL'
            };

            resolve(song);
          } catch (err) {
            resolve(null);
          }
        });
    });
  });

  ipcMain.handle('yt-util-ytSearch', async (_, keyword: string) => {
    // return ytQuery({
    //   q: keyword
    // });

    const filters = await ytsr.getFilters(keyword);
    const filter = filters.get('Type')?.get('Video');
    if (filter?.url == null) {
      return [];
    }

    const search = await ytsr(filter.url, {
      limit: 25
    });

    const ids = new Map<string, Video>();
    for (const item of search.items) {
      const video = item as Video;
      const id = video.url.substr(video.url.lastIndexOf('=') + 1);

      // Videos can appear more than once, remove duplicates based on video id
      if (!ids.has(id)) {
        ids.set(id, video);
      }
    }

    const videos = Array.from(ids.entries());
    const songs = videos.map(async ([id, item]) => {
      const info = await ytdl.getBasicInfo(id);

      // This should be guaranteed to work
      const views = readableViews(
        Number(info.player_response.videoDetails.viewCount) || 0
      );

      const song: VideoSong = {
        id,
        title: he.decode(item.title),
        artist: item.author?.name ?? '',
        thumbnail: {
          url: item.bestThumbnail.url ?? '',
          width: item.bestThumbnail.width,
          height: item.bestThumbnail.height
        },
        playlists: [],
        date: Date.now(),
        source: 'YOUTUBE',
        url: info.videoDetails.videoId,
        duration: Number(info.videoDetails.lengthSeconds),
        views
      };

      return song;
    });

    return Promise.all(songs);
  });

  ipcMain.handle('yt-util-getRelatedVideos', async (_, id: string) => {
    // return ytQuery({
    //   relatedToVideoId: id
    // });

    const { related_videos } = await ytdl.getBasicInfo(id);

    // related_videos has nearly almost enough information to fill out a VideoSong
    // There are two missing parts:
    // - The thumbnail only has the url, but we don't need the dimensions to display it properly
    // - The viewcount sometimes will be formed like "12M" or "53K"
    // This is faster than having to do another getBasicInfo() to get the proper view count

    return related_videos.map(v => {
      const viewCount = v.view_count ?? '';
      let views = Number(viewCount.replace(/,/g, ''));
      if (!views) {
        const size = viewCount[viewCount.length - 1];
        views = parseFloat(viewCount) || 0; // parseInt will parse as much of the string unlike Number
        if (size === 'B') views *= 1e9;
        else if (size === 'M') views *= 1e6;
        else if (size === 'K') views *= 1e3;
      }

      return {
        id: v.id ?? '',
        title: v.title ?? '',
        artist: typeof v.author === 'string' ? v.author : v.author.name,
        duration: v.length_seconds ?? 0,
        playlists: [],
        date: Date.now(),
        source: 'YOUTUBE',
        url: v.id ?? '',
        views: readableViews(views || 0),
        thumbnail: {
          url: v.thumbnails[0]?.url ?? '',
          width: 120,
          height: 90
        }
      };
    });
  });
}

// async function ytQuery(options): Promise<VideoSong[]> {
//   const res = await youtube.search.list({
//     part: "snippet",
//     fields: "items(id,snippet(title,channelTitle,thumbnails/default))",
//     maxResults: 25,
//     type: "video",
//     ...options
//   });

//   const videos = res.data.items.map(item => ({
//     id: item.id.videoId,
//     title: he.decode(item.snippet.title),
//     artist: item.snippet.channelTitle,
//     thumbnail: item.snippet.thumbnails.default
//   }));

//   // const res2 = await youtube.videos.list({
//   //   part: 'contentDetails,statistics',
//   //   fields: 'items(contentDetails/duration, statistics/viewCount)',
//   //   id: videos.map(v => v.id).join(',')
//   // });

//   // return videos.map((v, i) => ({
//   //   ...v,
//   //   duration: parseDuration(res2.data.items[i].contentDetails.duration),
//   //   views: res2.data.items[i].statistics.viewCount
//   // }));

//   // This doesn't always work, but avoids making an API call
//   const infos = await Promise.all(videos.map(v => ytdl.getInfo(v.id)));
//   return videos.map((v, i) => ({
//     ...v,
//     playlists: [],
//     date: Date.now(),
//     source: "YOUTUBE",
//     url: v.id,
//     duration: infos[i].length_seconds,
//     views: infos[i].player_response.videoDetails.viewCount
//   }));
// }
