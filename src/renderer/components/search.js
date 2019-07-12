// @flow strict

import * as React from 'react';

type Props = {|
  +initialValue?: string,
  +onChange?: (value: string) => void,
  +onEnter?: (value: string) => void
|};

export default function Search(props: Props) {
  const [value, setValue] = React.useState(props.initialValue || '');

  function onChange(e: SyntheticInputEvent<HTMLInputElement>) {
    const { value } = e.currentTarget;
    props.onChange && props.onChange(value);
    setValue(value);
  }

  function onEnter(e: SyntheticKeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && props.onEnter) {
      props.onEnter(e.currentTarget.value);
    }
  }

  return (
    <div className='search-box'>
      <img />
      <input
        type='text'
        placeholder='Search...'
        onChange={onChange}
        onKeyDown={onEnter}
        value={value}
      />
    </div>
  );
}
