// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

import Sidebar from './sidebar';
import Screen from './screen';
import Youtube from './youtube';
import Settings from './settings';

import type { StoreState } from '../types';

type Props = {|
  +currScreen: ?string
|};

class Top extends React.Component<Props> {
  render() {
    const { currScreen } = this.props;

    const screens = [
      { key: 'settings', Container: Settings },
      { key: 'youtube', Container: Youtube }
    ];

    return (
      <div className='top'>
        <Sidebar />
        {screens.map(screen => (
          <div
            key={screen.key}
            className={'screen ' + (currScreen !== screen.key ? 'hidden' : '')}
          >
            <screen.Container />
          </div>
        ))}
        <div
          className={
            'screen ' +
            (screens.findIndex(({ key }) => key === currScreen) > -1
              ? 'hidden'
              : '')
          }
        >
          <Screen />
        </div>
      </div>
    );
  }
}

function mapState(state: StoreState) {
  return {
    currScreen: state.currScreen
  };
}

const ConnectedComp: React.ComponentType<{||}> = connect(mapState)(Top);

export default ConnectedComp;
