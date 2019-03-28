// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

import Sidebar from './sidebar';
import Screen from './screen';
import Settings from './settings';

import type { StoreState } from '../types';

type Props = {|
  +playlist: ?string
|};

class Top extends React.Component<Props> {
  render() {
    return (
      <div className="top">
        <Sidebar />
        {this.props.playlist === 'settings' ? <Settings /> : <Screen />}
      </div>
    );
  }
}

function mapState(state: StoreState) {
  return {
    playlist: state.playlist
  };
}

const ConnectedComp: React.ComponentType<{||}> = connect(mapState)(Top);

export default ConnectedComp;
