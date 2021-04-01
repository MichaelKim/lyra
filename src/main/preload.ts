import { contextBridge, ipcRenderer } from 'electron';
import {
  LocalSong,
  Song,
  SongID,
  StoreState,
  VideoSong
} from '../renderer/types';

export const menu = {
  show: (labels: Record<string, string>): Promise<string> =>
    ipcRenderer.invoke('menu-show', labels)
};

export const state = {
  load: (): Promise<StoreState> => ipcRenderer.invoke('state-load'),
  save: (state: StoreState) => ipcRenderer.send('state-save', state),
  clear: () => ipcRenderer.send('state-clear')
};

export const util = {
  fileExists: (path: string): Promise<boolean> =>
    ipcRenderer.invoke('util-fileExists', path),
  getSongs: (dir: string): Promise<LocalSong[]> =>
    ipcRenderer.invoke('util-getSongs', dir),
  registerShortcuts: (shortcuts: Record<string, () => void>) => {
    Object.keys(shortcuts).forEach(key => {
      ipcRenderer.on(key, shortcuts[key]);
    });

    return () => {
      Object.keys(shortcuts).forEach(key => {
        ipcRenderer.removeListener(key, shortcuts[key]);
      });
    };
  },
  selectLocalDir: (): Promise<Electron.OpenDialogReturnValue> =>
    ipcRenderer.invoke('util-selectLocalDir')
};

export const ytUtil = {
  getStreamURL: (id: SongID): Promise<string> =>
    ipcRenderer.invoke('yt-util-getStreamURL', id),
  downloadVideo: (
    id: SongID,
    onProgress: (_: Electron.IpcRendererEvent, progress: number) => void
  ): Promise<Song | null> => {
    return new Promise(resolve => {
      ipcRenderer.on('dl-progress', onProgress);

      ipcRenderer
        .invoke('yt-util-downloadVideo', id)
        .then((song: Song | null) => {
          ipcRenderer.off('dl-progress', onProgress);

          resolve(song);
        });
    });
  },
  ytSearch: (keyword: string): Promise<VideoSong[]> =>
    ipcRenderer.invoke('yt-util-ytSearch', keyword),
  getRelatedVideos: (id: SongID): Promise<VideoSong[]> =>
    ipcRenderer.invoke('yt-util-getRelatedVideos', id),
  ytSuggest: (query: string): Promise<string[]> =>
    ipcRenderer.invoke('yt-util-ytSuggest', query)
};

contextBridge.exposeInMainWorld('menu', menu);
contextBridge.exposeInMainWorld('state', state);
contextBridge.exposeInMainWorld('util', util);
contextBridge.exposeInMainWorld('ytUtil', ytUtil);
