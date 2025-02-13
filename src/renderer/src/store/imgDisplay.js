import { defineStore } from 'pinia'

export const useImgDisplay = defineStore('imgDisplay', {
  state: () => ({
    displayImg: ''
  }),
  getters: {},
  actions: {
    setDisplayImg(displayImg) {
      this.displayImg = displayImg
    }
  }
})
