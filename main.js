const {
  app,
  BrowserWindow
} = require('electron')
const url = require('url')
let path = require('path')
const {
  ipcMain
} = require('electron')

let win

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 900,
    icon: path.join(__dirname, 'assets/icons/png/128x128.png')
  })
  win.loadURL(url.format({

    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true

  }))
}

ipcMain.on('openFile', (event, path) => {
  const {
    dialog
  } = require('electron');
  const fs = require('fs');

  dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory']
  }, function(fileNames) {
    if (fileNames === undefined) {
      console.log("No file selected");

    } else {
      fs.stat(fileNames[0], (err, stats) => {
        if (stats.isDirectory()) { //if selected is a directory or single file
          fs.readdir(fileNames[0], (err, files) => {
            data = { //data object
              dFiles: files, //file array
              dWdir: fileNames[0] //working directory
            };
            event.sender.send('fileData', data);
          })
        } else { //not a directory
          event.sender.send('fileData', fileNames[0]); //send the whole path
        }
      })
    }
  });

})
app.on('ready', createWindow)
