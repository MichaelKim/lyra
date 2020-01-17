// @flow strict
// Wrapper around Search that adds YouTube autocomplete

import * as React from 'react';
import { useSelector, useDispatch } from '../../hooks';

import Search from '../search';

import { ytSuggest } from '../../yt-util';

type Props = {|
  +initialValue?: string,
  +onSearch?: (value: string) => void
|};

export default function YtSuggest(props: Props) {
  const [suggests, setSuggests] = React.useState<string[]>([]);
  const history = useSelector(state => state.history);
  const dispatch = useDispatch();
  const addToHistory = search => dispatch({ type: 'ADD_TO_HISTORY', search });

  function onChange(value: string) {
    ytSuggest(value).then(setSuggests);
  }

  function onSearch(value: string) {
    setSuggests([]);
    if (value) {
      addToHistory(value);
      props.onSearch && props.onSearch(value);
    }
  }

  return (
    <Search
      onChange={onChange}
      onEnter={onSearch}
      initialValue={props.initialValue || ''}
      suggestions={suggests}
      defaultSuggestions={history}
    />
  );
}