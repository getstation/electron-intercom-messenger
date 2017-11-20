const electron = require('electron');
const { INTERCOM_APP_ID } = process.env;

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const electronIntercomMessenger = require('../lib/index.js');

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  //
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)
app.on('ready', () => {
  const i = electronIntercomMessenger.start({
    app_id: INTERCOM_APP_ID
  }, {
      injectCSSInMessengerFrame: '.intercom-header-buttons-close-visible { visibility: hidden; }'
    });
 
   i.on('did-load', () => {
     console.log('Intercom did load')
    i.show();
  })
  i.on('did-show', () => {
    console.log('did-show');
  })
  i.on('unread-count-change', unreadCount => console.log('Intercom unreadCount', unreadCount))
  i.on('new-window', (e, url, frameName, disposition, options, additionalFeatures) => {
    e.preventDefault();
  
    console.log('New window', url);
  });
  intercomWindow = new BrowserWindow({
    width: 300,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, '../preload'),
      nativeWindowOpen: true
    }
  })
  intercomWindow.loadURL('electron-intercom-messenger://embedded')
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// some webapps (mixmax) have a special behavior when we see we are on Electron
// we don't want that so we remove the Electron mention
app.on('session-created', session => {
  const userAgent = session.getUserAgent();
  session.setUserAgent(userAgent.replace(/Electron\/\S*\s/, ''));
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.