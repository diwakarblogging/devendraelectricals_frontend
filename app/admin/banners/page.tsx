'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { Banner } from '@/types';
import toast from 'react-hot-toast';

export default function AdminBannersPage() {
  const { token } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', subtitle: '', description: '', image: '', buttonText: 'Shop Now', link: '', isActive: true, order: 0 });

  const load = async () => {
    if (!token) return;
    try { const res = await api.get<{ success: boolean; data: Banner[] }>('/banners', token); if (res.success) setBanners(res.data || []); } catch {} finally { setIsLoading(false); }
  };
  useEffect(() => { load(); }, [token]);

  const resetForm = () => setForm({ title: '', subtitle: '', description: '', image: '', buttonText: 'Shop Now', link: '', isActive: true, order: 0 });

  const handleCreate = async () => {
    if (!form.title || !form.image) { toast.error('Title and image are required'); return; }
    try { await api.post('/banners', form, token ?? undefined); toast.success('Banner created'); resetForm(); load(); } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed'); }
  };

  const handleUpdate = async (id: string) => {
    try { await api.put(`/banners/${id}`, form, token ?? undefined); toast.success('Updated'); setEditing(null); load(); } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    try { await api.delete(`/banners/${id}`, token ?? undefined); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  const startEdit = (b: Banner) => { setEditing(b._id); setForm({ title: b.title, subtitle: b.subtitle || '', description: b.description || '', image: b.image, buttonText: b.buttonText, link: b.link || '', isActive: b.isActive, order: b.order }); };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Banners</h1><p className="text-sm text-primary-400">Manage homepage banners</p></div>

      <Card><CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-white text-sm">{editing ? 'Edit Banner' : 'Add New Banner'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title *" />
          <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Subtitle" />
          <div className="md:col-span-2"><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL *" /></div>
          <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" />
          <Input value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} placeholder="Button Text" />
          <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="Link URL" />
          <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} placeholder="Order" />
        </div>
        <div className="flex gap-2">
          {editing ? (
            <Button size="sm" onClick={() => handleUpdate(editing)} className="gap-1"><Check className="h-4 w-4" /> Update</Button>
          ) : (
            <Button size="sm" onClick={handleCreate} className="gap-1"><Plus className="h-4 w-4" /> Add Banner</Button>
          )}
          {editing && <Button size="sm" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>}
        </div>
      </CardContent></Card>

      <div className="space-y-4">
        {banners.map((b) => (
          <Card key={b._id}>
            <CardContent className="p-4 flex gap-4">
              {b.image && <img src={b.image} alt={b.title} className="w-32 h-20 rounded-lg object-cover flex-shrink-0 bg-primary-700" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white">{b.title}</p>
                  <Badge variant={b.isActive ? 'success' : 'destructive'}>{b.isActive ? 'Active' : 'Inactive'}</Badge>
                  <span className="text-xs text-primary-400">Order: {b.order}</span>
                </div>
                {b.subtitle && <p className="text-xs text-primary-400 mt-1">{b.subtitle}</p>}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => startEdit(b)} className="p-2 text-primary-400 hover:text-white hover:bg-primary-700 rounded-lg"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(b._id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="h-4 w-4" /></button>
              </div>
            </CardContent>
          </Card>
        ))}
        {!isLoading && banners.length === 0 && <p className="text-center text-primary-400 py-8">No banners yet</p>}
      </div>
    </div>
  );
}
