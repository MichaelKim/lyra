// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

import Top from './top';
import PlaybackBar from './playbackBar';

import type { StoreState } from '../types';

type Props = {|
  +loaded: boolean
|};

class Root extends React.Component<Props> {
  render() {
    return this.props.loaded ? (
      <>
        <Top />
        <PlaybackBar />
      </>
    ) : (
      <p>Loading...</p>
    );
  }
}

function mapState(state: StoreState) {
  return {
    loaded: state.loaded
  };
}

const ConnectedComp: React.ComponentType<{||}> = connect(mapState)(Root);

export default ConnectedComp;
