// @flow strict

import React from 'react';
import ReactDOM from 'react-dom';

import type { Node } from 'react';

import '../../css/modal.scss';

type Props = {|
  +isOpen: boolean,
  +className: string,
  +onClose: () => void,
  +children: React$Node
|};

export default function Modal(props: Props): Node {
  const onOutsideClick = (e: SyntheticMouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    props.onClose();
  };

  const onInsideClick = (e: SyntheticMouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  if (!props.isOpen || document.body == null) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className='modal' onClick={onOutsideClick}>
      <div className={props.className} onClick={onInsideClick}>
        {props.children}
      </div>
    </div>,
    document.body
  );
}
