import { LocalSong } from './types';

export * from './util.shared';

export function fileExists(): boolean {
  return false;
}

export async function getSongs(): Promise<LocalSong[]> {
  return [];
}

export function registerShortcuts() {
  // noop
}

export function removeShortcuts() {
  // noop
}

export function selectLocalDir(): Array<string> | null {
  return null;
}
