// @flow strict

/*
  YouTube related utility methods

  Some of the packages that are used for YouTube integration
  require some setup before running (e.g. ffmpeg, googleapis).
  Moving all of them to this file helps centralize the setup
  code, and avoid duplication across the codebase.
*/

import type { SongID, VideoSong } from './types';

if (!process.env.LYRA_URL) throw 'LYRA_URL missing!';
const LYRA_URL = process.env.LYRA_URL;

export async function getStreamURL(id: SongID): Promise<string> {
  const res = await fetch(`${LYRA_URL}/yt/url?id=${id}`);
  const url = res.text();
  return url;
}

export async function ytSearch(keyword: string): Promise<VideoSong[]> {
  const res = await fetch(`${LYRA_URL}/yt/search?query=${keyword}`);
  const json = res.json();
  return json;
}

export async function getRelatedVideos(id: SongID): Promise<VideoSong[]> {
  const res = await fetch(`${LYRA_URL}/yt/related?id=${id}`);
  const videos = res.json();
  return videos;
}
