import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { slugify } from '@/lib/slugify'
import { revalidatePath } from 'next/cache'
import { apiNotFound, apiServerError, apiSuccess, apiUnauthorized } from '@/lib/api-response'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const lang = searchParams.get('lang') === 'en' ? 'en' : 'id'
    const locales = lang === 'en' ? ['en', 'id'] : ['id']
    const prismaAny = prisma as any
    const { id } = await params
    const article = await prismaAny.article.findUnique({
      where: { id },
      include: {
        translations: {
          where: {
            locale: {
              in: locales,
            },
          },
        },
      },
    })
    
    if (!article) {
      return apiNotFound('Article not found')
    }
    
    const localized =
      article.translations.find((t: any) => t.locale === lang) ??
      article.translations.find((t: any) => t.locale === 'id')

    if (!localized) {
      return apiNotFound('Article translation not found')
    }

    return apiSuccess({
      id: article.id,
      category: article.category,
      author: article.author,
      image: article.image,
      status: article.status,
      createdAt: article.createdAt,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt,
      locale: localized.locale,
      title: localized.title,
      slug: localized.slug,
      excerpt: localized.excerpt,
      content: localized.content,
    })
  } catch (error) {
    return apiServerError('Failed to fetch article')
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('risefarm_token')?.value
    if (!token) return apiUnauthorized()
    
    const payload = await verifyToken(token)
    if (!payload) return apiUnauthorized()

    const prismaAny = prisma as any
    const { id } = await params
    const data = await request.json()

    let publishedAtUpdate: Date | null | undefined
    if (data.status === 'published') {
      publishedAtUpdate = new Date()
    } else if (data.status === 'draft') {
      publishedAtUpdate = null
    }

    // Build upserts for each locale
    const upserts: any[] = []

    for (const locale of ['id', 'en'] as const) {
      const title = locale === 'id' ? data.id_title : data.en_title
      if (!title) continue

      const excerpt = locale === 'id' ? (data.id_excerpt || '') : (data.en_excerpt || '')
      const content = locale === 'id' ? (data.id_content || '') : (data.en_content || '')

      const baseSlug = slugify(title)
      let uniqueSlug = baseSlug
      let counter = 1
      while (
        await prismaAny.articleTranslation.findFirst({
          where: { slug: uniqueSlug, locale, NOT: { articleId: id } },
        })
      ) {
        uniqueSlug = `${baseSlug}-${counter}`
        counter++
      }

      upserts.push(
        prismaAny.articleTranslation.upsert({
          where: { articleId_locale: { articleId: id, locale } },
          create: { articleId: id, locale, title, slug: uniqueSlug, excerpt, content },
          update: { title, slug: uniqueSlug, excerpt, content },
        })
      )
    }

    // Run article update + all translation upserts in parallel
    const [article] = await Promise.all([
      prismaAny.article.update({
        where: { id },
        data: {
          category: data.category,
          author: data.author,
          image: data.image,
          status: data.status,
          ...(publishedAtUpdate !== undefined ? { publishedAt: publishedAtUpdate } : {}),
        },
        include: { translations: true },
      }),
      ...upserts,
    ])

    const idTranslation = article.translations.find((t: any) => t.locale === 'id') ?? article.translations[0]

    revalidatePath('/', 'layout')
    revalidatePath('/news', 'page')
    revalidatePath(`/news/${idTranslation?.slug || ''}`, 'page')

    return apiSuccess({
      id: article.id,
      category: article.category,
      author: article.author,
      image: article.image,
      status: article.status,
      createdAt: article.createdAt,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt,
      locale: idTranslation?.locale || 'id',
      title: idTranslation?.title || '',
      slug: idTranslation?.slug || '',
      excerpt: idTranslation?.excerpt || '',
      content: idTranslation?.content || '',
      translations: article.translations,
    })
  } catch (error) {
    console.error(error)
    return apiServerError('Failed to update article')
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('risefarm_token')?.value
    if (!token) return apiUnauthorized()
    
    const payload = await verifyToken(token)
    if (!payload) return apiUnauthorized()

    const { id } = await params
    await prisma.article.delete({
      where: { id }
    })

    return apiSuccess({ success: true })
  } catch (error) {
    return apiServerError('Failed to delete article')
  }
}
