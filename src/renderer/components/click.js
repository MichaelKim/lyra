// @flow strict

import * as React from 'react';

// Max delay in ms between two clicks
const DBL_CLICK_DELAY = 250;

type Props = {|
  +onSngClick?: (e: SyntheticMouseEvent<HTMLDivElement>) => void,
  +onDblClick: (e: SyntheticMouseEvent<HTMLDivElement>) => void,
  +children: React.Node,
  +className?: string
|};

class Click extends React.Component<Props> {
  // Double click
  _isDblClick: boolean = false;
  _clickTimer: ?TimeoutID = null;

  _onClick = (e: SyntheticMouseEvent<HTMLDivElement>) => {
    // Make it easier to double click
    if (this._clickTimer != null) {
      this._onDblClick(e);
      return;
    }

    // Don't fire click handler if double click
    this._clickTimer = setTimeout(() => {
      if (!this._isDblClick) {
        this.props.onSngClick && this.props.onSngClick(e);
      }
      this._clickTimer = null;
      this._isDblClick = false;
    }, DBL_CLICK_DELAY);
  };

  _onDblClick = (e: SyntheticMouseEvent<HTMLDivElement>) => {
    // Don't fire single click handler
    this._clickTimer && clearTimeout(this._clickTimer);
    this._clickTimer = null;
    this._isDblClick = true;

    this.props.onDblClick(e);
  };

  render() {
    return (
      <div
        className={this.props.className || ''}
        onClick={this._onClick}
        onDoubleClick={this._onDblClick}
      >
        {this.props.children}
      </div>
    );
  }
}

export default Click;
