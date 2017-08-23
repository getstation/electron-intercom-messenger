const { protocol, ipcMain } = require('electron');
const path = require('path');
const { EventEmitter } = require('events');

const scheme = 'electron-intercom-messenger';
protocol.registerStandardSchemes([scheme]);

class IntercomMessenger extends EventEmitter {
  constructor(intercomSettings) {
    super();
    this.settings = intercomSettings;

    ipcMain.on('electron-intercom-messenger/get-settings', (event, arg) => {
      event.returnValue = this.settings;
    })

    protocol.registerFileProtocol(scheme, (request, cb) => {
      if (request.url === `${scheme}://embedded/`) {
        const filePath = path.join(__dirname, 'embedded.html');
        return cb(filePath);
      }
      cb();
    });
  }
}

// single instance
let instance = null;
exports.start = (intercomSettings) => {
  if (!instance) instance = new IntercomMessenger(intercomSettings);
  return instance;
}

