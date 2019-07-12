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

export default function Modal(props: Props) {
  function onOutsideClick(e: SyntheticMouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    props.onClose();
  }

  function onInsideClick(e: SyntheticMouseEvent<HTMLDivElement>) {
    e.stopPropagation();
  }

  if (props.isOpen && document.body != null) {
    return ReactDOM.createPortal(
      <div className='modal' onClick={onOutsideClick}>
        <div className={props.className} onClick={onInsideClick}>
          {props.children}
        </div>
      </div>,
      document.body
    );
  }

  return null;
}
