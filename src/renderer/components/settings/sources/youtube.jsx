// @flow strict

import * as React from 'react';
import { connect } from 'react-redux';

import { downloadVideo } from '../../../yt-util';

import type { Dispatch, Song } from '../../../types';

type Props = {|
  +addSongs: (songs: Song[]) => void
|};

type State = {|
  loading: boolean,
  link: string,
  progress: ?number
|};

class Sources extends React.Component<Props, State> {
  state = {
    loading: false,
    link: '',
    progress: null
  };

  _onChange = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    this.setState({
      link: e.currentTarget.value
    });
  };

  _onAdd = () => {
    this.setState({
      loading: true
    });

    downloadVideo(this.state.link)
      .on('progress', (progress: number) => this.setState({ progress }))
      .on('end', (song: ?Song) => {
        if (song != null) this.props.addSongs([song]);
        this.setState({ loading: false });
      });
  };

  render() {
    return (
      <div>
        <button onClick={this._onAdd}>Add Link</button>
        <input
          type='text'
          placeholder='Youtube URL'
          value={this.state.link}
          onChange={this._onChange}
          disabled={this.state.loading}
        />
        {this.state.loading && (
          <progress value={this.state.progress} max={100} />
        )}
      </div>
    );
  }
}

function mapDispatch(dispatch: Dispatch) {
  return {
    addSongs: (songs: Song[]) => dispatch({ type: 'ADD_SONGS', songs })
  };
}

const ConnectedComp: React.ComponentType<{||}> = connect(
  null,
  mapDispatch
)(Sources);

export default ConnectedComp;
