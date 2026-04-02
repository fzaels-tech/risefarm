import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { apiBadRequest, apiServerError, apiSuccess, apiUnauthorized } from '@/lib/api-response'

// Cache strategy: products change rarely (admin-driven).
// s-maxage=300 → CDN/server cache fresh for 5 minutes.
// stale-while-revalidate=600 → serve stale for up to 10 more minutes while revalidating in background.
const PRODUCTS_CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
}

const PRODUCTS_ADMIN_HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
}

async function ensureDefaultProductsIfEmpty() {
  const total = await prisma.product.count()
  if (total > 0) return

  const defaults = [
    {
      image: '/images/cilembu.png',
      badgeColor: 'orange',
      link: 'https://wa.me/6281281091257',
      translations: {
        create: [
          {
            locale: 'id' as const,
            badge: 'Unggulan',
            title: 'Ubi Segar Kualitas Ekspor',
            desc: 'Pilihan ubi premium lengkap seperti Cilembu, ungu, Jepang, Murasaki, Pinky, TW, dan lainnya. Seluruh produk melalui proses sortir ketat dengan kualitas terjamin serta bebas dari pestisida kimia berbahaya, sehingga lebih sehat dan siap bersaing di pasar modern.',
          },
          {
            locale: 'en' as const,
            badge: 'Featured',
            title: 'Export Quality Fresh Sweet Potatoes',
            desc: 'A complete selection of premium sweet potatoes such as Cilembu, purple, Japanese, Murasaki, Pinky, TW, and more. All products undergo a strict sorting process with guaranteed quality and are free from harmful chemical pesticides, making them healthier and ready to compete in modern markets.',
          },
        ],
      },
    },
    {
      image: '/images/pengkelompokanubi.jpeg',
      badgeColor: 'emerald',
      link: 'https://wa.me/6281281091257',
      translations: {
        create: [
          {
            locale: 'id' as const,
            badge: 'B2B',
            title: 'Ubi Segar Kualitas Supermarket',
            desc: 'Kami menyediakan ubi segar berkualitas tinggi yang siap untuk distribusi ke supermarket dan toko ritel.',
          },
          {
            locale: 'en' as const,
            badge: 'B2B',
            title: 'Supermarket Quality Fresh Sweet Potatoes',
            desc: 'We provide high-quality fresh sweet potatoes ready for distribution to supermarkets and retail stores.',
          },
        ],
      },
    },
    {
      image: '/images/hasil.jpeg',
      badgeColor: 'purple',
      link: 'https://wa.me/6281281091257',
      translations: {
        create: [
          {
            locale: 'id' as const,
            badge: 'Baru',
            title: 'Sayuran dan buah buahan',
            desc: 'Sayuran dan buah buahan segar yang tumbuh dengan metode pertanian organik kami menyediakan kualitas ekspor dan kualitas supermarket (melon, jeruk, wortel, bayam dll).',
          },
          {
            locale: 'en' as const,
            badge: 'New',
            title: 'Vegetables and Fruits',
            desc: 'Fresh vegetables and fruits grown with our organic farming methods. We provide export and supermarket quality (melon, orange, carrot, spinach, etc).',
          },
        ],
      },
    },
  ]

  await prisma.$transaction(
    defaults.map((item) =>
      prisma.product.create({
        data: item,
      })
    )
  )
}

export async function GET(req: Request) {
  try {
    const searchParams = new URL(req.url).searchParams
    const isAdmin = searchParams.get('admin') === 'true'

    await ensureDefaultProductsIfEmpty()

    const products = await prisma.product.findMany({
      include: { translations: true },
      orderBy: { createdAt: 'desc' },
    })

    return apiSuccess(products, { headers: isAdmin ? PRODUCTS_ADMIN_HEADERS : PRODUCTS_CACHE_HEADERS })
  } catch (error: any) {
    return apiServerError(error.message)
  }
}

export async function POST(req: Request) {
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

    const targetBadgeColor = badgeColor || 'emerald'

    const product = await prisma.product.create({
      data: {
        image,
        badgeColor: targetBadgeColor,
        link,
        translations: {
          create: translations.map((t: any) => ({
            locale: t.locale,
            badge: t.badge,
            title: t.title,
            desc: t.desc,
          })),
        },
      },
      include: { translations: true },
    })

    // Purge the home page cache so the next public request gets fresh data immediately
    revalidatePath('/', 'layout')
    revalidatePath('/editor/products')

    return apiSuccess(product)
  } catch (error: any) {
    return apiServerError(error.message)
  }
}
