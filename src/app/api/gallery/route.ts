import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { apiBadRequest, apiServerError, apiSuccess, apiUnauthorized } from '@/lib/api-response'

const db = prisma as any

// Gallery images rarely change — cache for 5 min, allow stale for 10 min.
const GALLERY_CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
}

export async function GET() {
  try {
    const images = await db.galleryImage.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return apiSuccess(images, { headers: GALLERY_CACHE_HEADERS })
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