// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

import LocalSource from './local';
import YoutubeSource from './youtube';

class Sources extends React.Component<{||}> {
  render() {
    return (
      <div>
        <h3>Add Songs</h3>
        <LocalSource />
        <YoutubeSource />
      </div>
    );
  }
}

export default Sources;
