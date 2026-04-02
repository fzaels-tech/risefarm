import prisma from '@/lib/prisma'
import { slugify } from '@/lib/slugify'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { getArticlesByLocaleWithFallback, getAllArticlesForAdmin } from '@/lib/article-i18n'
import { revalidatePath } from 'next/cache'
import { apiBadRequest, apiServerError, apiSuccess, apiUnauthorized } from '@/lib/api-response'

// Articles change more often, 1 min fresh, 2 min stale
const ARTICLES_CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const lang = searchParams.get('lang') === 'en' ? 'en' : 'id'
    const wantsAll = searchParams.get('admin') === 'true'
    
    const cookieStore = await cookies()
    const token = cookieStore.get('risefarm_token')?.value
    let isAdmin = false
    if (token) {
      const payload = await verifyToken(token)
      if (payload) isAdmin = true
    }
    
    // Admin requesting all articles (for editor list), no cache
    if (wantsAll && isAdmin) {
      const allArticles = await getAllArticlesForAdmin()
      const filtered = category
        ? allArticles.filter((article) => article.category === category)
        : allArticles
      return apiSuccess(filtered, {
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
      })
    }

    const localizedArticles = await getArticlesByLocaleWithFallback(lang, isAdmin)
    const articles = category
      ? localizedArticles.filter((article) => article.category === category)
      : localizedArticles
    
    return apiSuccess(articles, { headers: ARTICLES_CACHE_HEADERS })
  } catch (error) {
    return apiServerError('Failed to fetch articles')
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('risefarm_token')?.value
    if (!token) return apiUnauthorized()
    
    const payload = await verifyToken(token)
    if (!payload) return apiUnauthorized()

    const data = await request.json()
    const prismaAny = prisma as any

    // Build translations array for both locales
    const translationsToCreate: any[] = []

    for (const locale of ['id', 'en'] as const) {
      const title = locale === 'id' ? data.id_title : data.en_title
      if (!title) continue // skip if no title for this locale

      const excerpt = locale === 'id' ? (data.id_excerpt || '') : (data.en_excerpt || '')
      const content = locale === 'id' ? (data.id_content || '') : (data.en_content || '')

      const baseSlug = slugify(title)
      let uniqueSlug = baseSlug
      let counter = 1
      while (await prismaAny.articleTranslation.findUnique({ where: { slug_locale: { slug: uniqueSlug, locale } } })) {
        uniqueSlug = `${baseSlug}-${counter}`
        counter++
      }

      translationsToCreate.push({ locale, title, slug: uniqueSlug, excerpt, content })
    }

    if (translationsToCreate.length === 0) {
      return apiBadRequest('At least one language title is required')
    }

    const article = await prismaAny.article.create({
      data: {
        category: data.category || 'Berita',
        author: data.author || 'Admin',
        image: data.image || '/images/susunan_ubi.jpeg',
        status: data.status || 'draft',
        publishedAt: data.status === 'published' ? new Date() : null,
        translations: {
          create: translationsToCreate,
        },
      },
      include: { translations: true },
    })

    const idTranslation = article.translations.find((t: any) => t.locale === 'id') ?? article.translations[0]

    // Purge caches on new article
    revalidatePath('/', 'layout')
    revalidatePath('/news', 'page')

    return apiSuccess(
      {
        id: article.id,
        category: article.category,
        author: article.author,
        image: article.image,
        status: article.status,
        createdAt: article.createdAt,
        publishedAt: article.publishedAt,
        updatedAt: article.updatedAt,
        locale: idTranslation.locale,
        title: idTranslation.title,
        slug: idTranslation.slug,
        excerpt: idTranslation.excerpt,
        content: idTranslation.content,
        translations: article.translations,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error(error)
    return apiServerError('Failed to create article')
  }
}

