/*
  YouTube related utility methods

  Some of the packages that are used for YouTube integration
  require some setup before running (e.g. ffmpeg, googleapis).
  Moving all of them to this file helps centralize the setup
  code, and avoid duplication across the codebase.
*/

import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import { createHash } from 'crypto';
import { ipcMain } from 'electron';
import storage from 'electron-json-storage';
import ffmpeg from 'fluent-ffmpeg';
import { promises } from 'fs';
import path from 'path';
import ytdl from 'ytdl-core';
import { Song, SongID } from '../renderer/types';

ffmpeg.setFfmpegPath(ffmpegPath.path.replace('app.asar', 'app.asar.unpacked'));

export function registerYoutube() {
  ipcMain.handle('yt-util-downloadVideo', async (event, id: SongID) => {
    /*
      This method fetches the audio of a YouTube video, and downloads it
      to download.mp3, while converting to a mp3 file. Once it finishes,
      it renames the file to the title of the video, applies metadata tags,
      and returns the new song object.
    */

    const dataPath = storage.getDataPath();
    const dlPath = path.join(dataPath, `download-${id}.mp3`);

    const info = await ytdl.getInfo(id);
    let currDuration = 0;

    // Sanitize for file name
    const safeName =
      info.videoDetails.title.replace(/[/\\?%*:|"<>. ]/g, '_') + '.mp3';
    const filepath = path.join(storage.getDataPath(), safeName);

    return new Promise<Song | null>(resolve => {
      ffmpeg(ytdl.downloadFromInfo(info, { quality: 'highestaudio' }))
        .audioBitrate(128)
        .outputOptions('-metadata', 'title=' + info.videoDetails.title)
        .outputOptions('-metadata', 'artist=' + info.videoDetails.author.name)
        .on('progress', progress => {
          /*
          ffmpeg's progress event contains a "percent" property, but
          it can be really inaccurate at times.

          The info object from ytdl contains a "length_seconds" value,
          but it's only precise to seconds. The progress event from ffmpeg
          has a precision of 0.01s, but doesn't contain total duration information.

          The following calculation uses ytdl's info as an approximate duration
          to calculate percent downloaded. Then, it uses the last duration from
          ffmpeg's progress to store as song duration metadata.
        */
          const [h, m, s] = progress.timemark.split(':').map(Number);
          currDuration = h * 3600 + m * 60 + s;

          const percent = Math.min(
            100 * (currDuration / Number(info.videoDetails.lengthSeconds)),
            100
          );

          event.sender.send('dl-progress', percent);
        })
        .save(dlPath)
        .on('end', async () => {
          try {
            await promises.rename(dlPath, filepath);
            const song: Song = {
              id: createHash('sha256')
                .update(info.videoDetails.videoId)
                .digest('hex'),
              filepath,
              title: info.videoDetails.title,
              artist: info.videoDetails.author.name,
              duration: currDuration,
              playlists: [],
              date: Date.now(),
              source: 'LOCAL'
            };

            resolve(song);
          } catch (err) {
            resolve(null);
          }
        });
    });
  });
}
