'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Grid3X3, List, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { api } from '@/lib/api';
import type { Product, Category } from '@/types';
import Link from 'next/link';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
];

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '-createdAt';

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      if (sort) params.set('sort', sort);
      params.set('page', page.toString());
      params.set('limit', '12');

      const res = await api.get<{ success: boolean; data: Product[]; total: number; totalPages: number }>(
        `/products?${params.toString()}`
      );
      if (res.success) {
        setProducts(res.data || []);
        setTotal(res.total || 0);
        setTotalPages(res.totalPages || 1);
      }
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [category, search, sort, page]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get<{ success: boolean; data: Category[] }>('/categories?active=true');
      if (res.success) setCategories(res.data || []);
    } catch {}
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const updateQuery = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    router.push(`/products?${newParams.toString()}`);
  };

  const selectedCategoryName = categories.find((c) => c.slug === category || c._id === category)?.name || 'All Products';

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary-800/30 border-b border-primary-700">
        <div className="container mx-auto py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {search ? `Search: "${search}"` : selectedCategoryName}
          </h1>
          <p className="text-primary-300">{total} products found</p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            <form action="/products" method="GET" className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-400" />
                <input
                  name="search"
                  type="text"
                  defaultValue={search}
                  placeholder="Search products..."
                  className="h-10 w-48 md:w-64 rounded-lg border border-primary-600 bg-primary-800/50 pl-9 pr-4 text-sm text-white placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <Button type="submit" size="sm" variant="secondary">Search</Button>
            </form>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
              {category && <Badge variant="default" className="ml-1">1</Badge>}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => updateQuery({ sort: e.target.value })}
              className="h-10 rounded-lg border border-primary-600 bg-primary-800/50 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="hidden sm:flex border border-primary-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-brand-500/20 text-brand-500' : 'text-primary-400 hover:text-white'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-brand-500/20 text-brand-500' : 'text-primary-400 hover:text-white'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-64 flex-shrink-0 hidden lg:block"
            >
              <div className="rounded-xl border border-primary-700 bg-primary-800/50 p-4 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Categories</h3>
                  {category && (
                    <button onClick={() => updateQuery({ category: '' })} className="text-xs text-brand-500 hover:underline">
                      Clear
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => updateQuery({ category: '' })}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      !category ? 'bg-brand-500/10 text-brand-500' : 'text-primary-300 hover:text-white hover:bg-primary-700'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => updateQuery({ category: cat.slug })}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        category === cat.slug || category === cat._id
                          ? 'bg-brand-500/10 text-brand-500'
                          : 'text-primary-300 hover:text-white hover:bg-primary-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
              }>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className={viewMode === 'grid' ? 'p-4' : 'p-4 flex gap-4'}>
                      <Skeleton className={viewMode === 'grid' ? 'h-48 w-full mb-4' : 'h-24 w-24 flex-shrink-0'} />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <Search className="h-12 w-12 text-primary-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-primary-400">Try a different search or category</p>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
                }>
                  {products.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link href={`/products/${product.slug}`}>
                        <Card className={`group cursor-pointer hover:border-brand-500/50 transition-all duration-300 ${
                          viewMode === 'list' ? 'flex' : ''
                        }`}>
                          {viewMode === 'grid' ? (
                            <CardContent className="p-0">
                              <div className="relative aspect-square bg-primary-700/30 overflow-hidden rounded-t-xl">
                                <img src={getImageUrl(product.images?.[0])} alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                {product.mrp && product.price && product.mrp > product.price && (
                                  <div className="absolute top-2 right-2">
                                    <Badge variant="destructive">-{Math.round(((product.mrp - product.price) / product.mrp) * 100)}%</Badge>
                                  </div>
                                )}
                              </div>
                              <div className="p-4 space-y-2">
                                {product.brand && <p className="text-xs text-brand-500 font-semibold">{product.brand}</p>}
                                <h3 className="font-semibold text-white group-hover:text-brand-500 transition-colors line-clamp-2">{product.name}</h3>
                                <p className="text-lg font-bold text-brand-500">
                                  {formatPrice(product.price)}
                                  {product.mrp && <span className="text-sm text-primary-400 line-through ml-2">{formatPrice(product.mrp)}</span>}
                                </p>
                              </div>
                            </CardContent>
                          ) : (
                            <CardContent className="p-4 flex gap-4 flex-1">
                              <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-primary-700/30">
                                <img src={getImageUrl(product.images?.[0])} alt={product.name}
                                  className="w-full h-full object-cover" loading="lazy" />
                              </div>
                              <div className="flex-1 min-w-0">
                                {product.brand && <p className="text-xs text-brand-500 font-semibold">{product.brand}</p>}
                                <h3 className="font-semibold text-white group-hover:text-brand-500 transition-colors">{product.name}</h3>
                                <p className="text-sm text-primary-400 mt-1 line-clamp-2">{product.shortDescription || product.description}</p>
                                <p className="text-lg font-bold text-brand-500 mt-2">
                                  {formatPrice(product.price)}
                                  {product.mrp && <span className="text-sm text-primary-400 line-through ml-2">{formatPrice(product.mrp)}</span>}
                                </p>
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
