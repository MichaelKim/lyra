// @flow strict

import * as React from 'react';
import { remote } from 'electron';

export type Props = {|
  +className: string,
  +rightClick?: boolean,
  +items: Array<{|
    +label: string,
    +click: () => void
  |}>,
  +children: React.Node
|};

export default function ContextMenu(props: Props) {
  function openMenu() {
    const menu = new remote.Menu();
    for (const item of props.items) {
      const menuItem = new remote.MenuItem(item);
      menu.append(menuItem);
    }
    menu.popup(remote.getCurrentWindow());
  }

  function onClick(e) {
    if (!props.rightClick) {
      e.stopPropagation();
      openMenu();
    }
  }

  function onContextMenu(e) {
    if (props.rightClick) {
      e.stopPropagation();
      e.preventDefault();
      openMenu();
    }
  }

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
