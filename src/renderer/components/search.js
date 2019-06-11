// @flow strict

import * as React from 'react';

type Props = {|
  +initialValue?: string,
  +onChange?: (value: string) => void,
  +onEnter?: (value: string) => void
|};

type State = {|
  value: string
|};

class Search extends React.Component<Props, State> {
  state = {
    value: this.props.initialValue || ''
  };

  _onChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    this.props.onChange && this.props.onChange(value);
    this.setState({ value });
  };

  _onEnter = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && this.props.onEnter) {
      this.props.onEnter(e.currentTarget.value);
    }
  };

  render() {
    return (
      <div className='search-box'>
        <img />
        <input
          type='text'
          placeholder='Search...'
          onChange={this._onChange}
          onKeyDown={this._onEnter}
          value={this.state.value}
        />
      </div>
    );
  }
}

export default Search;
