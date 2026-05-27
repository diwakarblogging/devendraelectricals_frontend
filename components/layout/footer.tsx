'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { useSettings } from '@/lib/settings';
import { getWhatsAppUrl } from '@/lib/utils';

const categories = [
  { name: 'Wires & Cables', href: '/products?category=wires-cables' },
  { name: 'LED Lights', href: '/products?category=led-lights' },
  { name: 'Switches', href: '/products?category=switches' },
  { name: 'Fans', href: '/products?category=fans' },
  { name: 'MCBs', href: '/products?category=mcbs' },
  { name: 'Inverters', href: '/products?category=inverters' },
];

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Footer() {
  const { settings } = useSettings();
  return (
    <footer className="border-t border-primary-700 bg-primary-900">
      <div className="container mx-auto">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-brand-500">DE</span>
              <div>
                <div className="text-sm font-semibold text-white">Devendra</div>
                <div className="text-xs text-brand-500">Electricals</div>
              </div>
            </Link>
            <p className="text-sm text-primary-300 leading-relaxed">
              Your trusted electrical shop in Kanpur since 2010. We provide quality electrical products 
              and accessories for home and industrial use at the best prices.
            </p>
            <div className="flex gap-3">
              <a
                href={getWhatsAppUrl(undefined, settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-300 hover:text-brand-500 transition-colors flex items-center gap-1"
                  >
                    {link.name} <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Categories</h3>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-sm text-primary-300 hover:text-brand-500 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${settings.phoneNumber}`} className="flex items-start gap-3 text-sm text-primary-300 hover:text-brand-500 transition-colors">
                  <Phone className="h-4 w-4 mt-0.5 text-brand-500 flex-shrink-0" />
                  <span>{settings.phoneNumber}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.shopEmail}`} className="flex items-start gap-3 text-sm text-primary-300 hover:text-brand-500 transition-colors">
                  <Mail className="h-4 w-4 mt-0.5 text-brand-500 flex-shrink-0" />
                  <span>{settings.shopEmail}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-primary-300">
                  <MapPin className="h-4 w-4 mt-0.5 text-brand-500 flex-shrink-0" />
                  <span>{settings.shopAddress}</span>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-primary-300">
                  <Clock className="h-4 w-4 mt-0.5 text-brand-500 flex-shrink-0" />
                  <div>
                    <p>Mon - Sat: 9:00 AM - 8:00 PM</p>
                    <p>Sunday: 10:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-700 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-400">
            © {new Date().getFullYear()} Devendra Electricals. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-primary-400">
            <span>Authorized Dealers of: Havells, Philips, Bajaj, Luminous, Finolex, Polycab, Anchor, Legrand, GM</span>
          </div>
        </div>
      </div>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Store',
            name: 'Devendra Electricals',
            image: 'https://devendraelectricals.com/og-image.jpg',
            '@id': 'https://devendraelectricals.com',
            url: 'https://devendraelectricals.com',
            telephone: settings.phoneNumber,
            address: {
              '@type': 'PostalAddress',
              streetAddress: settings.shopAddress,
              addressLocality: 'Kanpur',
              addressRegion: 'Uttar Pradesh',
                postalCode: '208027',
              addressCountry: 'IN',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 26.4499,
              longitude: 80.3319,
            },
            openingHoursSpecification: [
              { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '20:00' },
              { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '10:00', closes: '17:00' },
            ],
            sameAs: [getWhatsAppUrl(undefined, settings.whatsappNumber)],
          }),
        }}
      />
    </footer>
  );
}
