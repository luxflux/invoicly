const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { fork } = require('child_process');
const fs = require('fs');
const findOpenSocket = require('./find-open-socket');

const path = require('path');
const isDev = require('electron-is-dev');

let clientWin;
let serverWin;
let serverProcess;
let serverSocket;

function createWindow(serverSocket) {
  clientWin = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + '/preload.js',
    },
  });
  clientWin.loadURL(
    isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, './index.html')}`,
  );
  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    clientWin.webContents.openDevTools();
  }
  clientWin.on('closed', () => (clientWin = null));

  clientWin.webContents.on('did-finish-load', () => {
    clientWin.webContents.send('set-socket', {
      name: serverSocket,
    });
  });
}

function createBackgroundWindow(socketName) {
  serverWin = new BrowserWindow({
    x: 500,
    y: 300,
    width: 700,
    height: 500,
    show: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  serverWin.loadURL(`file://${__dirname}/server/dev.html`);

  serverWin.webContents.on('did-finish-load', () => {
    serverWin.webContents.send('set-socket', {
      name: socketName,
    });
  });
  serverWin.webContents.openDevTools();
}

const dbPath = `${app.getPath('userData')}/invoicly.sqlite3`;

function createBackgroundProcess(socketName) {
  serverProcess = fork(__dirname + '/server/index.js', [
    '--subprocess',
    app.getVersion(),
    socketName,
    dbPath,
  ]);

  serverProcess.on('message', msg => {
    console.log(msg);
  });
}

app.on('ready', async () => {
  serverSocket = await findOpenSocket();

  createWindow(serverSocket);

  if (isDev) {
    createBackgroundWindow(serverSocket);
  } else {
    createBackgroundProcess(serverSocket);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (clientWin === null) {
    createWindow(serverSocket);
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
});

ipcMain.on('save-invoice-pdf', (event, filePath) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  return win.webContents.printToPDF({}).then((data, error) => {
    if (error) throw error;
    return fs.writeFile(filePath, data, error => {
      if (error) throw error;
      shell.openExternal(`file://${filePath}`);
    });
  });
});
