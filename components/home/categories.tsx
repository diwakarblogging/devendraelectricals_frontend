'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap, Sun, ToggleLeft, Wind, Shield, BatteryCharging, Wrench, Home } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const iconMap: Record<string, React.ElementType> = {
  zap: Zap, sun: Sun, 'toggle-left': ToggleLeft, wind: Wind,
  shield: Shield, 'battery-charging': BatteryCharging, tool: Wrench, home: Home,
};

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
}

export function CategoriesSection({ categories }: { categories: Category[] }) {
  if (!categories.length) return null;

  return (
    <section className="py-20 bg-primary-900/50">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Shop by <span className="text-brand-500">Category</span>
          </h2>
          <p className="text-primary-300 max-w-2xl mx-auto">
            Browse our wide range of electrical products and accessories
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, index) => {
            const Icon = cat.icon ? iconMap[cat.icon] : Zap;
            return (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/products?category=${cat.slug}`}>
                  <Card className="group cursor-pointer hover:border-brand-500/50 transition-all duration-300 h-full">
                    <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-all duration-300">
                        <Icon className="h-6 w-6 text-brand-500" />
                      </div>
                      <h3 className="font-semibold text-white group-hover:text-brand-500 transition-colors">
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="text-xs text-primary-400 line-clamp-2">{cat.description}</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
