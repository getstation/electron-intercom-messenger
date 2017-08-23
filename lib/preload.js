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

window.intercomMessengerBridge = new IntercomMessengerBridge;
