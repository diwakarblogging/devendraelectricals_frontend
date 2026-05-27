'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Testimonial } from '@/types';

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;

  return (
    <section className="py-20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Our <span className="text-brand-500">Customers</span> Say
          </h2>
          <p className="text-primary-300 max-w-2xl mx-auto">
            Trusted by hundreds of customers in Kanpur
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6 space-y-4">
                  <Quote className="h-8 w-8 text-brand-500/30" />
                  <p className="text-sm text-primary-300 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-brand-500 text-brand-500" />
                    ))}
                  </div>
                  <div className="pt-2 border-t border-primary-700">
                    <p className="font-semibold text-white text-sm">{testimonial.name}</p>
                    {testimonial.company && (
                      <p className="text-xs text-primary-400">{testimonial.company}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
