import { createHash } from 'crypto';
import { dialog, ipcRenderer } from 'electron';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { LocalSong, Metadata } from './types';

export * from './util.shared';

export function fileExists(path: string): Promise<boolean> {
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
          id: createHash('sha256').update(path.join(dir, name)).digest('hex'),
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

function getMetadata(dir: string, name: string): Promise<Metadata> {
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
        // Wrong type in @types/fluent-ffmpeg
        const tags = metadata.format.tags as Record<string, string> | undefined;
        resolve({
          title: tags?.title || path.basename(name, path.extname(name)),
          artist: tags?.artist || '',
          duration: Number(metadata.format.duration)
        });
      }
    });
  });
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

export async function selectLocalDir() {
  return dialog.showOpenDialog({
    properties: ['openDirectory', 'multiSelections']
  });
}