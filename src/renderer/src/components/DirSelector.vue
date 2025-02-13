<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const dirInput = ref('')
const dirFiles = ref([])
const displayImg = ref('')
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
</template>

<style lang="less" scoped>
.settings {
  z-index: 20;
  position: sticky;
  top: 0;
  padding-block: 20px;
  padding-inline: 60px;
  margin-inline: -60px;

  display: flex;
  gap: 10px;
  width: 100vw;
  justify-content: space-between;

  background-color: rgba(0, 0, 0, 0.3);
}

.directory {
  display: flex;
  align-items: center;
  gap: 10px;

  & input {
    min-width: 400px;
  }
}

.sync-delete-raw {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  & input[type='checkbox'] {
    width: 20px;
    height: 20px;
  }
}
</style>
