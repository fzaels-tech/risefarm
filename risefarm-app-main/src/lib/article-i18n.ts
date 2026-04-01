import prisma from '@/lib/prisma'

export type ActiveLocale = 'id' | 'en'
type LocaleValue = 'id' | 'en'

export type ArticleLocalized = {
  id: string
  category: string
  author: string
  image: string
  status: string
  createdAt: Date
  publishedAt: Date | null
  updatedAt: Date
  locale: ActiveLocale
  title: string
  slug: string
  excerpt: string
  content: string
}

const localeFallbackOrder = (locale: ActiveLocale): LocaleValue[] => {
  if (locale === 'en') {
    return ['en', 'id']
  }

  return ['id']
}

export async function getArticleBySlugWithLocaleFallback(
  slug: string,
  locale: ActiveLocale,
  includeDraft = false
): Promise<ArticleLocalized | null> {
  const requestedLocale: LocaleValue = locale === 'en' ? 'en' : 'id'
  const prismaAny = prisma as any

  // Find the base article using the requested locale slug first, then Indonesian slug.
  const translationMatch =
    (await prismaAny.articleTranslation.findUnique({
      where: { slug_locale: { slug, locale: requestedLocale } },
      select: { articleId: true },
    })) ??
    (requestedLocale === 'en'
      ? await prismaAny.articleTranslation.findUnique({
          where: { slug_locale: { slug, locale: 'id' } },
          select: { articleId: true },
        })
      : null)

  if (!translationMatch) {
    return null
  }

  const article = await prismaAny.article.findFirst({
    where: {
      id: translationMatch.articleId,
      ...(includeDraft ? {} : { status: 'published' }),
    },
    include: {
      translations: {
        where: {
          locale: {
            in: localeFallbackOrder(locale),
          },
        },
      },
    },
  })

  if (!article) {
    return null
  }

  const localized =
    article.translations.find((t: any) => t.locale === requestedLocale) ??
    article.translations.find((t: any) => t.locale === 'id')

  if (!localized) {
    return null
  }

  return {
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
  }
}

export async function getArticlesByLocaleWithFallback(
  locale: ActiveLocale,
  includeDraft = false
): Promise<ArticleLocalized[]> {
  const requestedLocale: LocaleValue = locale === 'en' ? 'en' : 'id'
  const prismaAny = prisma as any

  const articles = await prismaAny.article.findMany({
    where: {
      ...(includeDraft ? {} : { status: 'published' }),
    },
    include: {
      translations: {
        where: {
          locale: {
            in: localeFallbackOrder(locale),
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return articles
    .map((article: any) => {
      const localized =
        article.translations.find((t: any) => t.locale === requestedLocale) ??
        article.translations.find((t: any) => t.locale === 'id')

      if (!localized) {
        return null
      }

      return {
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
      }
    })
    .filter((article: ArticleLocalized | null): article is ArticleLocalized => article !== null)
}

export async function getAllArticlesForAdmin(): Promise<ArticleLocalized[]> {
  const prismaAny = prisma as any

  const articles = await prismaAny.article.findMany({
    include: {
      translations: true, // semua locale, tanpa filter
    },
    orderBy: { createdAt: 'desc' },
  })

  return articles
    .map((article: any) => {
      // Prefer ID, fallback to EN, then whatever is available
      const localized =
        article.translations.find((t: any) => t.locale === 'id') ??
        article.translations.find((t: any) => t.locale === 'en') ??
        article.translations[0]

      if (!localized) return null

      return {
        id: article.id,
        category: article.category,
        author: article.author,
        image: article.image,
        status: article.status,
        createdAt: article.createdAt,
        publishedAt: article.publishedAt,
        updatedAt: article.updatedAt,
        locale: localized.locale as ActiveLocale,
        title: localized.title,
        slug: localized.slug,
        excerpt: localized.excerpt,
        content: localized.content,
        translations: article.translations, // full array for editor hydration
      }
    })
    .filter((article: any): article is ArticleLocalized => article !== null)
}

