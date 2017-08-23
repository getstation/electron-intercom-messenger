const { protocol, ipcMain } = require('electron');
const path = require('path');

const scheme = 'electron-intercom-messenger';
protocol.registerStandardSchemes([scheme]);

exports.start = (intercomSettings) => {
  protocol.registerFileProtocol(scheme, (request, cb) => {
    if (request.url === `${scheme}://embedded/`) {
      const filePath = path.join(__dirname, 'embedded.html');
      console.log(filePath)
      return cb(filePath);
    }
    cb();
  });
  
  ipcMain.on('electron-intercom-messenger/get-settings', (event, arg) => {
    event.returnValue = intercomSettings;
  })  
}


