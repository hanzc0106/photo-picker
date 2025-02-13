import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: typeof electronAPI
    api: ApiType
  }
}

export type ApiType = typeof api

// Custom APIs for renderer
const api = {
  selectDirectory: () => electronAPI.ipcRenderer.invoke('select-directory'),
  scanDirectory: () => electronAPI.ipcRenderer.invoke('scan-directory'),
  getSetting: (key: string) => electronAPI.ipcRenderer.invoke('get-setting', key),
  setSetting: (key: string, value: any) =>
    electronAPI.ipcRenderer.invoke('set-setting', key, value),
  deleteImg: (file: string, deleteRaw: boolean) =>
    electronAPI.ipcRenderer.invoke('delete-img', file, deleteRaw)
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
