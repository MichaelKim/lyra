// @flow strict
// Wrapper around Search that adds YouTube autocomplete

import * as React from 'react';

import Search from '../search';

import { ytSuggest } from '../../yt-util';

type Props = {|
  +initialValue?: string,
  +onSearch?: (value: string) => void
|};

export default function YtSuggest(props: Props) {
  const [suggests, setSuggests] = React.useState<string[]>([]);

  function onChange(value: string) {
    ytSuggest(value).then(setSuggests);
  }

  function onSearch(value: string) {
    setSuggests([]);

    props.onSearch && props.onSearch(value);
  }

  return (
    <Search
      onChange={onChange}
      onEnter={onSearch}
      initialValue={props.initialValue || ''}
      suggestions={suggests}
    />
  );
}
