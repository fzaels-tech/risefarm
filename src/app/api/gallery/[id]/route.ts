import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { apiBadRequest, apiServerError, apiSuccess, apiUnauthorized } from '@/lib/api-response'

const db = prisma as any

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params

    if (!id) {
      return apiBadRequest('ID is required')
    }

    await db.galleryImage.delete({
      where: { id },
    })

    revalidatePath('/', 'layout')

    return apiSuccess({ success: true })
  } catch (error) {
    console.error('Failed to delete gallery image:', error)
    return apiServerError()
  }
}
