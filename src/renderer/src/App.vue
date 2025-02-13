<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const dirInput = ref('')
const dirFiles = ref([])
const displayImg = ref('')
const imgDisplayDivRef = ref(null)
const shouldDeleteRaw = ref(false)

onMounted(async () => {
  const directory = await window.api.getSetting('directory')
  const deleteRaw = await window.api.getSetting('deleteRaw')

  if (directory) {
    dirInput.value = directory.replace(/\\/g, '/')
  }

  shouldDeleteRaw.value = !!deleteRaw
})

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

onMounted(() => {
  document.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  document.removeEventListener('keyup', handleKeyUp)
})

const handleChange = async (event) => {
  const dir = event.target.value
  dirInput.value = dir.replace(/\\/g, '/')
  dirFiles.value = []
  await window.api.setSetting('directory', dir)
}

const handleCheck = async (event) => {
  const checked = event.target.checked
  shouldDeleteRaw.value = event.target.checked
  await window.api.setSetting('deleteRaw', checked)
}

const handleOpen = async () => {
  const dir = await window.api.selectDirectory()
  dirInput.value = dir.replace(/\\/g, '/')
  dirFiles.value = []
  await window.api.setSetting('directory', dir)
}

const handleScan = async () => {
  const scannedDirFiles = await window.api.scanDirectory()
  dirFiles.value = scannedDirFiles
}

const handleClear = () => {
  dirFiles.value = []
}

const handleDisplay = async (img) => {
  console.log('display')
  displayImg.value = encodeURI(dirInput.value + '/' + img)

  document.body.style.overflow = 'hidden'
}

const deleteImg = async (fileName) => {
  try {
    await window.api.deleteImg(decodeURI(fileName), shouldDeleteRaw.value)
  } catch (e) {
    console.error(e)
  }

  if (displayImg.value) {
    if (dirFiles.value.length === 1) {
      displayImg.value = ''
    } else {
      const index = dirFiles.value.indexOf(fileName)
      if (index === dirFiles.value.length - 1) {
        displayImg.value = encodeURI(dirInput.value + '/' + dirFiles.value[0])
      } else {
        displayImg.value = encodeURI(dirInput.value + '/' + dirFiles.value[index + 1])
      }
    }
  }

  dirFiles.value = dirFiles.value.filter((file) => file !== fileName)
}

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

const handleClose = async () => {
  displayImg.value = ''

  document.body.style.overflow = 'auto'
}

const handlePrev = async () => {
  const index = dirFiles.value.indexOf(displayImg.value.split('/').pop())
  if (index > 0) {
    displayImg.value = encodeURI(dirInput.value + '/' + dirFiles.value[index - 1])
  } else {
    displayImg.value = encodeURI(dirInput.value + '/' + dirFiles.value[dirFiles.value.length - 1])
  }
}

const handleNext = async () => {
  const index = dirFiles.value.indexOf(displayImg.value.split('/').pop())
  if (index < dirFiles.value.length - 1) {
    displayImg.value = encodeURI(dirInput.value + '/' + dirFiles.value[index + 1])
  } else {
    displayImg.value = encodeURI(dirInput.value + '/' + dirFiles.value[0])
  }
}
</script>

<template>
  <div class="settings">
    <label class="directory">
      <span>目录</span>
      <input v-model="dirInput" @change="handleChange" />
      <button @click="handleOpen">打开</button>
      <button @click="handleScan">扫描</button>
      <button @click="handleClear">清除</button>
    </label>
    <label class="sync-delete-raw">
      <span>删除RAF</span>
      <input v-model="shouldDeleteRaw" type="checkbox" @change="handleCheck" />
    </label>
  </div>
  <ul class="file-ul">
    <li v-for="file in dirFiles" :key="file" class="file-li" @click="handleDisplay(file)">
      <img class="file-li-img" :src="encodeURI('file://' + dirInput + '/' + file)" loading="lazy" />
      <figure>{{ file }}</figure>
      <button class="file-li-delete" @click.prevent.stop="handleDelete(file)">删除</button>
    </li>
  </ul>
  <div v-show="displayImg" ref="imgDisplayDivRef" class="img-display" @click="handleCloseDisplay">
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
.settings {
  z-index: 20;
  position: sticky;
  top: 0;
  padding-block: 20px;
  padding-inline: 60px;
  margin-inline: -60px;

  display: flex;
  gap: 10px;
  justify-content: space-between;

  background-color: rgba(0, 0, 0, 0.3);
}

.directory {
  display: flex;
  align-items: center;
  gap: 10px;
}

.directory input {
  min-width: 400px;
}

.sync-delete-raw {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.sync-delete-raw input[type='checkbox'] {
  width: 20px;
  height: 20px;
}

.file-ul {
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 10px;
}

.file-li {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.file-li-img {
  max-width: 100%;
  max-height: 100%;
}

.file-li-delete {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #000;
  border-radius: 5px;
}

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
