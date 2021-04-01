// Context menus

import { ipcMain, Menu, MenuItem } from 'electron';

export function loadMenuListener() {
  ipcMain.handle('menu-show', (_, items: Record<string, string>) => {
    return new Promise(resolve => {
      const menu = new Menu();
      for (const [id, label] of Object.entries(items)) {
        const menuItem = new MenuItem({
          label: label,
          click: () => resolve(id)
        });
        menu.append(menuItem);
      }
      menu.popup();
    });
  });
}
