import { storeToRefs } from 'pinia'
import { useDirSettings, useImgDisplay } from '../store'

export function useDeleteImg() {
  const storeDirSettings = useDirSettings()
  const { dir: dirInput, dirFiles, deleteRaw } = storeToRefs(storeDirSettings)
  const { setDirFiles } = storeDirSettings

  const storeImgDisplay = useImgDisplay()
  const { displayImg } = storeToRefs(storeImgDisplay)
  const { setDisplayImg } = storeImgDisplay

  const deleteImg = async (fileName) => {
    try {
      await window.api.deleteImg(decodeURI(fileName), deleteRaw.value)
    } catch (e) {
      console.error(e)
    }

    if (displayImg.value) {
      if (dirFiles.value.length === 1) {
        setDisplayImg('')
      } else {
        const index = dirFiles.value.indexOf(fileName)
        if (index === dirFiles.value.length - 1) {
          setDisplayImg(encodeURI(dirInput.value + '/' + dirFiles.value[0]))
        } else {
          setDisplayImg(encodeURI(dirInput.value + '/' + dirFiles.value[index + 1]))
        }
      }
    }

    setDirFiles(dirFiles.value.filter((file) => file !== fileName))
  }

  return deleteImg
}
