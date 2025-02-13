import { defineStore } from 'pinia'

export const useDirSettings = defineStore({
  state: () => ({
    dir: '',
    deleteRaw: false
  }),
  getters: {},
  actions: {
    setDir
  }
})
