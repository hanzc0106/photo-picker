<script setup>
import { storeToRefs } from 'pinia'
import { useDirSettings, useImgDisplay } from '../store'
import ImgListItem from './ImgListItem.vue'
import { useDeleteImg } from '../hooks/useDeleteImg'

const storeDirSettings = useDirSettings()
const { dir: dirInput, dirFiles } = storeToRefs(storeDirSettings)

const storeImgDisplay = useImgDisplay()
const { displayImg } = storeToRefs(storeImgDisplay)
const { setDisplayImg } = storeImgDisplay

const handleDisplay = async (img) => {
  setDisplayImg(encodeURI('file://' + dirInput.value + '/' + img))

  document.body.style.overflow = 'hidden'
}

const deleteImg = useDeleteImg()

const handleDelete = async (fileName) => {
  console.log('delete')
  if (fileName) {
    await deleteImg(fileName)
    return
  }

  if (displayImg.value) {
    await deleteImg(displayImg.value.split('/').pop())
    return
  }
}
</script>

<template>
  <ul class="file-ul">
    <ImgListItem
      v-for="file in dirFiles"
      :key="file"
      :img-path="encodeURI('file://' + dirInput + '/' + file)"
      :img-name="file"
      @on-display="handleDisplay(file)"
      @on-delete="handleDelete(file)"
    />
  </ul>
</template>

<style scoped>
.file-ul {
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 10px;
}
</style>
