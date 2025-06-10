import { defineStore } from 'pinia'

interface IDirSetting {
  dir: string
  dirFiles: string[]
  deleteRaw: boolean
}

export const useDirSetting = defineStore('dirSetting', {
  state: (): IDirSetting => ({
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
