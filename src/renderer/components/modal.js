// @flow strict

import * as React from 'react';
import ReactDOM from 'react-dom';

import '../../css/modal.scss';

type Props = {|
  isOpen: boolean,
  className: string,
  onClose: () => void,
  children: React.Node
|};

class Modal extends React.Component<Props> {
  _onOutsideClick = (e: SyntheticMouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    this.props.onClose();
  };

  _onInsideClick = (e: SyntheticMouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  render() {
    if (this.props.isOpen && document.body != null) {
      return ReactDOM.createPortal(
        <div className='modal' onClick={this._onOutsideClick}>
          <div className={this.props.className} onClick={this._onInsideClick}>
            {this.props.children}
          </div>
        </div>,
        document.body
      );
    }

    return null;
  }
}

export default Modal;
