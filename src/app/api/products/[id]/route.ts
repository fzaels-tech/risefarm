import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { apiBadRequest, apiNotFound, apiServerError, apiSuccess, apiUnauthorized } from '@/lib/api-response'

function isNotFoundPrismaError(error: unknown) {
  if (!error || typeof error !== 'object') return false
  return 'code' in error && (error as { code?: string }).code === 'P2025'
}

async function ensureAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('risefarm_token')?.value

  if (!token) {
    return false
  }

  const payload = await verifyToken(token)
  return Boolean(payload)
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: { translations: true },
    })

    if (!product) return apiNotFound('Not found')

    return apiSuccess(product)
  } catch (error: any) {
    return apiServerError(error.message)
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await ensureAdmin()
    if (!isAdmin) {
      return apiUnauthorized()
    }

    const { id } = await params
    const data = await req.json()
    const { image, badgeColor, link, translations } = data

    if (!image || typeof image !== 'string') {
      return apiBadRequest('Image is required')
    }

    if (!Array.isArray(translations) || translations.length === 0) {
      return apiBadRequest('Translations are required')
    }

    const hasInvalidTranslation = translations.some(
      (t: any) => !t || !t.locale || !t.title || typeof t.title !== 'string'
    )
    if (hasInvalidTranslation) {
      return apiBadRequest('Invalid translations payload')
    }

    // Update main product
    const product = await prisma.product.update({
      where: { id },
      data: {
        image,
        badgeColor,
        link,
      },
    })

    // Upsert translations
    if (translations && translations.length > 0) {
      for (const t of translations) {
        await prisma.productTranslation.upsert({
          where: {
            productId_locale: {
              productId: id,
              locale: t.locale,
            },
          },
          update: {
            badge: t.badge,
            title: t.title,
            desc: t.desc,
          },
            create: {
              productId: id,
              locale: t.locale,
              badge: t.badge,
              title: t.title,
              desc: t.desc,
            },
          })
        }
      }

      const updatedProduct = await prisma.product.findUnique({
        where: { id },
      include: { translations: true }
    })

    revalidatePath('/', 'layout')
    revalidatePath('/editor/products')

    return apiSuccess(updatedProduct)
    } catch (error: any) {
      if (isNotFoundPrismaError(error)) {
        return apiNotFound('Product not found')
      }
    return apiServerError(error.message)
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await ensureAdmin()
    if (!isAdmin) {
      return apiUnauthorized()
    }

    const { id } = await params
    await prisma.product.delete({
      where: { id },
    })

    revalidatePath('/', 'layout')
    revalidatePath('/editor/products')

    return apiSuccess({ success: true })
    } catch (error: any) {
      if (isNotFoundPrismaError(error)) {
        return apiNotFound('Product not found')
      }
    return apiServerError(error.message)
  }
}
