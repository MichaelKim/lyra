// @flow strict

import { ipcRenderer } from 'electron';
import React from 'react';

export type Props = {|
  +className: string,
  +rightClick?: boolean,
  +items: Array<{|
    +label: string,
    +click: () => void
  |}>,
  +children: React$Node
|};

export default function ContextMenu(props: Props) {
  const openMenu = () => {
    const labels = {};
    const clicks = {};
    for (const item of props.items) {
      const id = Math.random().toString(36).substr(2, 9);
      labels[id] = item.label;
      clicks[id] = item.click;
    }
    ipcRenderer.send('menu-show', labels);
    ipcRenderer.once('menu-click', (event, id: string) => {
      clicks[id]?.();
    });
  };

  const onClick = (e: SyntheticMouseEvent<HTMLDivElement>) => {
    if (!props.rightClick) {
      e.stopPropagation();
      openMenu();
    }
  };

  const onContextMenu = (e: SyntheticMouseEvent<HTMLDivElement>) => {
    if (props.rightClick) {
      e.stopPropagation();
      e.preventDefault();
      openMenu();
    }
  };

  return (
    <div
      className={props.className}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {props.children}
    </div>
  );
}
