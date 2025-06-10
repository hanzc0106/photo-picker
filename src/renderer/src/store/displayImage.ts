import { defineStore } from 'pinia'

interface IDisplayImage {
  displayImg: string
}

export const useDisplayImage = defineStore('displayImage', {
  state: (): IDisplayImage => ({
    displayImg: ''
  }),
  getters: {},
  actions: {
    setDisplayImg(displayImg) {
      this.displayImg = displayImg
    }
  }
})
