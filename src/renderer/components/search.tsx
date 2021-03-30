import { useState } from 'react';
import '../../css/search.scss';
import Suggestion from './suggest';

type Props = {
  initialValue?: string;
  suggestions?: Array<string>;
  defaultSuggestions?: Array<string>;
  onChange?: (value: string) => void;
  onEnter?: (value: string) => void;
};

export default function Search(props: Props) {
  const [focused, setFocused] = useState(false);
  const [focus, setFocus] = useState(-1);
  const [value, setValue] = useState<string>(props.initialValue || '');

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.currentTarget;
    setFocus(-1);
    props.onChange && props.onChange(value);
    setValue(value);
  }

  function onEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    e.stopPropagation();
    if (e.key === 'Enter') {
      const onEnter = props.onEnter;
      if (onEnter == null) return;

      e.currentTarget.blur();
      const [def, sug] = getSuggestions();
      const suggestions = [...def, ...sug];
      if (suggestions[focus]) {
        const suggest = suggestions[focus];
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
          setFocus(f => (f + 1) % numSuggests);
        } else {
          setFocus(-1);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (numSuggests > 0) {
          setFocus(f => (f === -1 ? numSuggests - 1 : (f - 1) % numSuggests));
        } else {
          setFocus(-1);
        }
      }
    }
  }

  function onFocus() {
    setFocused(true);
  }

  function onBlur() {
    setFocused(false);
    setFocus(-1);
  }

  function onClick(suggest: string) {
    setValue(suggest);
    props.onEnter && props.onEnter(suggest);
  }

  function getSuggestions() {
    // If no text is entered, show up to 10 previous searches
    // Otherwise, show up to 2
    const def = (props.defaultSuggestions ?? [])
      .filter((ds: string) => ds.includes(value))
      .slice(0, value ? 2 : 10);
    // Fill up to 10 with suggestions
    const sug = (props.suggestions ?? []).slice(0, 10 - def.length);

    return [def, sug];
  }

  const [def, sug] = getSuggestions();

  return (
    <div className='search-box'>
      <img />
      <div className='search-input'>
        <input
          type='text'
          placeholder='Search...'
          onChange={onChange}
          onKeyDown={onEnter}
          onFocus={onFocus}
          onBlur={onBlur}
          value={value}
        />
        <div className='search-suggest-box'>
          {focused &&
            def.map((suggest: string, idx) => (
              <Suggestion
                key={`${suggest}-${idx}`}
                text={suggest}
                search={value}
                focused={idx === focus}
                isHistory
                onClick={onClick}
              />
            ))}
          {focused &&
            sug.map((suggest: string, idx) => (
              <Suggestion
                key={`${suggest}-${idx}`}
                text={suggest}
                search={value}
                focused={idx + def.length === focus}
                isHistory={false}
                onClick={onClick}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
