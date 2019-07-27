// @flow strict

import * as React from 'react';

import LocalSource from './local';
import YoutubeSource from './youtube';

export default function Sources() {
  return (
    <div className='scroll-box'>
      <h3>Add Songs</h3>
      <LocalSource />
      <YoutubeSource />
    </div>
  );
}
