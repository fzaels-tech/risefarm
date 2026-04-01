import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: { translations: true },
    })

    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json(product)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await req.json()
    const { image, badgeColor, link, translations } = data

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

    return NextResponse.json(updatedProduct)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.product.delete({
      where: { id },
    })

    revalidatePath('/', 'layout')
    revalidatePath('/editor/products')

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
