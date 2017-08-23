const { ipcRenderer } = require('electron');

const IntercomMessengerBridge = {
  getSettings() {
    return ipcRenderer.sendSync('electron-intercom-messenger/get-settings');
  }
}

window.IntercomMessengerBridge = IntercomMessengerBridge;
