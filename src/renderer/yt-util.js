// @flow strict

// YouTube related utility methods

import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import events from 'events';
import storage from 'electron-json-storage';
import ytdl from 'ytdl-core';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

import { setTags } from './util';

import type { Song, SongID } from './types';

ffmpeg.setFfmpegPath(ffmpegPath.path.replace('app.asar', 'app.asar.unpacked'));

export function getStreamURL(id: SongID) {
  return new Promise<string>((resolve, reject) => {
    ytdl.getInfo(id).then(info => {
      const format = ytdl.chooseFormat(info.formats, {
        quality: 'highestaudio'
      });

      resolve(format.url);
    });
  });
}

export function downloadVideo(id: SongID) {
  /*
    This method fetches the audio of a YouTube video, and downloads it
    to download.mp3, while converting to a mp3 file. Once it finishes,
    it renames the file to the title of the video, applies metadata tags,
    and returns the new song object.
  */

  let info, currDuration;
  const dlPath = path.join(storage.getDataPath(), 'download.mp3');

  const emitter = new events.EventEmitter();

  const stream = ytdl(id, { quality: 'highestaudio' }).on('info', ytinfo => {
    info = ytinfo;
  });

  /*
    The info object from ytdl contains a "length_seconds" value,
    but it's only precise to seconds. The progress event from ffmpeg
    has a precision of 0.01s, but doesn't contain total duration information.

    The following calculation uses ytdl's info as an approximate duration
    to calculate percent downloaded. Then, it uses the last duration from
    ffmpeg's progress to store as song duration metadata.
  */

  ffmpeg(stream)
    .audioBitrate(128)
    .save(dlPath)
    .on('progress', progress => {
      const [h, m, s] = progress.timemark.split(':').map(Number);
      currDuration = h * 3600 + m * 60 + s;

      const percent = Math.min(100 * (currDuration / info.length_seconds), 100);

      emitter.emit('progress', percent);
    })
    .on('end', () => {
      setTags(dlPath, {
        title: info.title,
        artist: info.author.name
      }).then(() => {
        // Sanitize for file name
        const safeName =
          info.title.replace(/[\/\\\?%\*:|"<>. ]/g, '_') + '.mp3';

        fs.rename(dlPath, path.join(storage.getDataPath(), safeName), err => {
          const song = {
            id: createHash('sha256')
              .update(info.video_id)
              .digest('hex'),
            name: safeName,
            title: info.title,
            artist: info.author.title,
            duration: currDuration,
            dir: storage.getDataPath(),
            playlists: [],
            date: Date.now()
          };

          emitter.emit('end', song);
        });
      });
    });

  return emitter;
}
