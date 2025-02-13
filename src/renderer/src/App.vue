<script setup>
import DirSelector from './components/DirSelector.vue'
import ImgList from './components/ImgList.vue'
import ImgViewer from './components/ImgViewer.vue'
</script>

<template>
  <DirSelector />
  <ImgList />
  <ImgViewer />
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
