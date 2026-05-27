'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWhatsAppUrl } from '@/lib/utils';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-500/10 via-transparent to-transparent" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(245, 158, 11, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 158, 11, 0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-sm mb-6">
                <Zap className="h-4 w-4" />
                <span>Trusted Since 2010</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Your Trusted{' '}
                <span className="text-brand-500">Electrical</span>{' '}
                Shop in Kanpur
              </h1>
              <p className="mt-6 text-lg text-primary-300 max-w-xl leading-relaxed">
                Premium quality electrical products, wires, switches, fans, LED lights, 
                and industrial supplies at the best prices. Authorized dealers of top brands.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/products">
                <Button size="lg" className="gap-2">
                  Explore Products <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" size="lg">
                  WhatsApp Us
                </Button>
              </a>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-6 pt-4"
            >
              {[
                { icon: Shield, label: '100% Genuine Products' },
                { icon: Zap, label: 'Best Price Guarantee' },
                { icon: Truck, label: 'Free Delivery in Kanpur' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm text-primary-300">
                  <item.icon className="h-4 w-4 text-brand-500" />
                  <span>{item.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Brand Logos */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="pt-4"
            >
              <p className="text-xs text-primary-400 mb-3 uppercase tracking-wider">Authorized Dealers of</p>
              <div className="flex flex-wrap gap-6 items-center">
                {['Havells', 'Philips', 'Bajaj', 'Luminous', 'Finolex', 'Polycab'].map((brand) => (
                  <span key={brand} className="text-sm font-semibold text-primary-200/80 hover:text-brand-500 transition-colors">
                    {brand}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              <div className="w-96 h-96 rounded-full bg-brand-500/10 blur-3xl absolute -inset-20" />
              <div className="relative grid grid-cols-2 gap-4">
                {['Wires', 'Lights', 'Switches', 'Fans'].map((item, i) => (
                  <div
                    key={item}
                    className="bg-primary-800/50 backdrop-blur-sm border border-primary-700 rounded-2xl p-6 text-center hover:border-brand-500/30 transition-all duration-300"
                  >
                    <div className="text-3xl font-bold text-brand-500 mb-1">{['200+', '500+', '1000+', '50+'][i]}</div>
                    <div className="text-sm text-primary-300">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
