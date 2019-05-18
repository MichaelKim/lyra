// @flow strict

import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import * as mm from 'music-metadata';
import id3 from 'node-id3';

import type { Song, Metadata, Tags } from './types';

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
      resolve(
        names.map(name => ({
          id: createHash('sha256')
            .update(path.join(dir, name))
            .digest('hex'),
          name,
          dir,
          playlists: [],
          date: Date.now()
        }))
      );
    });
  });
}

// Flow doesn't like Object.values(), so this is an alternative with Object.keys()
export function values<K, V, T: { [key: K]: V }>(obj: T): V[] {
  return Object.keys(obj).map<V>((key: K) => obj[key]);
}

export function getMetadata(song: Song): Promise<Metadata> {
  const filepath = path.join(song.dir, song.name);
  return mm
    .parseFile(filepath)
    .then(metadata => ({
      title:
        metadata.common.title ||
        path.basename(song.name, path.extname(song.name)),
      artist: metadata.common.artist || '',
      duration: metadata.format.duration
    }))
    .catch(err => ({
      title: song.name,
      artist: '',
      duration: ''
    }));
}

export function setTags(filepath: string, tags: Tags) {
  // Adding a callback makes the method async,
  // avoiding blocking the UI
  id3.update(tags, filepath, (err, buff) => {});
}
