const { ipcRenderer } = require('electron');
const { EventEmitter } = require('events');

class IntercomMessengerBridge extends EventEmitter {
  getSettings() {
    return ipcRenderer.sendSync('electron-intercom-messenger/get-settings');
  }
}

window.intercomMessengerBridge = new IntercomMessengerBridge;
