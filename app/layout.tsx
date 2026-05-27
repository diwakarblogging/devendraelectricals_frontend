import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { SettingsProvider } from '@/lib/settings';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WhatsAppButton } from '@/components/layout/whatsapp-button';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'Devendra Electricals - Trusted Electrical Shop in Kanpur',
    template: '%s | Devendra Electricals',
  },
  description: 'Your trusted electrical shop in Kanpur since 2010. Shop premium wires, switches, fans, LED lights, MCBs, inverters, cables, and home electrical accessories at best prices. Authorized dealers of Havells, Philips, Bajaj, Luminous, Finolex, Polycab.',
  keywords: ['electrical shop Kanpur', 'electrical store Kanpur', 'wires and cables Kanpur', 'LED lights Kanpur', 'switches Kanpur', 'fans Kanpur', 'MCBs Kanpur', 'inverters Kanpur', 'Havells dealer Kanpur', 'Philips dealer Kanpur', 'electrical supplies Kanpur', 'Devendra Electricals'],
  authors: [{ name: 'Devendra Electricals' }],
  creator: 'Devendra Electricals',
  publisher: 'Devendra Electricals',
  formatDetection: { telephone: true },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Devendra Electricals',
    title: 'Devendra Electricals - Trusted Electrical Shop in Kanpur',
    description: 'Premium quality electrical products, wires, switches, fans, LED lights, and industrial supplies at the best prices in Kanpur.',
    url: 'https://devendraelectricals.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Devendra Electricals - Trusted Electrical Shop in Kanpur',
    description: 'Premium quality electrical products at the best prices in Kanpur.',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://devendraelectricals.com'),
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Kanpur" />
        <meta name="geo.position" content="26.4499;80.3319" />
        <meta name="ICBM" content="26.4499, 80.3319" />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="google-site-verification" content="" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Store',
              name: 'Devendra Electricals',
              description: 'Your trusted electrical shop in Kanpur. Quality electrical products and accessories.',
              url: 'https://devendraelectricals.com',
              telephone: '+91-9876543210',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '81/1, main road, near bank of baroda, barra-2',
                addressLocality: 'Kanpur',
                addressRegion: 'Uttar Pradesh',
                postalCode: '208027',
                addressCountry: 'IN',
              },
              geo: { '@type': 'GeoCoordinates', latitude: 26.4499, longitude: 80.3319 },
              openingHoursSpecification: [
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '20:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '10:00', closes: '17:00' },
              ],
              sameAs: ['https://wa.me/919876543210'],
            }),
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <SettingsProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <WhatsAppButton />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { background: '#1a1a2e', color: '#fff', border: '1px solid rgba(245, 158, 11, 0.2)' },
            }}
          />
        </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
