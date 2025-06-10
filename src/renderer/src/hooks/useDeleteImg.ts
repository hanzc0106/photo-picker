import { storeToRefs } from 'pinia'
import { useDirSetting, useDisplayImage } from '@/store'

export function useDeleteImage() {
  const storeDirSetting = useDirSetting()
  const { dir, dirFiles, deleteRaw } = storeToRefs(storeDirSetting)
  const { setDirFiles } = storeDirSetting

  const storeDisplayImage = useDisplayImage()
  const { displayImg } = storeToRefs(storeDisplayImage)
  const { setDisplayImg } = storeDisplayImage

  const deleteImage = async (fileName: string) => {
    fileName = decodeURI(fileName)
    try {
      await window.api.deleteImage(fileName, deleteRaw.value)
    } catch (e) {
      console.error(e)
    }

    if (displayImg.value) {
      if (dirFiles.value.length === 1) {
        setDisplayImg('')
      } else {
        const index = dirFiles.value.indexOf(fileName)
        if (index === dirFiles.value.length - 1) {
          setDisplayImg(encodeURI(dir.value + '/' + dirFiles.value[0]))
        } else {
          setDisplayImg(encodeURI(dir.value + '/' + dirFiles.value[index + 1]))
        }
      }
    }

    console.log('dirFiles: ', dirFiles.value, fileName)
    setDirFiles(dirFiles.value.filter(file => file !== fileName))
  }

  return deleteImage
}
