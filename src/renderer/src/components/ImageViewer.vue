<template>
  <div class="viewer" ref="viewerRef" v-show="displayImg">
    <div class="mask" @click="handleClose"></div>
    <img
      :src="displayImg"
      class="viewer-image"
      ref="imageRef"
      draggable="false"
      :style="imageStyle"
      @dblclick="dblclick"
      @wheel.stop="throttleWheelImage"
      @mousedown="mouseDown"
      @mousemove="mouseMove"
      @mouseup="mouseUp"
    />
    <div class="toolbar">
      <div class="filename">{{ fileName }} ({{ imagePixels }})</div>
      <div class="toolbar-operations">
        <div class="btn">{{ imageRatio }}%</div>

        <div class="btn" @click="oneToOne">
          <Icon name="one-to-one" />
        </div>
        <div class="btn" @click="reset">
          <Icon name="reset" />
        </div>
        <div class="btn" @click="rotateLeft"><Icon name="rotate-left" /></div>
        <div class="btn" @click="rotateRight"><Icon name="rotate-right" /></div>
        <div class="btn" @click="flipX"><Icon name="flip-x" /></div>
        <div class="btn" @click="flipY"><Icon name="flip-y" /></div>
        <div class="btn" @click="handlePrev"><Icon name="prev" /></div>
        <div class="btn" @click="handleNext"><Icon name="next" /></div>
        <div class="btn danger" @click="() => handleDelete()"><Icon name="delete" /></div>
        <label class="checkbox">
          <span>删除RAF</span>
          <input v-model="deleteRaw" type="checkbox" @change="handleCheck" />
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { throttle } from 'lodash-es'
import type { CSSProperties } from 'vue'
import { storeToRefs } from 'pinia'
import Icon from '@/components/ui-kit/Icon.vue'
import { useDirSetting, useDisplayImage } from '@/store'
import { useDeleteImage } from '@/hooks/useDeleteImg'

const storeDirSetting = useDirSetting()
const { dir, dirFiles, deleteRaw } = storeToRefs(storeDirSetting)
const { setDeleteRaw } = storeDirSetting

const storeDisplayImage = useDisplayImage()
const { displayImg } = storeToRefs(storeDisplayImage)
const { setDisplayImg } = storeDisplayImage

const fileName = computed(() => {
  if (!displayImg.value) return ''
  return decodeURI(displayImg.value.split('/').pop() as string)
})

const handleKeyUp = event => {
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

const handleCheck = async event => {
  const checked = event.target.checked
  setDeleteRaw(checked)
  await window.api.setSetting('deleteRaw', checked)
}

const deleteImage = useDeleteImage()

const handleDelete = async () => {
  reset()

  if (displayImg.value) {
    await deleteImage(fileName.value)
    return
  }
}

const handleClose = async () => {
  reset()
  setDisplayImg('')

  document.body.style.overflow = 'auto'
}

const handlePrev = async () => {
  reset()
  console.log(dirFiles.value, fileName.value)
  const index = dirFiles.value.indexOf(fileName.value)
  if (index > 0) {
    setDisplayImg(encodeURI('file://' + dir.value + '/' + dirFiles.value[index - 1]))
  } else {
    setDisplayImg(
      encodeURI('file://' + dir.value + '/' + dirFiles.value[dirFiles.value.length - 1]),
    )
  }
}

const handleNext = async () => {
  reset()
  const index = dirFiles.value.indexOf(fileName.value)
  if (index < dirFiles.value.length - 1) {
    setDisplayImg(encodeURI('file://' + dir.value + '/' + dirFiles.value[index + 1]))
  } else {
    setDisplayImg(encodeURI('file://' + dir.value + '/' + dirFiles.value[0]))
  }
}

onMounted(() => {
  document.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  document.removeEventListener('keyup', handleKeyUp)
})

// [d]图片1:1 = 设置图片中心为屏幕中心, 图片大小为图片原始大小
// [d]图片自适应 = 设置图片中心为屏幕中心, 图片大小为屏幕80%
// [d]图片缩放 = 设置鼠标在图片的位置(clientX/Y)为放大中心, 图片大小每次变大10%
// [d]图片拖拽 = 使用鼠标位置偏移量, 更新图片界面偏移量
// [d]图片旋转 = 使用transform旋转图片, 但是在自适应条件下, 图片尺寸可能需要调整
// [d]图片翻转 = 使用transform翻转图片

// 获取屏幕尺寸
// [d]获取图片尺寸
// [d]获取图片初始大小
const viewerRef = ref<HTMLDivElement>()
const imageRef = ref<HTMLImageElement>()

// 图片属性
const imageNaturalSize = ref()
const imageAutoSize = ref()

// 图片设置
const imageTranslate = ref([0, 0])
const imageScale = ref(1)
const imageRotate = ref(0)
const imageFlipX = ref(false)
const imageFlipY = ref(false)
const isImageUpscale = ref(false)

// 图片样式
const imageStyle = ref<CSSProperties>()

const imageRatio = computed(() => {
  if (!imageNaturalSize.value || !imageAutoSize.value || !imageScale.value) return 0
  return ((imageAutoSize.value[0] * imageScale.value * 100) / imageNaturalSize.value[0]).toFixed(0)
})
const imagePixels = computed(() => {
  if (!imageNaturalSize.value) return '0 * 0'
  return `${imageNaturalSize.value[0]}×${imageNaturalSize.value[1]}`
})
const transitionDuration = 1000 / 60

function wheelImage(e) {
  const imageRect = e.target.getBoundingClientRect()
  const imageRectCenterX = imageRect.x + imageRect.width / 2
  const imageRectCenterY = imageRect.y + imageRect.height / 2

  const deltaScale = 0.1
  if (e.wheelDeltaY > 0) {
    // 放大图片
    imageScale.value *= 1 + deltaScale
    imageTranslate.value[0] += -1 * deltaScale * (e.pageX - imageRectCenterX)
    imageTranslate.value[1] += -1 * deltaScale * (e.pageY - imageRectCenterY)
  } else if (e.wheelDeltaY < 0) {
    // 缩小图片
    imageScale.value *= 0.9
    imageTranslate.value[0] += deltaScale * (e.pageX - imageRectCenterX)
    imageTranslate.value[1] += deltaScale * (e.pageY - imageRectCenterY)
  }

  updateImageStyle()
}

const throttleWheelImage = throttle(wheelImage, transitionDuration)

function dblclick(e) {
  const imageRect = e.target.getBoundingClientRect()
  const imageRectCenterX = imageRect.x + imageRect.width / 2
  const imageRectCenterY = imageRect.y + imageRect.height / 2

  if (!isImageUpscale.value) {
    const scaleRadio = 2

    // 放大图片
    isImageUpscale.value = true
    imageScale.value *= scaleRadio
    imageTranslate.value[0] += (1 - scaleRadio) * (e.pageX - imageRectCenterX)
    imageTranslate.value[1] += (1 - scaleRadio) * (e.pageY - imageRectCenterY)
  } else {
    const scaleRadio = 0.5
    // 缩小图片
    isImageUpscale.value = false
    imageScale.value *= scaleRadio
    imageTranslate.value[0] += (1 - scaleRadio) * (e.pageX - imageRectCenterX)
    imageTranslate.value[1] += (1 - scaleRadio) * (e.pageY - imageRectCenterY)
  }

  updateImageStyle()
}

const isMouseDown = ref(false)
const mouseMovePos = ref<[number, number]>([0, 0])

function mouseDown(e) {
  isMouseDown.value = true
  mouseMovePos.value = [e.pageX, e.pageY]
}
function mouseMove(e) {
  if (!isMouseDown.value || !mouseMovePos.value) return

  const deltaX = e.pageX - mouseMovePos.value[0]
  const deltaY = e.pageY - mouseMovePos.value[1]

  updateImageStyle(
    {
      translateX: imageTranslate.value[0] + deltaX,
      translateY: imageTranslate.value[1] + deltaY,
    },
    false,
  )
}
function mouseUp(e) {
  const deltaX = e.pageX - mouseMovePos.value[0]
  const deltaY = e.pageY - mouseMovePos.value[1]

  imageTranslate.value = [imageTranslate.value[0] + deltaX, imageTranslate.value[1] + deltaY]
  updateImageStyle()

  isMouseDown.value = false
  mouseMovePos.value = [0, 0]
}

function oneToOne() {
  if (!imageNaturalSize.value || !imageAutoSize.value) {
    console.error(
      'Error in oneToOne: There is no valid imageNaturalSize or imageAutoSize, ',
      'imageNaturalSize: ',
      imageNaturalSize.value,
      ',',
      'imageAutoSize: ',
      imageAutoSize.value,
    )
    return
  }

  // 放大图片
  imageScale.value = imageNaturalSize.value[0] / imageAutoSize.value[0]
  imageTranslate.value = [0, 0]

  updateImageStyle()
}

function reset() {
  imageTranslate.value = [0, 0]
  imageScale.value = 1
  isImageUpscale.value = false
  imageRotate.value = 0
  imageFlipX.value = false
  imageFlipY.value = false
  imageStyle.value = {}
  setImageSizes()
}

function rotateLeft() {
  imageRotate.value = imageRotate.value - 1
  updateImageStyle()
}

function rotateRight() {
  imageRotate.value = imageRotate.value + 1
  updateImageStyle()
}

function flipX() {
  imageFlipY.value = !imageFlipY.value

  updateImageStyle()
}

function flipY() {
  imageFlipX.value = !imageFlipX.value

  updateImageStyle()
}

function updateImageStyle(
  props: {
    translateX?: number
    translateY?: number
    scale?: number
    rotate?: number
    rotateX?: number
    rotateY?: number
  } = {},
  useTransition = true,
) {
  const translateX = props.translateX || imageTranslate.value[0]
  const translateY = props.translateY || imageTranslate.value[1]
  const scale = props.scale || imageScale.value
  const rotate = props.rotate || 90 * imageRotate.value
  const rotateX = props.rotateX || imageFlipX.value ? 180 : 0
  const rotateY = props.rotateY || imageFlipY.value ? 180 : 0

  imageStyle.value = {
    ...(imageStyle.value || {}),
    transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    transition: useTransition ? `transform ${transitionDuration / 1000}s linear` : 'unset',
  }
}

function setImageSizes() {
  if (!imageRef.value) return
  imageAutoSize.value = [imageRef.value.clientWidth, imageRef.value.clientHeight]
  imageNaturalSize.value = [imageRef.value.naturalWidth, imageRef.value.naturalHeight]
}

watch(
  () => displayImg.value,
  async () => {
    if (!imageRef.value) return
    const imgDom = imageRef.value
    await nextTick()
    if (imgDom.complete) {
      setImageSizes()
    } else {
      imgDom.addEventListener('load', setImageSizes)
    }
  },
)

onMounted(() => {
  if (!imageRef.value) return
  const imgDom = imageRef.value

  if (imgDom.complete) {
    setImageSizes()
  } else {
    imgDom.addEventListener('load', setImageSizes)
  }
})

onMounted(() => {
  // 监听窗口尺寸变化
  window.addEventListener('resize', reset)
})

onBeforeUnmount(() => {
  if (!imageRef.value) return
  const imgDom = imageRef.value
  imgDom.removeEventListener('load', setImageSizes)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', reset)
})
</script>

<style scoped lang="less">
.viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;

  display: flex;
  justify-content: center;
  align-items: center;

  box-sizing: border-box;
  border: 1px solid green;

  .mask {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.8);
    // z-index: 1;
  }

  .checkbox {
    cursor: pointer;
    padding: 4px 6px;
    display: flex;
    align-items: center;
    gap: 4px;
    color: #fff;
  }
}

.viewer-image {
  background-color: aqua;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  aspect-ratio: auto;

  will-change: transform;
  transform-origin: center;
}

.toolbar {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);

  padding: 8px 16px;
  width: max-content;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  background-color: rgba(200, 200, 200, 0.2);
  border: 1px solid rgba(200, 200, 200, 0.2);
  border-radius: 8px;
  color: rgba(0, 0, 0, 0.7);

  .filename {
    color: #fff;
  }

  .toolbar-operations {
    display: flex;
    align-items: center;
    gap: 8px;

    .btn {
      height: 44px;
      min-width: 44px;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgb(225, 225, 225, 0.5);
      border-radius: 4px;
      cursor: pointer;
      font-size: 24px;
      line-height: 1;
    }
  }
}
</style>
