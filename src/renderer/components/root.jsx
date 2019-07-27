// @flow strict

import * as React from 'react';

import Top from './top';
import PlaybackBar from './playback';

import { useSelector } from '../hooks';

export default function Root() {
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
