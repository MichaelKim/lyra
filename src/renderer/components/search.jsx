// @flow strict

import * as React from 'react';

import '../../css/search.scss';

type Props = {|
  +initialValue?: string,
  +suggestions?: Array<string>,
  +onChange?: (value: string) => void,
  +onEnter?: (value: string) => void
|};

export default function Search(props: Props) {
  const [focus, setFocus] = React.useState(-1);
  const [value, setValue] = React.useState<string>(props.initialValue || '');

  function onChange(e: SyntheticInputEvent<HTMLInputElement>) {
    const { value } = e.currentTarget;
    setFocus(-1);
    props.onChange && props.onChange(value);
    setValue(value);
  }

  function onEnter(e: SyntheticKeyboardEvent<HTMLInputElement>) {
    e.stopPropagation();
    if (e.key === 'Enter') {
      const onEnter = props.onEnter;
      if (onEnter == null) return;

      e.currentTarget.blur();
      if (props.suggestions != null && props.suggestions[focus]) {
        const suggest = props.suggestions[focus];
        setValue(suggest);
        onEnter(suggest);
      } else {
        onEnter(e.currentTarget.value);
      }
    } else {
      const numSuggests = props.suggestions?.length ?? 0;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (numSuggests > 0) {
          setFocus((focus + 1) % numSuggests);
        } else {
          setFocus(-1);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (numSuggests > 0) {
          setFocus((focus - 1) % numSuggests);
        } else {
          setFocus(-1);
        }
      }
    }
  }

  function onBlur() {
    setFocus(-1);
  }

  const suggestions = props.suggestions ?? [];

  return (
    <div className='search-box'>
      <img />
      <div className='search-input'>
        <input
          type='text'
          placeholder='Search...'
          onChange={onChange}
          onKeyDown={onEnter}
          onBlur={onBlur}
          value={value}
        />
        <div className='search-suggest-box'>
          {suggestions.map((suggest: string, idx) => (
            <div
              key={suggest}
              className={
                'search-suggest ' +
                (idx === focus ? 'search-suggest-focus' : '')
              }
              onClick={() => {
                setValue(suggest);
                props.onEnter && props.onEnter(suggest);
              }}
            >
              {suggest}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
