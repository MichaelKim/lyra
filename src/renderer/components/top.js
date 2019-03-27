// @flow strict

import React from 'react';
import { render } from 'react-dom';

import Sidebar from './sidebar';
import Screen from './screen';

class Top extends React.Component<{||}> {
  render() {
    return (
      <div className="top">
        <Sidebar />
        <Screen />
      </div>
    );
  }
}

export default Top;
