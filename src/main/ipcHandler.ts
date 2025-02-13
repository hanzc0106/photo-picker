import { ipcMain, dialog } from 'electron'
import fs from 'fs'
import path from 'path'
import settings from 'electron-settings'

export function ipcHandle() {
  ipcMain.handle('select-directory', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    return result.filePaths[0]
  })

  ipcMain.handle('scan-directory', async () => {
    const dir = (await settings.get('directory')) as string
    const files = fs.readdirSync(path.resolve(dir))
    return files.filter((file) => file.toLocaleLowerCase().endsWith('.jpg'))
  })

  ipcMain.handle('get-setting', async (event, key) => {
    return settings.get(key)
  })

  ipcMain.handle('set-setting', async (event, key, value) => {
    settings.set(key, value)

    return true
  })

  ipcMain.handle('delete-img', async (event, img, deleteRaw) => {
    console.log('delete-img', img, deleteRaw)
    const dir = (await settings.get('directory')) as string
    const imgPath = path.resolve(dir, img)

    // 获取无后缀的文件名
    if (fs.existsSync(imgPath)) {
      console.log('delete jpg: ', imgPath)
      fs.rmSync(imgPath)
    }

    if (deleteRaw) {
      const rawImg = path.parse(img).name + '.RAF'
      const rawPath = path.resolve(dir, rawImg)
      if (fs.existsSync(rawPath)) {
        console.log('delete raw: ', rawPath)
        fs.rmSync(rawPath)
      }
    }

    console.log('delete success: ', imgPath.toString())
    return true
  })
}
