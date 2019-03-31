// @flow strict

import * as React from 'react';
import { render } from 'react-dom';

type Props = {|
  +onToggle: (selected: boolean) => void,
  +selected: boolean
|};

type State = {|
  selected: boolean
|};

class Toggle extends React.Component<Props, State> {
  state = {
    selected: this.props.selected
  };

  _onToggle = () => {
    this.props.onToggle(!this.state.selected);

    this.setState(state => ({
      selected: !state.selected
    }));
  };

  render() {
    return (
      <div className="toggle">
        <input type="checkbox" checked={this.state.selected} readOnly />
        <span className="slider" onClick={this._onToggle} />
      </div>
    );
  }
}

export default Toggle;
