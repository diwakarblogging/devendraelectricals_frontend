'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Phone, Mail, Trash2, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { formatDate, getWhatsAppUrl } from '@/lib/utils';
import type { Inquiry } from '@/types';
import toast from 'react-hot-toast';

const statusColors: Record<string, 'destructive' | 'default' | 'success' | 'secondary'> = {
  pending: 'destructive', contacted: 'default', completed: 'success', cancelled: 'secondary',
};

export default function AdminInquiriesPage() {
  const { token } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<Inquiry | null>(null);

  const load = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (statusFilter) params.set('status', statusFilter);
      const res = await api.get<{ success: boolean; data: Inquiry[] }>(`/inquiries?${params}`, token);
      if (res.success) setInquiries(res.data || []);
    } catch { toast.error('Failed to load'); } finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, [token, statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/inquiries/${id}`, { status }, token);
      toast.success('Status updated');
      load();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this inquiry?')) return;
    try {
      await api.delete(`/inquiries/${id}`, token);
      toast.success('Deleted');
      load();
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Inquiries</h1>
          <p className="text-sm text-primary-400">Customer inquiries and leads</p>
        </div>
        <div className="flex gap-2">
          {['', 'pending', 'contacted', 'completed', 'cancelled'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === s ? 'bg-brand-500/10 text-brand-500 border border-brand-500/20' : 'text-primary-400 hover:text-white bg-primary-800/50 border border-primary-700'
              }`}>
              {s || 'All'}
            </button>
          ))}
          <button onClick={load} className="p-2 text-primary-400 hover:text-white"><RefreshCw className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)
          ) : inquiries.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-primary-400">No inquiries found</CardContent></Card>
          ) : (
            inquiries.map((inq) => (
              <motion.div key={inq._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selected?._id === inq._id ? 'border-brand-500 bg-brand-500/5' : 'border-primary-700 bg-primary-800/30 hover:border-primary-600'
                }`}
                onClick={() => setSelected(inq)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">{inq.name}</p>
                      {!inq.isRead && <span className="w-2 h-2 rounded-full bg-brand-500" />}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-primary-400 mt-1">
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {inq.phone}</span>
                      {inq.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {inq.email}</span>}
                      <span>{formatDate(inq.createdAt)}</span>
                    </div>
                    <p className="text-sm text-primary-300 mt-2 line-clamp-2">{inq.message}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={statusColors[inq.status]}>{inq.status}</Badge>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selected ? (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Details</h3>
                  <Badge variant={statusColors[selected.status]}>{selected.status}</Badge>
                </div>
                <div className="space-y-3 text-sm">
                  <div><p className="text-primary-400">Name</p><p className="text-white">{selected.name}</p></div>
                  <div><p className="text-primary-400">Phone</p><a href={`tel:${selected.phone}`} className="text-brand-500 hover:underline">{selected.phone}</a></div>
                  {selected.email && <div><p className="text-primary-400">Email</p><a href={`mailto:${selected.email}`} className="text-brand-500 hover:underline">{selected.email}</a></div>}
                  {selected.productName && <div><p className="text-primary-400">Product</p><p className="text-white">{selected.productName}</p></div>}
                  {selected.quantity && <div><p className="text-primary-400">Quantity</p><p className="text-white">{selected.quantity}</p></div>}
                  <div><p className="text-primary-400">Message</p><p className="text-white">{selected.message}</p></div>
                  <div><p className="text-primary-400">Date</p><p className="text-white">{formatDate(selected.createdAt)}</p></div>
                  <div><p className="text-primary-400">Source</p><p className="text-white capitalize">{selected.source}</p></div>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <a href={`tel:${selected.phone}`} className="flex items-center gap-2 justify-center w-full h-10 rounded-lg bg-primary-700 text-white text-sm hover:bg-primary-600 transition-colors">
                    <Phone className="h-4 w-4" /> Call Now
                  </a>
                  <a href={getWhatsAppUrl(`Hi ${selected.name}, we received your inquiry about ${selected.productName || 'our products'}.`)} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 justify-center w-full h-10 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-sm hover:bg-green-500/20 transition-colors">
                    Reply on WhatsApp
                  </a>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => updateStatus(selected._id, 'contacted')}
                      className="h-9 rounded-lg bg-brand-500/10 text-brand-500 border border-brand-500/20 text-xs hover:bg-brand-500/20 transition-colors">
                      Mark Contacted
                    </button>
                    <button onClick={() => updateStatus(selected._id, 'completed')}
                      className="h-9 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-xs hover:bg-green-500/20 transition-colors">
                      Mark Completed
                    </button>
                  </div>
                  <button onClick={() => handleDelete(selected._id)}
                    className="flex items-center gap-2 justify-center w-full h-9 rounded-lg text-red-400 text-xs hover:bg-red-500/10 transition-colors">
                    <Trash2 className="h-3 w-3" /> Delete Inquiry
                  </button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card><CardContent className="p-8 text-center text-primary-400 text-sm">Select an inquiry to view details</CardContent></Card>
          )}
        </div>
      </div>
    </div>
  );
}
