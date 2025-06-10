<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDirSetting, useDisplayImage } from '@/store'
import { useDeleteImage } from '@/hooks/useDeleteImg'
import ImgListItem from './ImgListItem.vue'

const storeDirSetting = useDirSetting()
const { dir, dirFiles } = storeToRefs(storeDirSetting)

const storeDisplayImage = useDisplayImage()
const { displayImg } = storeToRefs(storeDisplayImage)
const { setDisplayImg } = storeDisplayImage

const handleDisplay = async img => {
  setDisplayImg(encodeURI('file://' + dir.value + '/' + img))

  document.body.style.overflow = 'hidden'
}

const deleteImage = useDeleteImage()

const handleDelete = async fileName => {
  console.log('delete')
  if (fileName) {
    await deleteImage(fileName)
    return
  }

  if (displayImg.value) {
    await deleteImage(displayImg.value.split('/').pop() as string)
    return
  }
}
</script>

<template>
  <ul class="file-ul">
    <ImgListItem
      v-for="file in dirFiles"
      :key="file"
      :img-path="encodeURI('file://' + dir + '/' + file)"
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
