import { app, BrowserWindow } from 'neutrinojs';

let win = null;

const isDevelopment = process.env.NODE_ENV !== 'production';

function createWindow() {
  app.log('creating window');

  const options = {
    width: 1280,
    height: 720,
    title: 'Lyra Music Player',
    backgroundColor: '#333'
  };

  win = new BrowserWindow(options);

  if (isDevelopment) {
    win.loadURL('http://localhost:8080/index.html');
  } else {
    win.loadURL('file://' + __dirname + '/index.html');
  }

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// app.on('activate', () => {
//   if (win === null) {
//     createWindow();
//   }
// });

export default app;
