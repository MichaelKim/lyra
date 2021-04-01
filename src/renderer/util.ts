import { ipcRenderer } from 'electron';
import { LocalSong } from './types';

export * from './util.shared';

export function fileExists(path: string): Promise<boolean> {
  return ipcRenderer.invoke('util-fileExists', path);
}

export function getSongs(dir: string): Promise<LocalSong[]> {
  return ipcRenderer.invoke('util-getSongs', dir);
}

export function registerShortcuts(shortcuts: Record<string, () => void>) {
  Object.keys(shortcuts).forEach(key => {
    ipcRenderer.on(key, shortcuts[key]);
  });
}

export function removeShortcuts(shortcuts: Record<string, () => void>) {
  Object.keys(shortcuts).forEach(key => {
    ipcRenderer.removeListener(key, shortcuts[key]);
  });
}

export function selectLocalDir(): Promise<Electron.OpenDialogReturnValue> {
  return ipcRenderer.invoke('util-selectLocalDir');
}
