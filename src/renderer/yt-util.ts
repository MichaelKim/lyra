import { ipcRenderer } from 'electron';
import EventEmitter from 'events';
import { Song, SongID, VideoSong } from './types';

// EventEmitter with specifically typed events
declare interface DownloadEventEmitter extends EventEmitter {
  on(event: 'progress', callback: (percent: number) => void): this;
  // 'end' returns null if run in browser to end properly
  on(event: 'end', callback: (song: Song | null) => void): this;
}

export function getStreamURL(id: SongID): Promise<string> {
  return ipcRenderer.invoke('yt-util-getStreamURL', id);
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

export async function ytSearch(keyword: string): Promise<VideoSong[]> {
  return ipcRenderer.invoke('yt-util-ytSearch', keyword);
}

export async function getRelatedVideos(id: SongID): Promise<VideoSong[]> {
  return ipcRenderer.invoke('yt-util-getRelatedVideos', id);
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
