import { cookies } from 'next/headers'
import crypto from 'crypto'
import { verifyToken } from '@/lib/auth'
import { apiBadRequest, apiError, apiServerError, apiSuccess, apiUnauthorized } from '@/lib/api-response'

export const runtime = 'nodejs'

function resolveCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return null
  }

  return { cloudName, apiKey, apiSecret }
}

function sanitizeFolder(input: string | null) {
  if (!input) return 'risefarm/articles'
  const normalized = input.trim().replace(/^\/+|\/+$/g, '')
  const isValid = /^[a-zA-Z0-9/_-]+$/.test(normalized)
  if (!isValid) return 'risefarm/articles'
  return normalized
}

async function assertAuthenticated() {
  const cookieStore = await cookies()
  const token = cookieStore.get('risefarm_token')?.value

  if (!token) {
    return false
  }

  const payload = await verifyToken(token)
  return !!payload
}

export async function GET(request: Request) {
  try {
    const isAuthenticated = await assertAuthenticated()
    if (!isAuthenticated) {
      return apiUnauthorized()
    }

    const cloudinary = resolveCloudinaryConfig()
    if (!cloudinary) {
      return apiServerError('Cloudinary env is not configured')
    }

    const requestUrl = new URL(request.url)
    const folder = sanitizeFolder(requestUrl.searchParams.get('folder'))
    const timestamp = Math.floor(Date.now() / 1000)
    const signatureBase = `folder=${folder}&timestamp=${timestamp}${cloudinary.apiSecret}`
    const signature = crypto.createHash('sha1').update(signatureBase).digest('hex')

    return apiSuccess({
      cloudName: cloudinary.cloudName,
      apiKey: cloudinary.apiKey,
      timestamp,
      folder,
      signature,
    })
  } catch (error) {
    console.error(error)
    return apiServerError('Failed to prepare upload signature')
  }
}

export async function POST(request: Request) {
  try {
    const isAuthenticated = await assertAuthenticated()
    if (!isAuthenticated) {
      return apiUnauthorized()
    }

    const cloudinary = resolveCloudinaryConfig()
    if (!cloudinary) {
      return apiServerError('Cloudinary env is not configured')
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return apiBadRequest('No file uploaded')
    }

    if (!file.type.startsWith('image/')) {
      return apiBadRequest('Only image files are allowed')
    }

    const timestamp = Math.floor(Date.now() / 1000)
    const folder = 'risefarm/articles'
    const signatureBase = `folder=${folder}&timestamp=${timestamp}${cloudinary.apiSecret}`
    const signature = crypto.createHash('sha1').update(signatureBase).digest('hex')

    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append('file', file)
    cloudinaryFormData.append('api_key', cloudinary.apiKey)
    cloudinaryFormData.append('timestamp', String(timestamp))
    cloudinaryFormData.append('folder', folder)
    cloudinaryFormData.append('signature', signature)

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudinary.cloudName}/image/upload`, {
      method: 'POST',
      body: cloudinaryFormData,
    })

    const uploadData = await uploadRes.json()
    if (!uploadRes.ok) {
      return apiError(uploadData?.error?.message || 'Failed to upload image', 400)
    }

    return apiSuccess({
      url: uploadData.secure_url,
      publicId: uploadData.public_id,
    })
  } catch (error) {
    console.error(error)
    return apiServerError('Failed to upload image')
  }
}
