// @flow strict

import React from 'react';

type Props = {|
  +initialValue: string,
  +autoFocus: boolean,
  +onChange: (value: string) => mixed,
  +onEnter: () => mixed,
  +onCancel: () => mixed
|};

type State = {|
  initialValue: string
|};

/*
  Instead of using an input (which doesn't handle multiple lines),
  or a textarea (which doesn't grow with content), a div with
  contenteditable will work. However, it doesn't auto focus, nor
  does the autofocus attribute work. So, this ref is used to
  gain focus (and position cursor) when editing begins.
*/

class EditBox extends React.Component<Props, State> {
  // Store the initial value so the div element never updates
  state = {
    initialValue: this.props.initialValue
  };
  static defaultProps = {
    autoFocus: false
  };
  _inputRef = React.createRef<HTMLDivElement>();

  onKeyDown = (e: SyntheticKeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      this.props.onEnter();
    } else if (e.key === 'Escape') {
      this.props.onCancel();
    }
  };

  onInput = (e: SyntheticInputEvent<HTMLDivElement>) => {
    this.props.onChange(e.currentTarget.textContent);
  };

  componentDidMount() {
    const inputEl = this._inputRef.current;
    if (!inputEl) {
      return;
    }

    if (this.props.autoFocus && inputEl !== document.activeElement) {
      inputEl.focus();

      // By default, the focus seems to go to the front of the content.
      // This code moves the cursor to the end of the text.
      const range = document.createRange();
      range.selectNodeContents(inputEl);
      range.collapse(false);

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  render() {
    return (
      <div
        ref={this._inputRef}
        className='edit-box'
        contentEditable
        dangerouslySetInnerHTML={{ __html: this.state.initialValue }}
        onClick={(e: SyntheticMouseEvent<HTMLInputElement>) =>
          e.stopPropagation()
        }
        onInput={this.onInput}
        onKeyDown={this.onKeyDown}
      />
    );
  }
}

export default EditBox;
