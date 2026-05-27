'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Menu, X, Phone, Search, ChevronDown, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PHONE_NUMBER, SHOP_ADDRESS, getWhatsAppUrl } from '@/lib/utils';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const categories = [
  { name: 'Wires & Cables', href: '/products?category=wires-cables' },
  { name: 'LED Lights', href: '/products?category=led-lights' },
  { name: 'Switches', href: '/products?category=switches' },
  { name: 'Fans', href: '/products?category=fans' },
  { name: 'MCBs', href: '/products?category=mcbs' },
  { name: 'Inverters', href: '/products?category=inverters' },
  { name: 'Electrical Tools', href: '/products?category=electrical-tools' },
  { name: 'Home Appliances', href: '/products?category=home-appliances' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-primary-700 bg-primary-900/95 backdrop-blur-lg">
        {/* Top Bar */}
        <div className="hidden lg:block border-b border-primary-700 bg-primary-800/50">
          <div className="container mx-auto flex items-center justify-between py-2 text-xs text-primary-300">
            <span>&#x1F4CD; {SHOP_ADDRESS}</span>
            <div className="flex items-center gap-4">
              <a href={`tel:${PHONE_NUMBER}`} className="hover:text-brand-500 transition-colors">
                <Phone className="inline h-3 w-3 mr-1" /> {PHONE_NUMBER}
              </a>
              <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 transition-colors">
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-brand-500">DE</span>
                <div className="ml-2">
                  <div className="text-sm font-semibold text-white leading-tight">Devendra</div>
                  <div className="text-xs text-brand-500 leading-tight">Electricals</div>
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'text-brand-500 bg-brand-500/10'
                      : 'text-primary-200 hover:text-white hover:bg-primary-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Categories Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-primary-200 hover:text-white hover:bg-primary-700 transition-all duration-200">
                  Categories <ChevronDown className="h-3 w-3" />
                </button>
                <div className="absolute top-full right-0 mt-1 w-56 rounded-xl border border-primary-700 bg-primary-900 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        className="block px-3 py-2 rounded-lg text-sm text-primary-200 hover:text-white hover:bg-primary-700 transition-all duration-200"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg text-primary-200 hover:text-white hover:bg-primary-700 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {mounted ? (theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />) : <div className="h-5 w-5" />}
              </button>

              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-lg text-primary-200 hover:text-white hover:bg-primary-700 transition-all duration-200"
              >
                <Search className="h-5 w-5" />
              </button>

              <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" size="sm" className="ml-2">
                  WhatsApp
                </Button>
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              {/* Theme Toggle (mobile) */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg text-primary-200 hover:text-white"
                aria-label="Toggle theme"
              >
                {mounted ? (theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />) : <div className="h-5 w-5" />}
              </button>
              <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" size="icon" className="h-9 w-9">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </Button>
              </a>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-primary-200 hover:text-white"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              key="search-bar"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-primary-700 bg-primary-800/50 overflow-hidden"
            >
              <div className="container mx-auto py-4">
                <form action="/products" method="GET" className="flex gap-2" suppressHydrationWarning={true}>
                  <input
                    name="search"
                    type="text"
                    placeholder="Search products..."
                    className="flex-1 h-11 rounded-lg border border-primary-600 bg-primary-800 px-4 text-sm text-white placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    autoFocus
                    suppressHydrationWarning={true}
                  />
                  <Button type="submit">Search</Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed top-16 left-0 right-0 bottom-0 z-50 border-t border-primary-700 bg-primary-900 lg:hidden overflow-y-auto"
          >
            <div className="container mx-auto py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.href)
                      ? 'text-brand-500 bg-brand-500/10'
                      : 'text-primary-200 hover:text-white hover:bg-primary-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-primary-700 pt-2 mt-2">
                <p className="px-4 py-2 text-xs font-semibold text-primary-400 uppercase tracking-wider">Categories</p>
                {categories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-lg text-sm text-primary-200 hover:text-white hover:bg-primary-700"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
              <div className="border-t border-primary-700 pt-3 mt-3 px-4">
                <a href={`tel:${PHONE_NUMBER}`} className="flex items-center gap-2 text-sm text-primary-300 hover:text-white mb-2">
                  <Phone className="h-4 w-4" /> {PHONE_NUMBER}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
