<script setup lang="ts">
const props = defineProps({ imgPath: String, imgName: String })
// eslint-disable-next-line no-unused-vars
const emits = defineEmits(['onDisplay', 'onDelete'])
</script>

<template>
  <li class="file-li" @click="$emit('onDisplay', imgName)">
    <img class="file-li-img" :src="props.imgPath" loading="lazy" />
    <figure>{{ imgName }}</figure>
    <button class="file-li-delete" @click.prevent.stop="$emit('onDelete', imgName)">删除</button>
  </li>
</template>

<style scoped>
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
</style>
