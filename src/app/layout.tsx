import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SITE_URL = "https://risefarm.asia";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
  },
  title: {
    default: "RISEFARM — Supplier Ubi Premium Indonesia",
    template: "%s | RISEFARM",
  },
  description:
    "RISEFARM adalah pelopor agritech ubi di Indonesia. Menyediakan ubi Cilembu, ubi ungu, ubi Jepang, dan sayuran organik berkualitas ekspor untuk supermarket, eksportir, dan industri pengolahan. Pasokan stabil, terukur, dan siap skala bisnis.",
  keywords: [
    "supplier ubi premium Indonesia",
    "ubi ekspor Indonesia",
    "ubi Cilembu berkualitas",
    "agritech ubi nusantara",
    "supplier ubi supermarket",
    "ubi organik Jawa Barat",
    "ubi ungu ekspor",
    "ubi Jepang Indonesia",
    "Murasaki sweet potato Indonesia",
    "RISEFARM",
    "supplier agritech Indonesia",
    "pertanian regeneratif ubi",
  ],
  authors: [{ name: "RISEFARM", url: SITE_URL }],
  creator: "RISEFARM",
  publisher: "RISEFARM",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "id-ID": SITE_URL,
      "en-US": `${SITE_URL}/en`,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: "en_US",
    url: SITE_URL,
    siteName: "RISEFARM",
    title: "RISEFARM — Supplier Ubi Premium Indonesia",
    description:
      "Pelopor agritech ubi di Indonesia. Pasokan ubi segar kualitas ekspor dan supermarket dengan pertanian regeneratif. Ubi Cilembu, ubi ungu, ubi Jepang & organik.",
    images: [
      {
        url: `${SITE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "RISEFARM — Supplier Ubi Premium Indonesia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RISEFARM — Supplier Ubi Premium Indonesia",
    description:
      "Pelopor agritech ubi di Indonesia. Pasokan ubi segar kualitas ekspor dan supermarket.",
    images: [`${SITE_URL}/images/og-image.jpg`],
    creator: "@risefarm",
  },
  verification: {
    google: "74rHR24eoqjnvkJD1VmHnmPksr_TAd2Uygpd",
  },
  category: "agriculture",
};

// JSON-LD: LocalBusiness + Organization
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "RISEFARM",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.svg`,
        width: 36,
        height: 36,
      },
      description:
        "Pelopor agritech ubi di Indonesia, menyediakan ubi segar kualitas ekspor dengan metode pertanian regeneratif dan pemberdayaan petani lokal.",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+62-812-8109-1257",
        contactType: "customer service",
        email: "csrisefarm@gmail.com",
        availableLanguage: ["Indonesian", "English"],
      },
      sameAs: [],
    },
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#localbusiness`,
      name: "RISEFARM",
      image: `${SITE_URL}/images/og-image.jpg`,
      url: SITE_URL,
      telephone: "+62-812-8109-1257",
      email: "csrisefarm@gmail.com",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jl. Parungkuda",
        addressLocality: "Kabupaten Sukabumi",
        addressRegion: "Jawa Barat",
        addressCountry: "ID",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -6.9,
        longitude: 106.8,
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "17:00",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Produk Ubi RISEFARM",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Product", name: "Ubi Cilembu" } },
          { "@type": "Offer", itemOffered: { "@type": "Product", name: "Ubi Ungu" } },
          { "@type": "Offer", itemOffered: { "@type": "Product", name: "Ubi Jepang" } },
          { "@type": "Offer", itemOffered: { "@type": "Product", name: "Murasaki" } },
          { "@type": "Offer", itemOffered: { "@type": "Product", name: "Pinky" } },
          { "@type": "Offer", itemOffered: { "@type": "Product", name: "TW (Taiwan)" } },
          { "@type": "Offer", itemOffered: { "@type": "Product", name: "Sayuran & Buah Organik" } },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "RISEFARM",
      description: "Pasokan Ubi yang Stabil, Terukur, dan Siap untuk Skala Bisnis",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: ["id-ID", "en-US"],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full scroll-smooth`}>
      <head>
        <Script
          id="jsonld-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans text-[#4A3B32] bg-[#FDFBF7] selection:bg-orange-200 selection:text-orange-900 overflow-x-hidden min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
