'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Star, StarOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadProducts = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: '20', active: 'all' });
      if (search) params.set('search', search);
      const res = await api.get<{ success: boolean; data: Product[]; totalPages: number }>(`/products?${params}`, token);
      if (res.success) {
        setProducts(res.data || []);
        setTotalPages(res.totalPages || 1);
      }
    } catch {
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, [token, page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`, token);
      toast.success('Product deleted');
      loadProducts();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const toggleFeatured = async (product: Product) => {
    try {
      await api.put(`/products/${product._id}`, { featured: !product.featured }, token);
      toast.success(product.featured ? 'Removed from featured' : 'Added to featured');
      loadProducts();
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-sm text-primary-400">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-2"><Plus className="h-4 w-4" /> Add Product</Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadProducts()}
            placeholder="Search products..."
            className="w-full h-10 rounded-lg border border-primary-600 bg-primary-800/50 pl-9 pr-4 text-sm text-white"
          />
        </div>
        <Button variant="secondary" onClick={loadProducts}>Search</Button>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <Card><CardContent className="p-8 text-center">
          <p className="text-primary-400">No products found. Add your first product!</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-4 p-4 rounded-lg border border-primary-700 bg-primary-800/30 hover:border-primary-600 transition-all"
            >
              <img
                src={product.images?.[0] || '/images/placeholder.svg'}
                alt={product.name}
                className="w-12 h-12 rounded-lg object-cover bg-primary-700 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{product.name}</p>
                <p className="text-xs text-primary-400">
                  {typeof product.category === 'object' ? product.category?.name : ''} | Stock: {product.stock} | {formatPrice(product.price)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleFeatured(product)} className={`p-2 rounded-lg transition-colors ${product.featured ? 'text-brand-500 bg-brand-500/10' : 'text-primary-400 hover:text-white hover:bg-primary-700'}`}>
                  {product.featured ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
                </button>
                <Link href={`/admin/products/edit/${product._id}`}>
                  <button className="p-2 rounded-lg text-primary-400 hover:text-white hover:bg-primary-700 transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                </Link>
                <button onClick={() => handleDelete(product._id)} className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <span className="flex items-center text-sm text-primary-400">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
