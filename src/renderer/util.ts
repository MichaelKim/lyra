import { LocalSong } from './types';

export * from './util.shared';

export function fileExists(path: string): Promise<boolean> {
  return window.util.fileExists(path);
}

export function getSongs(dir: string): Promise<LocalSong[]> {
  return window.util.getSongs(dir);
}

export function registerShortcuts(
  shortcuts: Record<string, () => void>
): () => void {
  return window.util.registerShortcuts(shortcuts);
}

export function selectLocalDir(): Promise<Electron.OpenDialogReturnValue> {
  return window.util.selectLocalDir();
}
