import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  selectDirectory: () => electronAPI.ipcRenderer.invoke('select-directory'),
  scanDirectory: () => electronAPI.ipcRenderer.invoke('scan-directory'),
  getSettings: () => electronAPI.ipcRenderer.invoke('get-settings'),
  getSetting: (key) => electronAPI.ipcRenderer.invoke('get-setting', key),
  setSetting: (key, value) => electronAPI.ipcRenderer.invoke('set-setting', key, value),
  deleteImg: (file, deleteRaw) => electronAPI.ipcRenderer.invoke('delete-img', file, deleteRaw)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
