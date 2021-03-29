// @flow strict
/* eslint-disable no-unused-vars */

import type { Song, LocalSong, SongID, SortType } from './types';

export * from './util.shared';

export function fileExists(path: string): boolean {
  return false;
}

export async function getSongs(dir: string): Promise<LocalSong[]> {
  return [];
}

export function registerShortcuts(shortcuts: { +[key: string]: () => mixed }) {}

export function removeShortcuts(shortcuts: { +[key: string]: () => mixed }) {}

export function selectLocalDir(): ?Array<string> {
  return null;
}
