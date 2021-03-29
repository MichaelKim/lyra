// @flow strict

import React from 'react';

import type { Node } from 'React';

import '../../css/loading.scss';

export default function Loading(): Node {
  return (
    <div className='loading-box'>
      <div className='loading' />
    </div>
  );
}
