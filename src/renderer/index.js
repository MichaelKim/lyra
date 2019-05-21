// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Root from './components/root';

import store from './state/store';

import '../css/fonts.scss';
import '../css/main.scss';

const root = document.getElementById('app');

class App extends React.Component<{||}> {
  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}

if (root) {
  render(<App />, root);
}
