import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { apiBadRequest, apiServerError, apiSuccess, apiUnauthorized } from '@/lib/api-response'

const db = prisma as any

export async function GET() {
  try {
    const images = await db.galleryImage.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return apiSuccess(images, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Failed to fetch gallery images:', error)
    return apiServerError('Failed to fetch gallery images')
  }
}

export async function POST(req: Request) {
  try {
    // Only admins can upload
    const cookieStore = await cookies()
    const token = cookieStore.get('risefarm_token')?.value
    if (!token) {
      return apiUnauthorized()
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return apiUnauthorized()
    }

    const body = await req.json()
    const { url, caption } = body

    if (!url) {
      return apiBadRequest('URL is required')
    }

    const image = await db.galleryImage.create({
      data: {
        url,
        caption: caption || '',
      }
    })

    revalidatePath('/', 'layout')

    return apiSuccess(image)
  } catch (error) {
    console.error('Failed to create gallery image:', error)
    return apiServerError()
  }
}