'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, ChevronRight, Star, Share2, ShoppingCart, Eye, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSettings } from '@/lib/settings';
import { formatPrice, getWhatsAppProductUrl, getImageUrl, isValidPhone, stripNonDigits } from '@/lib/utils';
import { api } from '@/lib/api';
import type { Product } from '@/types';

export default function ProductDetailPage() {
  const { settings } = useSettings();
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryData, setInquiryData] = useState({ name: '', phone: '', message: '' });
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      try {
        const res = await api.get<{ success: boolean; data: Product }>(`/products/${params.slug}`);
        if (res.success) {
          setProduct(res.data);
          const catId = typeof res.data.category === 'object' ? res.data.category?._id : res.data.category;
          if (catId) {
            const relatedRes = await api.get<{ success: boolean; data: Product[] }>(`/products/related/${res.data._id}`);
            if (relatedRes.success) setRelated(relatedRes.data || []);
          }
        }
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setIsLoading(false);
      }
    }
    if (params.slug) loadProduct();
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Product not found</h2>
        <Link href="/products"><Button variant="outline">Back to Products</Button></Link>
      </div>
    );
  }

  const categoryName = typeof product.category === 'object' ? product.category?.name : '';
  const categorySlug = typeof product.category === 'object' ? product.category?.slug : '';

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhone(inquiryData.phone)) {
      alert('Please enter a valid phone number (10-15 digits)');
      return;
    }
    try {
      await api.post('/inquiries', {
        ...inquiryData,
        product: product._id,
        productName: product.name,
      });
      setInquirySent(true);
    } catch {
      alert('Failed to send inquiry. Please try again.');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-primary-400 mb-8">
          <Link href="/" className="hover:text-brand-500">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-brand-500">Products</Link>
          {categoryName && (<><ChevronRight className="h-3 w-3" /><Link href={`/products?category=${categorySlug}`} className="hover:text-brand-500">{categoryName}</Link></>)}
          <ChevronRight className="h-3 w-3" />
          <span className="text-white">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="aspect-square rounded-xl overflow-hidden bg-primary-700/30 border border-primary-700 mb-4">
              <img
                src={getImageUrl(product.images?.[selectedImage])}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      i === selectedImage ? 'border-brand-500' : 'border-primary-600 hover:border-primary-400'
                    }`}
                  >
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {product.brand && (
              <Badge variant="default" className="text-xs">{product.brand}</Badge>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-white">{product.name}</h1>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-brand-500">{formatPrice(product.price)}</span>
              {product.mrp && product.mrp > (product.price || 0) && (
                <>
                  <span className="text-lg text-primary-400 line-through">{formatPrice(product.mrp)}</span>
                  <Badge variant="destructive">
                    -{Math.round(((product.mrp - (product.price || 0)) / product.mrp) * 100)}% OFF
                  </Badge>
                </>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-primary-300">
              <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {product.viewCount || 0} views</span>
              <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" /> {product.inquiryCount || 0} inquiries</span>
            </div>

            <p className="text-primary-300 leading-relaxed">{product.description}</p>

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.specifications.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-brand-500 flex-shrink-0" />
                      <span className="text-primary-300">{spec.key}:</span>
                      <span className="text-white font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.slice(0, 8).map((tag) => (
                  <Link key={tag} href={`/products?search=${tag}`}>
                    <Badge variant="outline" className="text-xs cursor-pointer hover:border-brand-500/50 transition-colors">
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <a href={getWhatsAppProductUrl(product.name, settings.whatsappNumber)} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" size="lg" className="gap-2">
                  <MessageCircle className="h-5 w-5" /> Enquire on WhatsApp
                </Button>
              </a>
              <Button variant="outline" size="lg" onClick={() => setShowInquiry(!showInquiry)}>
                Send Inquiry
              </Button>
              <a href={`tel:+919876543210`}>
                <Button variant="secondary" size="lg" className="gap-2">
                  Call Now
                </Button>
              </a>
            </div>

            {/* Inquiry Form Inline */}
            {showInquiry && !inquirySent && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                onSubmit={handleInquirySubmit}
                className="space-y-3 p-4 rounded-xl border border-primary-700 bg-primary-800/50"
              >
                <input
                  value={inquiryData.name}
                  onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                  placeholder="Your Name *"
                  className="w-full h-10 rounded-lg border border-primary-600 bg-primary-800 px-3 text-sm text-white"
                  required
                />
                <input
                  value={inquiryData.phone}
                    onChange={(e) => setInquiryData({ ...inquiryData, phone: stripNonDigits(e.target.value) })}
                  placeholder="Phone Number *"
                  className="w-full h-10 rounded-lg border border-primary-600 bg-primary-800 px-3 text-sm text-white"
                  required
                />
                <textarea
                  value={inquiryData.message}
                  onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                  placeholder="Your Message"
                  className="w-full h-20 rounded-lg border border-primary-600 bg-primary-800 px-3 py-2 text-sm text-white"
                />
                <Button type="submit" className="w-full">Submit Inquiry</Button>
              </motion.form>
            )}
            {inquirySent && (
              <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/5 text-center">
                <p className="text-green-400 font-semibold">Inquiry sent! We will contact you shortly.</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((rp) => (
                <Link key={rp._id} href={`/products/${rp.slug}`}>
                  <Card className="group cursor-pointer hover:border-brand-500/50 transition-all duration-300">
                    <div className="aspect-square bg-primary-700/30 overflow-hidden rounded-t-xl">
                      <img src={getImageUrl(rp.images?.[0])} alt={rp.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                    <CardContent className="p-4 space-y-2">
                      {rp.brand && <p className="text-xs text-brand-500 font-semibold">{rp.brand}</p>}
                      <h3 className="font-semibold text-white group-hover:text-brand-500 transition-colors line-clamp-2">{rp.name}</h3>
                      <p className="text-lg font-bold text-brand-500">{formatPrice(rp.price)}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
