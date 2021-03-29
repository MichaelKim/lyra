// @flow strict

import React from 'react';
import LocalSource from './local';
import YoutubeSource from './youtube';

import type { Node } from 'React';

export default function Sources(): Node {
  return (
    <div className='scroll-box'>
      <h3>Add Songs</h3>
      <LocalSource />
      <YoutubeSource />
    </div>
  );
}
