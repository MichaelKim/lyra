// @flow strict

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Top from './components/top';
import PlaybackBar from './components/playbackBar';

import store from './store';

require('../css/fonts.css');
require('../css/main.css');

const root = document.getElementById('app');

class App extends React.Component<{||}> {
  render() {
    return (
      <Provider store={store}>
        <Top />
        <PlaybackBar />
      </Provider>
    );
  }
}

if (root) {
  render(<App />, root);
}
