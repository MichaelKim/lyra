// @flow strict

import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { remote } from 'electron';

import type { Song, LocalSong, Metadata, SongID, SortType } from './types';

export function fileExists(path: string) {
  return new Promise<boolean>(resolve => {
    fs.access(path, fs.constants.F_OK, err => {
      resolve(!err);
    });
  });
}

export function getSongs(dir: string): Promise<LocalSong[]> {
  return new Promise<LocalSong[]>(resolve => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        resolve([]);
        return;
      }

      const names = files.filter(file => path.extname(file) === '.mp3');

      const promises: Promise<LocalSong>[] = names.map(name =>
        getMetadata(dir, name).then(metadata => ({
          id: createHash('sha256')
            .update(path.join(dir, name))
            .digest('hex'),
          title: metadata.title,
          artist: metadata.artist,
          duration: metadata.duration,
          source: 'LOCAL',
          filepath: path.join(dir, name),
          playlists: [],
          date: Date.now()
        }))
      );

      Promise.all(promises).then(songs => resolve(songs));
    });
  });
}

// Flow doesn't like Object.values(), so this is an alternative with Object.keys()
export function values<K, V>(obj: {| +[key: K]: V |}): V[] {
  return Object.keys(obj).map<V>((key: K) => obj[key]);
}

export function getSongList(
  songs: {|
    +[id: SongID]: Song
  |},
  playlist: ?string,
  sort?: SortType
): Song[] {
  const songlist = values(songs);
  const filtered =
    playlist != null
      ? songlist.filter((song: Song) => song.playlists.includes(playlist))
      : songlist;

  if (sort == null) {
    return filtered;
  }

  const sorted = filtered.sort((a, b) => {
    switch (sort.column) {
      case 'TITLE':
        return spaceship(a.title, b.title);
      case 'ARTIST':
        return spaceship(a.artist, b.artist);
      case 'DURATION':
        return spaceship(a.duration, b.duration);
      default:
        return spaceship(a.date, b.date);
    }
  });

  if (sort.direction) {
    return sorted.reverse();
  }

  return sorted;
}

function spaceship(a, b) {
  // $FlowFixMe: how to type this function properly?
  return a < b ? -1 : a > b ? 1 : 0;
}

export function getMetadata(dir: string, name: string): Promise<Metadata> {
  return new Promise(resolve => {
    const filepath = path.join(dir, name);
    ffmpeg.ffprobe(filepath, (err, metadata) => {
      if (err) {
        resolve({
          title: path.basename(name, path.extname(name)),
          artist: '',
          duration: 0
        });
      } else {
        resolve({
          title:
            metadata.format.tags?.title ||
            path.basename(name, path.extname(name)),
          artist: metadata.format.tags?.artist || '',
          duration: metadata.format.duration
        });
      }
    });
  });
}

export function formatDuration(duration: number) {
  const min = (duration / 60) | 0;
  const sec = String(duration % 60 | 0).padStart(2, '0');
  return `${min}:${sec}`;
}

// Format: PT1H2M34S
export function parseDuration(iso: string) {
  const matches = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (matches == null) {
    return 0;
  }

  return (
    Number(matches[1] || 0) * 3600 +
    Number(matches[2] || 0) * 60 +
    Number(matches[3] || 0)
  );
}

// As of 2019, the most viewed YouTube video has ~6B views.
// This method works up to billions, and should be enough.
export function readableViews(viewCount: number) {
  const length = 0 | Math.log10(viewCount);

  if (length < 3) return viewCount;
  if (length < 6)
    return (
      (0 | (viewCount / Math.pow(10, length - 2))) / Math.pow(10, 5 - length) +
      'K'
    );
  if (length < 9)
    return (
      (0 | (viewCount / Math.pow(10, length - 2))) / Math.pow(10, 8 - length) +
      'M'
    );
  return (
    (0 | (viewCount / Math.pow(10, length - 2))) / Math.pow(10, 11 - length) +
    'B'
  );
}

export function showContextMenu(
  items: Array<{|
    +label: string,
    +click: () => void
  |}>
) {
  const menu = new remote.Menu();
  for (const item of items) {
    const menuItem = new remote.MenuItem(item);
    menu.append(menuItem);
  }
  menu.popup(remote.getCurrentWindow());
}
