const { ipcRenderer } = require('electron');
const { EventEmitter } = require('events');
const SelectorObserver = require('selector-observer');

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

  getOptions() {
    return ipcRenderer.sendSync('electron-intercom-messenger/get-options');
  }

  notifyDidLoad() {
    this._emitInMain('did-load');
  }

  notifyDidShow() {
    this._emitInMain('did-show');
  }

  notifyDidHide() {
    this._emitInMain('did-hide');
  }

  notifyUnreadCountChange(unreadCount) {
    this._emitInMain('unread-count-change', unreadCount);
  }


  _emitInMain(eventName, arg1) {
    ipcRenderer.send('electron-intercom-messenger/emit-in-main', eventName, arg1);
  }
}

ipcRenderer.send('electron-intercom-messenger/register');

window.intercomMessengerBridge = new IntercomMessengerBridge;
// used the embdded
window.SelectorObserver = SelectorObserver


// This is a hack: it looks to me that Intercom tries to detect if we are running
// in Electron by looking at `window.versions`. However, `versions` is on `process`,
// not `window`.
// So i'm doing the necessary so that Intercom understand we are in Electron: 
setTimeout(() => {
  // use setTimeout, because window.process is erased after preload execution
  window.process = window.process || {};
}, 0);
window.versions = require('process').versions;
