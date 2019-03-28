// @flow strict

import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

import type { StoreState, Dispatch } from '../types';

type Props = {|
  +directories: string[],
  +setDirectories: (dirs: string[]) => void
|};

type State = {|
  entered: string,
  tempDirs: Set<string>
|};

class Settings extends React.Component<Props, State> {
  state = {
    entered: '',
    tempDirs: new Set(this.props.directories)
  };

  _onChange = event => {
    this.setState({
      entered: event.target.value
    });
  };

  _onAdd = () => {
    this.setState(state => ({
      entered: '',
      tempDirs: state.tempDirs.add(state.entered)
    }));
  };

  _onDelete = dir => {
    this.setState(state => {
      state.tempDirs.delete(dir);
      return {
        tempDirs: state.tempDirs
      };
    });
  };

  _onSave = () => {
    this.props.setDirectories(Array.from(this.state.tempDirs));
  };

  render() {
    return (
      <div className="screen">
        <h1>Settings</h1>
        <p>Directories</p>
        {Array.from(this.state.tempDirs).map(dir => (
          <div key={dir}>
            <p>{dir}</p>
            <p onClick={() => this._onDelete(dir)}>x</p>
          </div>
        ))}
        <input
          placeholder="New directory"
          value={this.state.entered}
          onChange={this._onChange}
        />
        <button onClick={this._onAdd}>Add</button>
        <button onClick={this._onSave}>Save</button>
      </div>
    );
  }
}

function mapState(state: StoreState) {
  return {
    directories: state.directories
  };
}

function mapDispatch(dispatch: Dispatch) {
  return {
    setDirectories: (dirs: string[]) =>
      dispatch({ type: 'SET_DIRECTORIES', dirs })
  };
}

export default connect(
  mapState,
  mapDispatch
)(Settings);
