'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package, Tags, MessageSquare, Image as ImageIcon, Star, Eye,
  TrendingUp, AlertCircle, Clock, ArrowUpRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { formatDate, formatPrice } from '@/lib/utils';
import type { DashboardStats } from '@/types';
import Link from 'next/link';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!token) return;
      try {
        const res = await api.get<{ success: boolean; data: DashboardStats }>('/dashboard/stats', token);
        if (res.success) setData(res.data);
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [token]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-4 w-20 mb-2" /><Skeleton className="h-8 w-16" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = data?.stats;

  const statCards = [
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'text-blue-400 bg-blue-500/10' },
    { label: 'Categories', value: stats?.totalCategories || 0, icon: Tags, color: 'text-purple-400 bg-purple-500/10' },
    { label: 'Total Inquiries', value: stats?.totalInquiries || 0, icon: MessageSquare, color: 'text-green-400 bg-green-500/10' },
    { label: 'Pending Inquiries', value: stats?.pendingInquiries || 0, icon: AlertCircle, color: 'text-yellow-400 bg-yellow-500/10' },
    { label: 'Featured Products', value: stats?.featuredProducts || 0, icon: Star, color: 'text-brand-500 bg-brand-500/10' },
    { label: 'Banners', value: stats?.totalBanners || 0, icon: ImageIcon, color: 'text-pink-400 bg-pink-500/10' },
    { label: 'Testimonials', value: stats?.totalTestimonials || 0, icon: Star, color: 'text-indigo-400 bg-indigo-500/10' },
    { label: 'Total Views', value: stats?.totalViews || 0, icon: Eye, color: 'text-cyan-400 bg-cyan-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-primary-400 text-sm mt-1">Overview of your electrical shop</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:border-brand-500/30 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-primary-400 mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Inquiries */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Inquiries</h2>
              <Link href="/admin/inquiries" className="text-sm text-brand-500 hover:underline flex items-center gap-1">
                View All <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {data?.recentInquiries?.length ? (
                data.recentInquiries.slice(0, 5).map((inq) => (
                  <div key={inq._id} className="flex items-center justify-between p-3 rounded-lg bg-primary-700/30">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">{inq.name}</p>
                      <p className="text-xs text-primary-400">{inq.phone} - {formatDate(inq.createdAt)}</p>
                    </div>
                    <Badge variant={inq.status === 'pending' ? 'destructive' : inq.status === 'contacted' ? 'default' : 'success'}>
                      {inq.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-primary-400 text-center py-4">No inquiries yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Products</h2>
              <Link href="/admin/products" className="text-sm text-brand-500 hover:underline flex items-center gap-1">
                View All <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {data?.recentProducts?.length ? (
                data.recentProducts.slice(0, 5).map((prod) => (
                  <div key={prod._id} className="flex items-center justify-between p-3 rounded-lg bg-primary-700/30">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">{prod.name}</p>
                      <p className="text-xs text-primary-400">
                        {typeof prod.category === 'object' ? prod.category?.name : ''} - {formatPrice(prod.price)}
                      </p>
                    </div>
                    {prod.featured && <Badge variant="default">Featured</Badge>}
                  </div>
                ))
              ) : (
                <p className="text-sm text-primary-400 text-center py-4">No products yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution */}
      {data?.categoryDistribution && data.categoryDistribution.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Products by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.categoryDistribution.map((cat) => (
                <div key={cat.name} className="p-4 rounded-lg bg-primary-700/30 text-center">
                  <p className="text-xl font-bold text-white">{cat.count}</p>
                  <p className="text-sm text-primary-400">{cat.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
