'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useSettings } from '@/lib/settings';
import { formatPrice, getWhatsAppProductUrl, getImageUrl } from '@/lib/utils';
import type { Product } from '@/types';

export function FeaturedProducts({ products, isLoading }: { products: Product[]; isLoading: boolean }) {
  const { settings } = useSettings();
  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products.length) return null;

  return (
    <section className="py-20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured <span className="text-brand-500">Products</span>
            </h2>
            <p className="text-primary-300 max-w-xl">
              Our top-rated electrical products handpicked for quality and reliability
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/products/${product.slug}`}>
                <Card className="group cursor-pointer hover:border-brand-500/50 transition-all duration-300 h-full overflow-hidden">
                  <div className="relative aspect-square bg-primary-700/30 overflow-hidden">
                    <img
                      src={getImageUrl(product.images?.[0])}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {product.featured && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="default">
                          <Star className="h-3 w-3 mr-1 fill-current" /> Featured
                        </Badge>
                      </div>
                    )}
                    {product.mrp && product.price && product.mrp > product.price && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="destructive">
                          -{Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 space-y-2">
                    {product.brand && (
                      <p className="text-xs text-brand-500 font-semibold uppercase tracking-wider">{product.brand}</p>
                    )}
                    <h3 className="font-semibold text-white group-hover:text-brand-500 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-brand-500">
                      {formatPrice(product.price)}
                      {product.mrp && (
                        <span className="text-sm text-primary-400 line-through ml-2 font-normal">
                          {formatPrice(product.mrp)}
                        </span>
                      )}
                    </p>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); window.open(getWhatsAppProductUrl(product.name, settings.whatsappNumber), '_blank', 'noopener'); }}
                        className="flex-1 text-xs bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg py-2 text-center hover:bg-green-500/20 transition-colors"
                      >
                        Enquire on WhatsApp
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
