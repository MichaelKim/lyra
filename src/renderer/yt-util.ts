import EventEmitter from 'events';
import { Song, SongID, VideoSong } from './types';

// EventEmitter with specifically typed events
declare interface DownloadEventEmitter extends EventEmitter {
  on(event: 'progress', callback: (percent: number) => void): this;
  // 'end' returns null if run in browser to end properly
  on(event: 'end', callback: (song: Song | null) => void): this;
}

export function getStreamURL(id: SongID): Promise<string> {
  return window.ytUtil.getStreamURL(id);
}

export function downloadVideo(id: SongID): DownloadEventEmitter {
  const emitter: DownloadEventEmitter = new EventEmitter();

  window.ytUtil
    .downloadVideo(id, (_: Electron.IpcRendererEvent, percent: number) =>
      emitter.emit('progress', percent)
    )
    .then((song: Song | null) => {
      emitter.emit('end', song);
    });

  return emitter;
}

export async function ytSearch(keyword: string): Promise<VideoSong[]> {
  return window.ytUtil.ytSearch(keyword);
}

export async function getRelatedVideos(id: SongID): Promise<VideoSong[]> {
  return window.ytUtil.getRelatedVideos(id);
}

export async function ytSuggest(query: string): Promise<Array<string>> {
  return window.ytUtil.ytSuggest(query);
}
