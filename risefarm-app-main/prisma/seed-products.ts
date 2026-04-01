import { PrismaClient, Locale } from '@prisma/client'

const prisma = new PrismaClient()

const productsData = [
  {
    image: '/images/cilembu.png',
    badgeColor: 'orange',
    link: 'https://wa.me/6281281091257',
    translations: {
      create: [
        {
          locale: 'id' as Locale,
          badge: 'Unggulan',
          title: 'Ubi Segar Kualitas Ekspor',
          desc: 'Pilihan ubi premium lengkap seperti Cilembu, ungu, Jepang, Murasaki, Pinky, TW, dan lainnya. Seluruh produk melalui proses sortir ketat dengan kualitas terjamin serta bebas dari pestisida kimia berbahaya, sehingga lebih sehat dan siap bersaing di pasar modern.'
        },
        {
          locale: 'en' as Locale,
          badge: 'Featured',
          title: 'Export Quality Fresh Sweet Potatoes',
          desc: 'A complete selection of premium sweet potatoes such as Cilembu, purple, Japanese, Murasaki, Pinky, TW, and more. All products undergo a strict sorting process with guaranteed quality and are free from harmful chemical pesticides, making them healthier and ready to compete in modern markets.'
        }
      ]
    }
  },
  {
    image: '/images/pengkelompokanubi.jpeg',
    badgeColor: 'emerald',
    link: 'https://wa.me/6281281091257',
    translations: {
      create: [
        {
          locale: 'id' as Locale,
          badge: 'B2B',
          title: 'Ubi Segar Kualitas Supermarket',
          desc: 'Kami menyediakan ubi segar berkualitas tinggi yang siap untuk distribusi ke supermarket dan toko ritel.'
        },
        {
          locale: 'en' as Locale,
          badge: 'B2B',
          title: 'Supermarket Quality Fresh Sweet Potatoes',
          desc: 'We provide high-quality fresh sweet potatoes ready for distribution to supermarkets and retail stores.'
        }
      ]
    }
  },
  {
    image: '/images/hasil.jpeg',
    badgeColor: 'purple',
    link: 'https://wa.me/6281281091257',
    translations: {
      create: [
        {
          locale: 'id' as Locale,
          badge: 'Baru',
          title: 'Sayuran dan buah buahan',
          desc: 'Sayuran dan buah buahan segar yang tumbuh dengan metode pertanian organik kami menyediakan kualitas ekspor dan kualitas supermarket (melon, jeruk, wortel, bayam dll).'
        },
        {
          locale: 'en' as Locale,
          badge: 'New',
          title: 'Vegetables and Fruits',
          desc: 'Fresh vegetables and fruits grown with our organic farming methods. We provide export and supermarket quality (melon, orange, carrot, spinach, etc).'
        }
      ]
    }
  }
]

async function main() {
  console.log('Clearing existing products...')
  await prisma.product.deleteMany({})
  
  console.log('Seeding products...')
  for (const product of productsData) {
    await prisma.product.create({
      data: product
    })
  }
  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
