import { defineStore } from 'pinia'

interface IDirSettings {
  dir: string
  dirFiles: string[]
  deleteRaw: boolean
}

export const useDirSettings = defineStore('dirSettings', {
  state: (): IDirSettings => ({
    dir: '',
    dirFiles: [],
    deleteRaw: false
  }),
  getters: {},
  actions: {
    setDir(dir: string) {
      this.dir = dir
    },
    setDirFiles(files: string[]) {
      this.dirFiles = files
    },
    setDeleteRaw(deleteRaw: boolean) {
      this.deleteRaw = deleteRaw
    }
  }
})
