import { defineStore } from 'pinia'

export const useImgDisplay = defineStore('imgDisplay', {
  state: () => ({
    displayImg: ''
  }),
  getters: {},
  actions: {
    setDisplayImg(dirName, fileName) {
      if (!dirName || !fileName) {
        this.displayImg = ''
        return
      }
      this.displayImg = encodeURI(`file://${dirName}/${fileName}`)
    }
  }
})
