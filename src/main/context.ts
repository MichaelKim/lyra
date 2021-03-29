// @flow strict
// Context menus

import { ipcMain, Menu, MenuItem } from 'electron';

type Items = {|
  [id: string]: string
|};

export function loadMenuListener() {
  ipcMain.on('menu-show', (event, items: Items) => {
    console.log('menu showing');
    const menu = new Menu();
    for (const [id, label] of Object.entries(items)) {
      const menuItem = new MenuItem({
        label: label,
        click: () => {
          event.reply('menu-click', id);
        }
      });
      menu.append(menuItem);
    }
    menu.popup();
  });
}
