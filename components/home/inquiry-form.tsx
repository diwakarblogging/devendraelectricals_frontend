'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { PHONE_NUMBER } from '@/lib/utils';

export function QuickInquiryForm() {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    setError('');

    try {
      await api.post('/inquiries', formData);
      setSuccess(true);
      setFormData({ name: '', phone: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-primary-800/30">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Have a <span className="text-brand-500">Question</span>?
            </h2>
            <p className="text-primary-300 mb-6 max-w-lg">
              Need help choosing the right product? Send us a message and we will get back to you shortly.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-primary-300">
                <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-500 font-bold">1</span>
                </div>
                <span>Fill in your details and inquiry</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-300">
                <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-500 font-bold">2</span>
                </div>
                <span>We will reach out within 2 hours</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-300">
                <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-500 font-bold">3</span>
                </div>
                <span>Get expert advice and best price</span>
              </div>
              <div className="pt-4">
                <p className="text-sm text-primary-400">
                  Or call us directly: <a href={`tel:${PHONE_NUMBER}`} className="text-brand-500 hover:underline">{PHONE_NUMBER}</a>
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {success ? (
              <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Thank You!</h3>
                <p className="text-primary-300">We have received your inquiry. We will contact you shortly.</p>
                <Button variant="outline" className="mt-4" onClick={() => setSuccess(false)}>
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-primary-700 bg-primary-800/50 p-6 md:p-8">
                <div>
                  <label className="block text-sm font-medium text-primary-200 mb-1">Your Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-200 mb-1">Phone Number *</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter your phone number"
                    type="tel"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-200 mb-1">Your Message *</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you are looking for..."
                  />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
