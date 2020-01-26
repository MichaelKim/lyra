// @flow strict

import React from 'react';

import Sources from './sources';
import Playlists from './playlists';

import { useDispatch } from '../../hooks';

export default function Settings() {
  const dispatch = useDispatch();
  const clearData = () => dispatch({ type: 'CLEAR_DATA' });

  return (
    <>
      <h1>Settings</h1>
      <Sources />
      <Playlists />

      <div>
        <button onClick={clearData}>Clear all data</button>
      </div>
    </>
  );
}
