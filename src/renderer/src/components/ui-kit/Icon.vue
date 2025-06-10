<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="`#icon-${props.name}`"></use>
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{ name: string }>()
</script>
