const { ipcRenderer } = require('electron');
const { EventEmitter } = require('events');

class IntercomMessengerBridge extends EventEmitter {
  constructor() {
    super();
    ipcRenderer.on(
      'electron-intercom-messenger/call-intercom-method',
      (e, methodName, arg1) => this.emit('call-method', methodName, arg1)
    );
  }
  getSettings() {
    return ipcRenderer.sendSync('electron-intercom-messenger/get-settings');
  }
}

window.intercomMessengerBridge = new IntercomMessengerBridge;
