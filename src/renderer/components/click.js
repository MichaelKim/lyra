// @flow strict

import * as React from 'react';

// Max delay in ms between two clicks
const DBL_CLICK_DELAY = 250;

type Props = {|
  +onSngClick?: (e: SyntheticMouseEvent<HTMLDivElement>) => void,
  +onDblClick: (e: SyntheticMouseEvent<HTMLDivElement>) => void,
  +children: React.Node,
  +className?: string
|};

export default function Click(props: Props) {
  // Double click
  let isDblClick: boolean = false;
  let clickTimer: ?TimeoutID = null;

  function onClick(e: SyntheticMouseEvent<HTMLDivElement>) {
    e.stopPropagation();

    // Make it easier to double click
    if (clickTimer != null) {
      onDblClick(e);
      return;
    }

    // Don't fire click handler if double click
    clickTimer = setTimeout(() => {
      if (!isDblClick) {
        props.onSngClick && props.onSngClick(e);
      }
      clickTimer = null;
      isDblClick = false;
    }, DBL_CLICK_DELAY);
  }

  function onDblClick(e: SyntheticMouseEvent<HTMLDivElement>) {
    // Don't fire single click handler
    clickTimer && clearTimeout(clickTimer);
    clickTimer = null;
    isDblClick = true;

    props.onDblClick(e);
  }

  return (
    <div className={props.className || ''} onClick={onClick}>
      {props.children}
    </div>
  );
}
