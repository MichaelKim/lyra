// @flow strict

import * as React from 'react';

import '../../../css/range.scss';

type Props = {|
  +value: number,
  +min?: number,
  +max: number,
  +onChange?: (value: number) => void
|};

export default function RangeInput(props: Props) {
  function onChange(e: SyntheticEvent<HTMLInputElement>) {
    const value = Number(e.currentTarget.value);
    props.onChange && props.onChange(value);
  }

  const min = props.min || 0;

  const percent =
    props.max - min === 0 ? 0 : ((props.value - min) / (props.max - min)) * 100;

  return (
    <input
      type='range'
      min={min}
      max={props.max}
      step='0.01'
      value={props.value}
      onChange={onChange}
      style={{
        // Accent color
        backgroundImage: `linear-gradient(
            to right,
            #4286f4 ${percent}%,
            #555 ${percent}%
          )`
      }}
    />
  );
}
