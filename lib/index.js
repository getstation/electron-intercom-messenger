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
exports.start = (intercomSettings) => {
  if (!instance) instance = new IntercomMessenger(intercomSettings);
  return instance;
}

