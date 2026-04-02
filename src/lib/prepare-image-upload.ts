const DEFAULT_MAX_DIMENSION = 1920
const DEFAULT_MAX_BYTES = 4 * 1024 * 1024
const DEFAULT_QUALITY = 0.82

const IOS_HEIC_TYPES = new Set(['image/heic', 'image/heif'])

function toJpgName(originalName: string) {
  const dotIndex = originalName.lastIndexOf('.')
  const baseName = dotIndex > 0 ? originalName.slice(0, dotIndex) : originalName
  return `${baseName || 'upload'}.jpg`
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    const objectUrl = URL.createObjectURL(file)

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to decode image'))
    }

    image.src = objectUrl
  })
}

function canvasToJpegBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality)
  })
}

export async function prepareImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) {
    return file
  }

  const isHeicLike = IOS_HEIC_TYPES.has(file.type.toLowerCase())
  const shouldProcess = file.size > DEFAULT_MAX_BYTES || isHeicLike

  if (!shouldProcess) {
    return file
  }

  try {
    const image = await loadImageFromFile(file)
    const canvas = document.createElement('canvas')
    const ratio = Math.min(
      1,
      DEFAULT_MAX_DIMENSION / image.width,
      DEFAULT_MAX_DIMENSION / image.height
    )

    const targetWidth = Math.max(1, Math.round(image.width * ratio))
    const targetHeight = Math.max(1, Math.round(image.height * ratio))

    canvas.width = targetWidth
    canvas.height = targetHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return file
    }

    ctx.drawImage(image, 0, 0, targetWidth, targetHeight)

    const jpegBlob = await canvasToJpegBlob(canvas, DEFAULT_QUALITY)
    if (!jpegBlob) {
      return file
    }

    const processed = new File([jpegBlob], toJpgName(file.name), {
      type: 'image/jpeg',
      lastModified: Date.now(),
    })

    if (!isHeicLike && processed.size >= file.size && file.size <= DEFAULT_MAX_BYTES) {
      return file
    }

    return processed
  } catch {
    return file
  }
}