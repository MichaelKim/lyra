// @flow strict

import * as React from 'react';
import { render } from 'react-dom';

type Props = {|
  +initialValue?: string,
  +onChange?: (value: string) => void,
  +onEnter?: (value: string) => Promise<void> | void
|};

class Search extends React.Component<Props> {
  _onChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.props.onChange && this.props.onChange(e.currentTarget.value);
  };

  _onEnter = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && this.props.onEnter) {
      this.props.onEnter(e.currentTarget.value);
    }
  };

  render() {
    return (
      <div className='search-box'>
        <input
          type='text'
          placeholder='Search...'
          onChange={this._onChange}
          onKeyDown={this._onEnter}
        />
      </div>
    );
  }
}

export default Search;
