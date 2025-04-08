<script setup>
import { ref, onMounted, onUnmounted, h, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDirSettings, useImgDisplay } from '../store'
import { useDeleteImg } from '../hooks/useDeleteImg'

const storeDirSettings = useDirSettings()
const { dir: dirInput, dirFiles, deleteRaw: shouldDeleteRaw } = storeToRefs(storeDirSettings)
const { setDeleteRaw } = storeDirSettings

const storeImgDisplay = useImgDisplay()
const { displayImg } = storeToRefs(storeImgDisplay)
const { setDisplayImg } = storeImgDisplay

const displayImgName = computed(() => displayImg.value.split('/').pop())
const imgDisplayDivRef = ref(null)

const handleKeyUp = (event) => {
  switch (event.key) {
    case 'Delete':
      handleDelete()
      break
    case 'ArrowLeft':
      handlePrev()
      break
    case 'ArrowRight':
      handleNext()
      break
    case 'Escape':
      handleClose()
      break
  }
}

const handleCheck = async (event) => {
  const checked = event.target.checked
  setDeleteRaw(checked)
  await window.api.setSetting('deleteRaw', checked)
}

const deleteImg = useDeleteImg()

const handleDelete = async () => {
  if (displayImg.value) {
    await deleteImg(displayImg.value.split('/').pop())
    return
  }
}

const handleClose = async () => {
  setDisplayImg('')

  document.body.style.overflow = 'auto'
}

const handlePrev = async () => {
  const index = dirFiles.value.indexOf(displayImg.value.split('/').pop())
  if (index > 0) {
    setDisplayImg(dirInput.value, dirFiles.value[index - 1])
  } else {
    setDisplayImg(dirInput.value, dirFiles.value[dirFiles.value.length - 1])
  }
}

const handleNext = async () => {
  const index = dirFiles.value.indexOf(displayImg.value.split('/').pop())
  if (index < dirFiles.value.length - 1) {
    setDisplayImg(dirInput.value, dirFiles.value[index + 1])
  } else {
    setDisplayImg(dirInput.value, dirFiles.value[0])
  }
}

onMounted(() => {
  document.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  document.removeEventListener('keyup', handleKeyUp)
})
</script>

<template>
  <div v-show="displayImg" ref="imgDisplayDivRef" class="img-display" @click="handleCloseDisplay">
    <h1 class="title">{{ displayImgName }}</h1>
    <img class="display-img" :src="displayImg" />
    <div class="img-display-operation">
      <button @click="handleClose">关闭</button>
      <button @click="handleDelete">删除</button>
      <label>
        <span>删除RAF</span>
        <input v-model="shouldDeleteRaw" type="checkbox" @change="handleCheck" />
      </label>
    </div>
    <button class="img-prev" @click="handlePrev">上一张</button>
    <button class="img-next" @click="handleNext">下一张</button>
  </div>
</template>

<style scoped>
.img-display {
  z-index: 30;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #fff;
  font-size: 24px;
  font-weight: bold;
}

.display-img {
  max-width: 100%;
  max-height: 100%;
}

.img-display-operation {
  position: absolute;
  right: 10px;
  top: 10px;

  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
}

.img-display-operation button {
  padding: 5px 10px;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #000;
  border-radius: 5px;
}

.img-display-operation label {
  display: flex;
  align-items: center;
  gap: 10px;
}

.img-display-operation input[type='checkbox'] {
  width: 20px;
  height: 20px;
}

.img-prev,
.img-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  padding: 5px 10px;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #000;
  border-radius: 5px;
}

.img-prev {
  left: 10px;
}

.img-next {
  right: 10px;
}
</style>
