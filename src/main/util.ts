import { createHash } from 'crypto';
import { dialog, ipcMain } from 'electron';
import ffmpeg from 'fluent-ffmpeg';
import { promises } from 'fs';
import { constants } from 'fs';
import path from 'path';
import { LocalSong, Metadata } from '../renderer/types';

export function registerUtil() {
  ipcMain.handle('util-fileExists', async (_, path: string) => {
    try {
      await promises.access(path, constants.F_OK);
      return true;
    } catch {
      return false;
    }
  });

  ipcMain.handle('util-getSongs', async (_, dir: string) => {
    try {
      const files = await promises.readdir(dir);
      const names = files.filter(file => path.extname(file) === '.mp3');
      const songs = names.map(async name => {
        const metadata = await getMetadata(dir, name);

        const song: LocalSong = {
          id: createHash('sha256').update(path.join(dir, name)).digest('hex'),
          title: metadata.title,
          artist: metadata.artist,
          duration: metadata.duration,
          source: 'LOCAL',
          filepath: path.join(dir, name),
          playlists: [],
          date: Date.now()
        };

        return song;
      });

      return await Promise.all(songs);
    } catch {
      return [];
    }
  });

  ipcMain.handle('util-selectLocalDir', () => {
    return dialog.showOpenDialog({
      properties: ['openDirectory', 'multiSelections']
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
