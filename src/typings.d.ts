interface Window {
  menu: typeof import('./main/preload').menu;
  state: typeof import('./main/preload').state;
  util: typeof import('./main/preload').util;
  ytUtil: typeof import('./main/preload').ytUtil;
}
