import { cookies } from 'next/headers'
import crypto from 'crypto'
import { verifyToken } from '@/lib/auth'
import { apiBadRequest, apiError, apiServerError, apiSuccess, apiUnauthorized } from '@/lib/api-response'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('risefarm_token')?.value

    if (!token) {
      return apiUnauthorized()
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return apiUnauthorized()
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
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
    const signatureBase = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
    const signature = crypto.createHash('sha1').update(signatureBase).digest('hex')

    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append('file', file)
    cloudinaryFormData.append('api_key', apiKey)
    cloudinaryFormData.append('timestamp', String(timestamp))
    cloudinaryFormData.append('folder', folder)
    cloudinaryFormData.append('signature', signature)

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
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
