import { ipcRenderer } from 'electron';
import EventEmitter from 'events';
import he from 'he';
import ytdl from 'ytdl-core';
import ytsr, { Video } from 'ytsr';
import { Song, SongID, VideoSong } from './types';
import { readableViews } from './util';
// import { google } from "googleapis";

// const youtube = google.youtube({
//   version: "v3",
//   auth: process.env.ELECTRON_WEBPACK_APP_YT_API
// });

// EventEmitter with specifically typed events
declare interface DownloadEventEmitter extends EventEmitter {
  on(event: 'progress', callback: (percent: number) => void): this;
  // 'end' returns null if run in browser to end properly
  on(event: 'end', callback: (song: Song | null) => void): this;
}

export async function getStreamURL(id: SongID): Promise<string> {
  const info = await ytdl.getInfo(id);

  const format = ytdl.chooseFormat(info.formats, {
    quality: 'highestaudio'
  });

  return format.url;
}

export function downloadVideo(id: SongID): DownloadEventEmitter {
  const emitter: DownloadEventEmitter = new EventEmitter();

  function onProgress(_: Electron.IpcRendererEvent, percent: number) {
    emitter.emit('progress', percent);
  }

  ipcRenderer.on('dl-progress', onProgress);

  ipcRenderer.invoke('yt-util-downloadVideo', id).then((song: Song | null) => {
    ipcRenderer.off('dl-progress', onProgress);

    emitter.emit('end', song);
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
  const promises = videos.map(async ([id, item]) => {
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

  return Promise.all(promises);
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
