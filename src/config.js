import Store from 'electron-store'
import homeDir from 'user-home'
import { resolve } from 'path'
import { forEachObjIndexed, not } from 'ramda'
import firstRun from 'first-run'
import { appReady, loadFile, is } from 'electron-util'
import { BrowserWindow, ipcMain, dialog } from 'electron'
import Positioner from 'electron-positioner'

const store = new Store()
/**
 * 第一次运行的时候初始化默认设置
 */
function initDefaultSetting() {
    const defaultConfiguration = {
        savePath: resolve(homeDir, 'Pictures/mmmmh'),
        outputType: 'webp'
    }
    console.log('init default configuration')
    store.store = defaultConfiguration
}

firstRun() && initDefaultSetting()

let singleWin = null

function newWindow(config, url) {
    return new Promise((resolve, reject) => {
        if (singleWin) {
            return singleWin.focus()
        }
        singleWin = new BrowserWindow(
            Object.assign({}, { show: false }, config)
        )
        loadFile(singleWin, url)
        singleWin.on('closed', () => {
            singleWin = null
            console.log('closed')
        })
        singleWin.once('ready-to-show', () => {
            singleWin.show()
            resolve(singleWin)
            if (is.development) singleWin.webContents.openDevTools()
        })
    })
}

export async function showConfigWindow() {
    try {
        await appReady
        singleWin = await newWindow(
            {
                width: 400,
                height: 300,
                center: true,
                titleBarStyle: 'hiddenInset',
                backgroundColor: '#fff',
                frame: false,
                minimizable: false,
                maximizable: false
            },
            resolve(__dirname, './config.html')
        )
    } catch (e) {
        console.log(e)
    }
}

const set = returnChanel => (event, { name, value }) => {
    console.log('name ' + name)
    console.log('value ' + value)
    store.set(name, value)
    if (singleWin) {
        singleWin.webContents.send(returnChanel, { name, value })
    }
}

export { set }

ipcMain.on('config:path', set('config:update'))
ipcMain.on('config:type', set('config:update'))

ipcMain.on('config:open-file', event => {
    dialog.showOpenDialog(
        singleWin,
        {
            titie: '设置输出路径',
            properties: ['openDirectory', 'createDirectory']
        },
        filePaths => {
            console.log(filePaths)
            filePaths.length &&
                set('config:update')(null, {
                    name: 'savePath',
                    value: filePaths[0]
                })
        }
    )
})
ipcMain.on('config:read', event => {
    return (event.returnValue = store.store)
})

export default store
