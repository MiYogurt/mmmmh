import {
  app,
  BrowserWindow,
  Menu,
  Tray,
  nativeImage,
  ipcMain,
  Notification,
  autoUpdater,
  dialog
} from 'electron'
import { enableLiveReload } from 'electron-compile'
import { appReady, is } from 'electron-util'
import { resolve, parse } from 'path'
import fs from 'fs-extra'
import glob from 'fast-glob'
import sharp from 'sharp'
import homeDir from 'user-home'
import { dirSync } from 'path-type'

if (is.development) {
  const unhandled = require('electron-unhandled')
  unhandled()
}

const menubar = require('menubar')

const log = (...args) => {
  if (is.development) {
    console.log(...args)
  }
}

const handleImage = fileOrFolder => {
  if (Array.isArray(fileOrFolder)) {
    return fileOrFolder.forEach(handleImage)
  }

  if (dirSync(fileOrFolder)) {
    const files = glob.sync(resolve(fileOrFolder, '**/*.{png,jpg,jpeg,webp}'))
    return handleImage(files)
  }
  const file = fileOrFolder
  const { name: filename } = parse(file)
  const outputPath = resolve(homeDir, 'Pictures/mmmmh')

  if (!fs.pathExistsSync(outputPath)) {
    fs.mkdirsSync(outputPath)
  }

  log('handle ' + file)
  return sharp(file)
    .webp()
    .toFile(resolve(outputPath, filename + '.webp'))
    .then(info => {
      if (Notification.isSupported()) {
        new Notification({
          title: '压缩完成',
          body: filename,
          soundString: resolve('/System/Library/Sounds', 'Ping.aiff')
        }).show()
      }
    })
    .catch(console.error)
}

const mb = menubar({
  icon: resolve(__dirname, '../icon/tray.png'),
  index: 'file://' + resolve(__dirname, './index.html'),
  transparent: true,
  alwaysOnTop: true,
  width: 300,
  height: 200
})

mb.on('ready', function ready() {
  log('app is ready')
  if (is.development) enableLiveReload()
  const { tray, app } = mb

  tray.on('right-click', () => {
    tray.popUpContextMenu(require('./menu.js').default)
  })

  tray.on('drop-files', (e, files) => {
    log(files)
    handleImage(files)
  })
})

mb.on('after-create-window', () => {
  if (is.development) mb.window.webContents.openDevTools()
})

ipcMain.on('files', (event, files) => {
  log(files)
  handleImage(files)
})
