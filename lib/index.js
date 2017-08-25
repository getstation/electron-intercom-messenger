const { protocol, ipcMain, webContents } = require('electron');
const path = require('path');
const { EventEmitter } = require('events');

const scheme = 'electron-intercom-messenger';
protocol.registerStandardSchemes([scheme]);

const schemeRegExp = new RegExp(`^${scheme}:\/\/`);
const getAllIntercomMessengerWebContents = () =>
  webContents
    .getAllWebContents()
    .filter(wc => {
      const url = wc.getURL();
      return url && url.match(schemeRegExp);
    });

class IntercomMessenger extends EventEmitter {
  constructor(intercomSettings, options = {}) {
    super();
    this.settings = intercomSettings;
    this.options = options;

    ipcMain.on('electron-intercom-messenger/get-settings', (event, arg) => {
      event.returnValue = this.settings;
    })

    ipcMain.on('electron-intercom-messenger/get-options', (event, arg) => {
      event.returnValue = this.options;
    })

    ipcMain.on('electron-intercom-messenger/emit-in-main', (e, eventName, arg1) => {
      this.emit(eventName, arg1);
    })

    protocol.registerFileProtocol(scheme, (request, cb) => {
      if (request.url === `${scheme}://embedded/`) {
        const filePath = path.join(__dirname, 'embedded.html');
        return cb(filePath);
      }
      cb();
    });
  }

  show() {
    this._callIntercomMethod('show');
  }

  hide() {

  }

  update(data) {
    this._callIntercomMethod('hide');
  }

  _callIntercomMethod(methodName, arg1) {
    const wcs = getAllIntercomMessengerWebContents();
    wcs.forEach(wc =>
      wc.send(
        'electron-intercom-messenger/call-intercom-method',
        methodName, arg1)
    );
  }
}

// single instance
let instance = null;
exports.start = (intercomSettings, options) => {
  if (!instance) instance = new IntercomMessenger(intercomSettings, options);
  return instance;
}

