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

    return (
      <div className='top'>
        <Sidebar />
        <div
          className='screen'
          style={{ display: currScreen === 'settings' ? 'block' : 'none' }}
        >
          <Settings />
        </div>
        <div
          className='screen'
          style={{ display: currScreen === 'youtube' ? 'block' : 'none' }}
        >
          <Youtube />
        </div>
        <div
          className='screen'
          style={{
            display:
              currScreen !== 'settings' && currScreen !== 'youtube'
                ? 'block'
                : 'none'
          }}
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
