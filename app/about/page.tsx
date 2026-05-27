'use client';

import { motion } from 'framer-motion';
import { Shield, Users, Award, TrendingUp, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/lib/settings';
import { getWhatsAppUrl } from '@/lib/utils';
import Link from 'next/link';

const stats = [
  { label: 'Years of Service', value: '15+' },
  { label: 'Happy Customers', value: '10,000+' },
  { label: 'Products Available', value: '500+' },
  { label: 'Brands Partnered', value: '20+' },
];

const values = [
  { icon: Shield, title: 'Trust & Reliability', description: 'Building long-term relationships with our customers through honest business practices and quality products.' },
  { icon: Star, title: 'Quality Products', description: 'We stock only genuine, branded electrical products with full manufacturer warranty.' },
  { icon: Users, title: 'Customer First', description: 'Our team provides personalized guidance to help you choose the right products for your needs.' },
  { icon: Zap, title: 'Expert Knowledge', description: 'Years of experience in the electrical industry means we know exactly what you need.' },
];

export default function AboutPage() {
  const { settings } = useSettings();
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-500/5 via-transparent to-transparent" />
        <div className="container mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About <span className="text-brand-500">Devendra Electricals</span>
            </h1>
            <p className="text-lg text-primary-300 max-w-3xl mx-auto leading-relaxed">
              Your trusted electrical shop in Kanpur, serving customers with quality products 
              and expert guidance since 2010. We are authorized dealers of India top electrical brands.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold text-white mb-6">Our <span className="text-brand-500">Story</span></h2>
              <div className="space-y-4 text-primary-300 leading-relaxed">
                <p>
                  Devendra Electricals started as a small electrical shop in the heart of Kanpur with a simple mission: 
                  provide quality electrical products at honest prices. Over the years, we have grown into one of the 
                  most trusted electrical stores in the city.
                </p>
                <p>
                  Our founder, with decades of experience in the electrical industry, built this business on the 
                  principles of integrity, quality, and customer satisfaction. Today, we serve thousands of happy 
                  customers including homeowners, electricians, contractors, and industrial clients.
                </p>
                <p>
                  We are proud to be authorized dealers of India leading electrical brands including Havells, Philips, 
                  Bajaj, Luminous, Finolex, Polycab, Anchor, Legrand, and many more.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-6 rounded-xl border border-primary-700 bg-primary-800/50">
                  <div className="text-3xl md:text-4xl font-bold text-brand-500 mb-2">{stat.value}</div>
                  <div className="text-sm text-primary-300">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-primary-800/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Our <span className="text-brand-500">Values</span></h2>
            <p className="text-primary-300 max-w-2xl mx-auto">What makes us the preferred choice for electrical products in Kanpur</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-xl border border-primary-700 bg-primary-800/50 hover:border-brand-500/30 transition-all duration-300"
                >
                  <Icon className="h-10 w-10 text-brand-500 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-sm text-primary-300">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="rounded-2xl bg-gradient-to-r from-brand-500/10 to-brand-600/5 border border-brand-500/20 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Visit Our Store Today</h2>
            <p className="text-primary-300 mb-8 max-w-xl mx-auto">
              Come visit us at our shop in Kanpur or get in touch via WhatsApp for quick assistance.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={getWhatsAppUrl(undefined, settings.whatsappNumber)} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" size="lg">WhatsApp Us</Button>
              </a>
              <a href={`tel:${settings.phoneNumber}`}>
                <Button variant="outline" size="lg">Call Now</Button>
              </a>
              <Link href="/contact">
                <Button variant="secondary" size="lg">Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
