import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const prismaAny = prisma as any

  const adminPasswordHash = await bcrypt.hash('RiseFarmbebas2026', 10)

  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: adminPasswordHash,
    },
  })

  await prismaAny.articleTranslation.deleteMany()
  await prismaAny.article.deleteMany()

  // Article 1: has Indonesian and English translations.
  await prismaAny.article.create({
    data: {
      category: 'Berita',
      author: 'Tim RISEFARM',
      image: '/images/susunan_ubi.jpeg',
      status: 'published',
      publishedAt: new Date(),
      translations: {
        create: [
          {
            locale: 'id',
            title: 'Panen Ubi Cilembu RISEFARM Naik 25% di Kuartal Ini',
            slug: 'panen-ubi-cilembu-risefarm-naik-25-di-kuartal-ini',
            excerpt: 'Optimalisasi bibit unggul dan pemupukan presisi mendorong kenaikan hasil panen yang lebih konsisten.',
            content:
              'RISEFARM mencatat peningkatan panen ubi Cilembu hingga 25% dibanding periode sebelumnya.\n\nKenaikan ini didorong oleh penggunaan bibit unggul, pemantauan kelembapan lahan, dan proses sortir pasca panen yang lebih ketat.\n\n## Dampak ke mitra\n\nPeningkatan hasil panen memberi pasokan yang lebih stabil untuk kebutuhan supermarket dan pembeli B2B.\n\nSelain itu, mitra petani juga memperoleh pendampingan budidaya yang lebih terukur.',
          },
          {
            locale: 'en',
            title: 'RISEFARM Cilembu Harvest Up 25% This Quarter',
            slug: 'risefarm-cilembu-harvest-up-25-this-quarter',
            excerpt: 'Superior seedlings and precision fertilization improved harvest consistency this quarter.',
            content:
              'RISEFARM recorded a 25% increase in Cilembu sweet potato yield compared to the previous period.\n\nThis growth was driven by superior seedlings, field moisture monitoring, and stricter post-harvest sorting.\n\n## Impact for partners\n\nHigher yield helps secure more stable supply for supermarkets and B2B buyers.\n\nFarmer partners also receive more measurable cultivation assistance.',
          },
        ],
      },
    },
  })

  // Article 2: now has both Indonesian and English translations.
  await prismaAny.article.create({
    data: {
      category: 'Edukasi',
      author: 'Admin RISEFARM',
      image: '/images/penyucian_tahap_awal.jpeg',
      status: 'published',
      publishedAt: new Date(Date.now() - 86400000),
      translations: {
        create: [
          {
            locale: 'id',
            title: '5 Tips Menjaga Kualitas Ubi Setelah Panen',
            slug: '5-tips-menjaga-kualitas-ubi-setelah-panen',
            excerpt: 'Penyimpanan, pembersihan, dan pengemasan yang tepat sangat menentukan kualitas ubi sampai ke pelanggan.',
            content:
              'Menjaga kualitas ubi setelah panen adalah kunci utama untuk mempertahankan kesegaran produk.\n\nPertama, lakukan sortir awal untuk memisahkan ubi yang rusak. Kedua, hindari pencucian berlebihan jika produk belum akan dikirim.\n\n## Pengemasan\n\nGunakan kemasan yang memiliki sirkulasi udara baik agar kelembapan tetap terkontrol.\n\n## Distribusi\n\nPastikan pengiriman dilakukan tepat waktu dengan handling yang minim benturan.',
          },
          {
            locale: 'en',
            title: '5 Tips to Maintain Sweet Potato Quality After Harvest',
            slug: '5-tips-to-maintain-sweet-potato-quality-after-harvest',
            excerpt: 'Proper storage, cleaning, and packaging are key to delivering sweet potatoes in top condition to customers.',
            content:
              'Maintaining sweet potato quality after harvest is essential to preserving product freshness.\n\nFirst, perform an initial sorting to remove damaged tubers. Second, avoid excessive washing if the product is not yet ready for delivery.\n\n## Packaging\n\nUse packaging with good air circulation to keep moisture levels under control.\n\n## Distribution\n\nEnsure timely delivery with minimal impact handling to preserve product integrity.',
          },
        ],
      },
    },
  })


  console.log('Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
