// @flow strict

require('dotenv').config();
import * as React from 'react';
import { render } from 'react-dom';

import App from './app';
import Modal from './modals';

const name = window.location.hash.slice(1);

const root = document.getElementById('app');

if (!root) {
  throw 'Missing app root';
}

if (name === 'main') {
  render(<App />, root);
} else if (name === 'modal') {
  render(<Modal />, root);
}
