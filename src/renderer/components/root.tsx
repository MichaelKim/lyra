// @flow strict

import React from 'react';
import Top from './top';
import PlaybackBar from './playback';
import { useSelector } from '../hooks';

import type { Node } from 'React';

export default function Root(): Node {
  const loaded = useSelector(state => state.loaded);
  return loaded ? (
    <>
      <Top />
      <PlaybackBar />
    </>
  ) : (
    <p>Loading...</p>
  );
}
