// @flow strict

import fs from 'fs';
import path from 'path';

import type { Song } from './types';

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
          name,
          dir
        }))
      );
    });
  });
}
