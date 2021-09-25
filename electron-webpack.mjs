import { spawn } from 'child_process';
import electron from 'electron';
import { createServer } from 'net';
import kill from 'tree-kill';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import mainConfig from './webpack.main.config.js';
import rendererConfig from './webpack.renderer.config.js';

function getFreePort(defaultHost, defaultPort) {
  return new Promise((resolve, reject) => {
    const server = createServer({ pauseOnConnect: true });

    function doListen(port) {
      server.listen({
        host: defaultHost,
        port,
        backlog: 1,
        exclusive: true
      });
    }

    server.addListener('listening', () => {
      const info = server.address();
      // info is string if connected to pipe
      server.close(() =>
        info == null || typeof info === 'string'
          ? doListen(0)
          : resolve(info.port)
      );
    });

    server.on('error', e => {
      if (e.code === 'EADDRINUSE') {
        server.close(() => doListen(0));
      } else {
        reject(e);
      }
    });

    doListen(defaultPort);
  });
}

async function startMain() {
  console.log(`MAIN: Starting webpack`);

  const config = await mainConfig({}, { mode: 'development' });
  const compiler = webpack(config);

  return new Promise((resolve, reject) => {
    compiler.hooks.done.tap('electron-main', () => {
      resolve(compiler);
    });

    compiler.watch(config.watchOptions, error => {
      if (error) {
        console.error('MAIN:', error.message);
        reject(error);
      }
    });
  });
}

async function startRenderer(port) {
  console.log(`RENDERER: Starting WDS on http://localhost:${port}`);

  const config = await rendererConfig({}, { mode: 'development' });
  const compiler = webpack(config);
  const wds = new WebpackDevServer(config.devServer, compiler);

  return new Promise((resolve, reject) => {
    compiler.hooks.done.tap('electron-renderer', () => {
      resolve(wds);
    });

    wds.start().catch(error => {
      if (error) {
        console.error('electron-renderer:', error.message);
        reject(error);
      }
    });
  });
}

function startElectron(rendererPort) {
  console.log('Electron: located at', electron);
  console.log(`Electron: launching at './dist/main/main.js`);

  const electronProcess = spawn(
    electron,
    ['./dist/main/main.js', ...process.argv.slice(2)],
    {
      env: {
        ...process.env,
        ELECTRON_RENDERER_PORT: rendererPort
      }
    }
  );

  electronProcess.stdout.on('data', data => {
    console.log('Electron data:', data.toString());
  });

  electronProcess.stderr.on('data', data => {
    console.error('Electron err:', data.toString());
  });

  return electronProcess;
}

const rendererPort = await getFreePort('localhost', 9080);
const rendererDevServer = await startRenderer(rendererPort);

let electronProcess = null;
const mainDevServer = await startMain();
console.log('MAIN: rebuilt');

if (electronProcess != null) {
  console.log('Existing running electron, closing first');
  electronProcess.off('close', close);

  kill(electronProcess.pid, error => {
    if (error) throw error;
    initElectron();
  });
} else {
  initElectron();
}

function initElectron() {
  console.log('Starting up new electron');
  electronProcess = startElectron(rendererPort);
  electronProcess.on('close', close);
}

async function close(exitCode) {
  console.debug(`Electron exited with exit code ${exitCode}`);
  console.log('Closing dev servers...');

  await rendererDevServer.stop();
  console.log('Renderer WDS closed');

  mainDevServer.close(() => {
    console.log('Main WDS closed');

    process.exit(exitCode);
  });
}

process.on('SIGINT', () => {
  electronProcess.kill('SIGINT');
  close(1);
});
