// Wrapper around Search that adds YouTube autocomplete

import { useState } from 'react';
import { addToHistory } from '../../actions';
import { useDispatch, useSelector } from '../../hooks';
import { ytSuggest } from '../../yt-util';
import Search from '../search';

type Props = {
  initialValue?: string;
  onSearch?: (value: string) => void;
};

export default function YtSuggest(props: Props) {
  const [suggests, setSuggests] = useState<string[]>([]);
  const history = useSelector(state => state.history);
  const dispatch = useDispatch();

  function onChange(value: string) {
    ytSuggest(value).then(setSuggests);
  }

  function onSearch(value: string) {
    setSuggests([]);
    if (value) {
      dispatch(addToHistory(value));
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
