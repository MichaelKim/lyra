// @flow strict

import * as React from 'react';
import { render } from 'react-dom';

import '../../../css/range.css';

type Props = {|
  +value: number,
  +min?: number,
  +max: number,
  +onChange: (value: number) => void,
  +className?: string
|};

class RangeInput extends React.Component<Props> {
  _onChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const value = Number(e.currentTarget.value);
    this.props.onChange(value);
  };

  render() {
    const min = this.props.min || 0;

    const percent =
      this.props.max - min === 0
        ? 0
        : ((this.props.value - min) / (this.props.max - min)) * 100;

    return (
      <input
        className={this.props.className || ''}
        type='range'
        min={min}
        max={this.props.max}
        value={this.props.value}
        onChange={this._onChange}
        style={{
          backgroundImage: `linear-gradient(to right, black ${percent}%, gray ${percent}%)`
        }}
      />
    );
  }
}

export default RangeInput;
