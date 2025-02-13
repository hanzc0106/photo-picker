import { defineStore } from 'pinia'

export const useDirSettings = defineStore('dirSettings', {
  state: () => ({
    dir: '',
    dirFiles: [],
    deleteRaw: false
  }),
  getters: {},
  actions: {
    setDir(dir) {
      this.dir = dir
    },
    setDirFiles(files) {
      this.dirFiles = files
    },
    setDeleteRaw(deleteRaw) {
      this.deleteRaw = deleteRaw
    }
  }
})
