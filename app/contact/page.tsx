'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { PHONE_NUMBER, SHOP_ADDRESS, SHOP_EMAIL, MAP_EMBED_URL, getWhatsAppUrl } from '@/lib/utils';
import { api } from '@/lib/api';

const contactInfo = [
  { icon: Phone, label: 'Phone', value: PHONE_NUMBER, href: `tel:${PHONE_NUMBER}` },
  { icon: Mail, label: 'Email', value: SHOP_EMAIL, href: `mailto:${SHOP_EMAIL}` },
  { icon: MapPin, label: 'Address', value: SHOP_ADDRESS },
  { icon: Clock, label: 'Business Hours', value: 'Mon-Sat: 9:00 AM - 8:00 PM\nSunday: 10:00 AM - 5:00 PM' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      setError('Please fill in name, phone, and message');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await api.post('/inquiries', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary-800/30 border-b border-primary-700 py-12">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact <span className="text-brand-500">Us</span>
          </h1>
          <p className="text-primary-300 max-w-2xl mx-auto">
            We are here to help! Reach out to us for any inquiries, quotes, or assistance.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info Cards */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                return info.href ? (
                  <a key={info.label} href={info.href} className="block group">
                    <Card className="h-full hover:border-brand-500/30 transition-all">
                      <CardContent className="p-5">
                        <Icon className="h-6 w-6 text-brand-500 mb-3" />
                        <h3 className="text-sm font-semibold text-white mb-1">{info.label}</h3>
                        <span className="text-sm text-primary-300 group-hover:text-brand-500 transition-colors whitespace-pre-line">
                          {info.value}
                        </span>
                      </CardContent>
                    </Card>
                  </a>
                ) : (
                  <div key={info.label}>
                    <Card className="h-full">
                      <CardContent className="p-5">
                        <Icon className="h-6 w-6 text-brand-500 mb-3" />
                        <h3 className="text-sm font-semibold text-white mb-1">{info.label}</h3>
                        <p className="text-sm text-primary-300 whitespace-pre-line">{info.value}</p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>

            {/* WhatsApp CTA */}
            <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
              <div className="p-5 rounded-xl border border-green-500/30 bg-green-500/5 hover:bg-green-500/10 transition-all">
                <div className="flex items-center gap-3">
                  <svg className="h-8 w-8 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  <div>
                    <p className="font-semibold text-green-400">Chat on WhatsApp</p>
                    <p className="text-sm text-primary-300">Quick replies, usually within 1 hour</p>
                  </div>
                </div>
              </div>
            </a>

            {/* Map */}
            <div className="rounded-xl overflow-hidden border border-primary-700 h-64">
              <iframe
                src={MAP_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Devendra Electricals Location"
              />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {success ? (
              <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-8 text-center h-full flex flex-col items-center justify-center">
                <CheckCircle className="h-16 w-16 text-green-400 mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-2">Message Sent!</h3>
                <p className="text-primary-300 mb-6">Thank you for contacting us. We will get back to you shortly.</p>
                <Button variant="outline" onClick={() => setSuccess(false)}>Send Another Message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-primary-700 bg-primary-800/50 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-white mb-2">Send us a Message</h2>
                <p className="text-primary-300 text-sm mb-6">Fill out the form and we will get back to you within 2 hours.</p>
                <div>
                  <label className="block text-sm font-medium text-primary-200 mb-1">Your Name *</label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-200 mb-1">Email Address</label>
                  <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="email" placeholder="Enter your email" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-200 mb-1">Phone Number *</label>
                  <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} type="tel" placeholder="Enter your phone number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-200 mb-1">Message *</label>
                  <Textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Tell us how we can help you..." />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <Button type="submit" className="w-full gap-2" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'} <Send className="h-4 w-4" />
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
