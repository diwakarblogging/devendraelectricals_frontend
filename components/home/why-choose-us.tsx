'use client';

import { motion } from 'framer-motion';
import { Shield, BadgeCheck, HeadphonesIcon, Zap, Package, IndianRupee } from 'lucide-react';

const features = [
  { icon: Shield, title: '100% Genuine Products', description: 'All products are sourced directly from authorized manufacturers.' },
  { icon: BadgeCheck, title: 'Authorized Dealers', description: 'Official dealers of top brands like Havells, Philips, Bajaj & more.' },
  { icon: IndianRupee, title: 'Best Price Guarantee', description: 'Competitive pricing with special discounts for bulk orders.' },
  { icon: Package, title: 'Free Delivery', description: 'Free delivery across Kanpur for orders above ₹500.' },
  { icon: Zap, title: 'Expert Guidance', description: 'Our experienced team helps you choose the right products.' },
  { icon: HeadphonesIcon, title: 'Customer Support', description: 'Dedicated support via phone and WhatsApp for all queries.' },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-primary-800/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose <span className="text-brand-500">Us</span>
          </h2>
          <p className="text-primary-300 max-w-2xl mx-auto">
            We are Kanpur most trusted electrical shop with years of experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-xl border border-primary-700 bg-primary-800/50 hover:border-brand-500/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4 group-hover:bg-brand-500/20 transition-all duration-300">
                  <Icon className="h-6 w-6 text-brand-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-primary-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
