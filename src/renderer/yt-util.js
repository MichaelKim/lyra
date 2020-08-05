// @flow strict

/*
  YouTube related utility methods

  Some of the packages that are used for YouTube integration
  require some setup before running (e.g. ffmpeg, googleapis).
  Moving all of them to this file helps centralize the setup
  code, and avoid duplication across the codebase.
*/

import EventEmitter from 'events';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import fs from 'fs';
import he from 'he';
import path from 'path';
import storage from 'electron-json-storage';
import ytdl from 'ytdl-core';
import ytsr from 'ytsr';
import { createHash } from 'crypto';
// import { google } from "googleapis";

import { readableViews } from './util';

import type { Song, SongID, VideoSong } from './types';

ffmpeg.setFfmpegPath(ffmpegPath.path.replace('app.asar', 'app.asar.unpacked'));

// const youtube = google.youtube({
//   version: "v3",
//   auth: process.env.ELECTRON_WEBPACK_APP_YT_API
// });

// EventEmitter with specifically typed events
declare class DownloadEventEmitter extends EventEmitter {
  on('progress', (percent: number) => void): this;
  // 'end' returns null if run in browser to end properly
  on('end', (song: ?Song) => void): this;
  on(string, (e: mixed) => void): this;
}

export async function getStreamURL(id: SongID): Promise<string> {
  const info = await ytdl.getInfo(id);

  const format = ytdl.chooseFormat(info.formats, {
    quality: 'highestaudio'
  });

  return format.url;
}

export function downloadVideo(id: SongID): DownloadEventEmitter {
  /*
    This method fetches the audio of a YouTube video, and downloads it
    to download.mp3, while converting to a mp3 file. Once it finishes,
    it renames the file to the title of the video, applies metadata tags,
    and returns the new song object.
  */

  const dlPath = path.join(storage.getDataPath(), `download-${id}.mp3`);

  // $FlowFixMe: EventEmitter with typed events
  const emitter: DownloadEventEmitter = new EventEmitter();

  ytdl.getInfo(id, { quality: 'highestaudio' }).then(info => {
    let currDuration: number = 0;

    ffmpeg(ytdl.downloadFromInfo(info))
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
          100 * (currDuration / info.videoDetails.lengthSeconds),
          100
        );

        emitter.emit('progress', percent);
      })
      .save(dlPath)
      .on('end', () => {
        // Sanitize for file name
        const safeName =
          info.videoDetails.title.replace(/[/\\?%*:|"<>. ]/g, '_') + '.mp3';
        const filepath = path.join(storage.getDataPath(), safeName);

        fs.rename(dlPath, filepath, err => {
          if (err) {
            emitter.emit('end');
            return;
          }

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

          emitter.emit('end', song);
        });
      });
  });

  return emitter;
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

export async function ytSearch(keyword: string): Promise<VideoSong[]> {
  // return ytQuery({
  //   q: keyword
  // });

  // Alternative using ytsr
  const filters = await ytsr.getFilters(keyword);
  const typeFilters = filters.get('Type');
  if (typeFilters == null) {
    return [];
  }

  const filter = typeFilters.find(f => f.name === 'Video');
  if (filter == null) {
    return [];
  }

  const search = await ytsr(keyword, {
    limit: 25,
    nextpageRef: filter.ref
  });

  const ids = new Set<SongID>();
  const promises: Array<Promise<?VideoSong>> = search.items.map(async item => {
    const id = item.link.substr(item.link.lastIndexOf('=') + 1);

    // Videos can appear more than once, remove duplicates based on video id
    if (ids.has(id)) return;
    ids.add(id);

    const info = await ytdl.getBasicInfo(id);

    // This should be guaranteed to work
    const views = readableViews(
      Number(info.player_response.videoDetails.viewCount) || 0
    );

    return {
      id,
      title: he.decode(item.title),
      artist: item.author.name,
      thumbnail: {
        url: item.thumbnail,
        width: 120,
        height: 90
      },
      playlists: [],
      date: Date.now(),
      source: 'YOUTUBE',
      url: info.videoDetails.videoId,
      duration: info.videoDetails.lengthSeconds,
      views
    };
  });

  const videosongs = await Promise.all(promises);
  return videosongs.filter(Boolean);
}

export async function getRelatedVideos(id: SongID): Promise<VideoSong[]> {
  // return ytQuery({
  //   relatedToVideoId: id
  // });

  // Alternative using ytdl
  const { related_videos } = await ytdl.getBasicInfo(id);

  // related_videos has nearly almost enough information to fill out a VideoSong
  // There are two missing parts:
  // - The thumbnail only has the url, but we don't need the dimensions to display it properly
  // - The viewcount sometimes will be formed like "12M" or "53K"
  // This is faster than having to do another getBasicInfo() to get the proper view count

  return related_videos.map(v => {
    let views = Number(v.view_count.replace(/,/g, ''));
    if (!views) {
      const size = v.view_count[v.view_count.length - 1];
      views = parseFloat(v.view_count) || 0; // parseInt will parse as much of the string unlike Number
      if (size === 'B') views *= 1e9;
      else if (size === 'M') views *= 1e6;
      else if (size === 'K') views *= 1e3;
    }

    return {
      id: v.id,
      title: v.title,
      artist: v.author,
      duration: v.length_seconds,
      playlists: [],
      date: Date.now(),
      source: 'YOUTUBE',
      url: v.id,
      views: views ? readableViews(views) : '',
      thumbnail: {
        url: v.video_thumbnail,
        width: 120,
        height: 90
      }
    };
  });
}

const YT_SUGGEST_URL =
  'https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=';

export async function ytSuggest(query: string): Promise<Array<string>> {
  if (!query) return [];

  const url = YT_SUGGEST_URL + query.trim().replace(/\s+/, '+');

  // Format: [query: string, suggestions: string[]]
  const res = await fetch(url);
  const body: [string, string[]] = await res.json();

  return body[1];
}
