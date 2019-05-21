// @flow strict

import * as React from 'react';
import { render } from 'react-dom';

import '../../../css/range.scss';

type Props = {|
  +value: number,
  +min?: number,
  +max: number,
  +onChange?: (value: number) => void
|};

class RangeInput extends React.Component<Props> {
  _onChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const value = Number(e.currentTarget.value);
    this.props.onChange && this.props.onChange(value);
  };

  render() {
    const min = this.props.min || 0;

    const percent =
      this.props.max - min === 0
        ? 0
        : ((this.props.value - min) / (this.props.max - min)) * 100;

    return (
      <input
        type='range'
        min={min}
        max={this.props.max}
        step='0.01'
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
