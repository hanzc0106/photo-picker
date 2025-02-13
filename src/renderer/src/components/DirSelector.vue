<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDirSettings } from '../store/dirSettings'

const storeDirSettings = useDirSettings()
const { dir: dirInput, deleteRaw: shouldDeleteRaw } = storeToRefs(storeDirSettings)
const { setDir, setDirFiles, setDeleteRaw } = storeDirSettings

onMounted(async () => {
  const directory = await window.api.getSetting('directory')
  const deleteRaw = await window.api.getSetting('deleteRaw')

  if (directory) {
    setDir(directory.replace(/\\/g, '/'))
    handleScan()
  }

  setDeleteRaw(!!deleteRaw)
})

const handleChange = async (event) => {
  const dir = event.target.value
  setDir(dir.replace(/\\/g, '/'))

  setDirFiles([])
  await window.api.setSetting('directory', dir)
}

const handleCheck = async (event) => {
  const checked = event.target.checked
  setDeleteRaw(event.target.checked)
  await window.api.setSetting('deleteRaw', checked)
}

const handleOpen = async () => {
  const dir = await window.api.selectDirectory()
  setDir(dir.replace(/\\/g, '/'))
  setDirFiles([])
  await window.api.setSetting('directory', dir)
}

const handleScan = async () => {
  const scannedDirFiles = await window.api.scanDirectory()
  setDirFiles(scannedDirFiles)
}

const handleClear = () => {
  setDirFiles([])
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
