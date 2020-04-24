// @flow strict

import React from 'react';

import Sidebar from './sidebar';
import Screen from './screen';
import Youtube from './youtube';
import Settings from './settings';
import Queue from './queue';

import { useSelector } from '../hooks';

// Top-level screen components that should retain state when not being displayed
const TOPS = [
  {
    Component: Settings,
    enum: 'settings',
    visible: c => c === 'settings'
  },
  {
    Component: Youtube,
    enum: 'yt',
    visible: c => c != null && c.startsWith('yt-')
  },
  {
    Component: Queue,
    enum: 'queue',
    visible: c => c === 'queue'
  },
  {
    Component: Screen,
    enum: 'screen',
    visible: c =>
      c == null || (c !== 'settings' && c !== 'queue' && !c.startsWith('yt-'))
  }
];

export default function Top() {
  const currScreen = useSelector(state => state.currScreen);

  return (
    <div className='top'>
      <Sidebar />

      {TOPS.map(t => (
        <div
          key={t.enum}
          className={'screen ' + (t.visible(currScreen) ? '' : 'hidden')}
        >
          <t.Component />
        </div>
      ))}
    </div>
  );
}
