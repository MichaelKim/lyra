// @flow strict

import fs from 'fs';
import path from 'path';
import url from 'url';
import { createHash } from 'crypto';
import * as mm from 'music-metadata';
import id3 from 'node-id3';

import type { Song, Metadata, Tags, SongID, SortType } from './types';

export function fileExists(path: string) {
  return new Promise<boolean>((resolve, reject) => {
    fs.access(path, fs.constants.F_OK, err => {
      resolve(!err);
    });
  });
}

export function getSongs(dir: string) {
  return new Promise<Song[]>((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        resolve([]);
        return;
      }

      const names = files.filter(file => path.extname(file) === '.mp3');

      const promises: Promise<Song>[] = names.map(name =>
        getMetadata(dir, name).then(metadata => ({
          id: createHash('sha256')
            .update(path.join(dir, name))
            .digest('hex'),
          title: metadata.title,
          artist: metadata.artist,
          duration: metadata.duration,
          name,
          dir,
          playlists: [],
          date: Date.now()
        }))
      );

      Promise.all(promises).then(songs => resolve(songs));
    });
  });
}

// Flow doesn't like Object.values(), so this is an alternative with Object.keys()
export function values<K, V, T: { [key: K]: V }>(obj: T): V[] {
  return Object.keys(obj).map<V>((key: K) => obj[key]);
}

export function getSongList(
  songs: { [id: SongID]: Song },
  playlist: ?string,
  sort: SortType
): Song[] {
  const songlist = values(songs);
  const filtered =
    playlist != null
      ? songlist.filter(song => song.name.includes(playlist))
      : songlist;
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
  const filepath = path.join(dir, name);
  return mm
    .parseFile(filepath)
    .then(metadata => ({
      title: metadata.common.title || path.basename(name, path.extname(name)),
      artist: metadata.common.artist || '',
      duration: metadata.format.duration
    }))
    .catch(err => ({
      title: name,
      artist: '',
      duration: ''
    }));
}

export function setTags(filepath: string, tags: Tags) {
  // Adding a callback makes the method async,
  // avoiding blocking the UI
  return new Promise<void>((resolve, reject) =>
    id3.update(tags, filepath, (err, buff) => (err ? reject(err) : resolve()))
  );
}

export function formatDuration(duration: number) {
  const min = (duration / 60) | 0;
  const sec = String(duration % 60 | 0).padStart(2, '0');
  return `${min}:${sec}`;
}

declare var __static: string;
export function getStatic(filename: string) {
  if (process.env.NODE_ENV !== 'production') {
    return url.resolve(window.location.origin, filename);
  }
  return path.resolve(__static, filename);
}
