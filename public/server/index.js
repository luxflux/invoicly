const { initializeDB } = require('./db');

const serverHandlers = require('./handlers');
const ipc = require('./ipc');

let isDev, version;

if (process.argv[2] === '--subprocess') {
  isDev = false;
  version = process.argv[3];

  const socketName = process.argv[4];
  initializeDB(process.argv[5]).then(() => {
    ipc.init(socketName, serverHandlers);
  });
} else {
  const { ipcRenderer, remote } = require('electron');
  isDev = true;
  version = remote.app.getVersion();

  ipcRenderer.on('set-socket', (event, { name }) => {
    initializeDB(`${remote.app.getPath('userData')}/invoicly.sqlite3`).then(() => {
      ipc.init(name, serverHandlers);
    });
  });
}

console.log(version, isDev);
