'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { Testimonial } from '@/types';
import toast from 'react-hot-toast';

export default function AdminTestimonialsPage() {
  const { token } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', company: '', content: '', rating: 5, avatar: '', isActive: true, order: 0 });

  const load = async () => {
    if (!token) return;
    try { const res = await api.get<{ success: boolean; data: Testimonial[] }>('/testimonials', token); if (res.success) setTestimonials(res.data || []); } catch {} finally { setIsLoading(false); }
  };
  useEffect(() => { load(); }, [token]);

  const resetForm = () => setForm({ name: '', company: '', content: '', rating: 5, avatar: '', isActive: true, order: 0 });

  const handleCreate = async () => {
    if (!form.name || !form.content) { toast.error('Name and content are required'); return; }
    try { await api.post('/testimonials', form, token); toast.success('Testimonial created'); resetForm(); load(); } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed'); }
  };

  const handleUpdate = async (id: string) => {
    try { await api.put(`/testimonials/${id}`, form, token); toast.success('Updated'); setEditing(null); load(); } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    try { await api.delete(`/testimonials/${id}`, token); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  const startEdit = (t: Testimonial) => { setEditing(t._id); setForm({ name: t.name, company: t.company || '', content: t.content, rating: t.rating, avatar: t.avatar || '', isActive: t.isActive, order: t.order }); };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Testimonials</h1><p className="text-sm text-primary-400">Manage customer testimonials</p></div>

      <Card><CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-white text-sm">{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Customer Name *" />
          <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company (optional)" />
          <div className="md:col-span-2"><Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Testimonial content *" /></div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-primary-400">Rating:</span>
            {[1, 2, 3, 4, 5].map((r) => (
              <button key={r} onClick={() => setForm({ ...form, rating: r })}>
                <Star className={`h-5 w-5 ${r <= form.rating ? 'fill-brand-500 text-brand-500' : 'text-primary-600'}`} />
              </button>
            ))}
          </div>
          <Input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="Avatar URL" />
          <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} placeholder="Order" />
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-primary-600 bg-primary-800 text-brand-500" /><span className="text-sm text-primary-200">Active</span></label>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <Button size="sm" onClick={() => handleUpdate(editing)} className="gap-1"><Check className="h-4 w-4" /> Update</Button>
          ) : (
            <Button size="sm" onClick={handleCreate} className="gap-1"><Plus className="h-4 w-4" /> Add</Button>
          )}
          {editing && <Button size="sm" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>}
        </div>
      </CardContent></Card>

      <div className="grid md:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <Card key={t._id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white">{t.name}</p>
                    <Badge variant={t.isActive ? 'success' : 'destructive'}>{t.isActive ? 'Active' : 'Inactive'}</Badge>
                  </div>
                  {t.company && <p className="text-xs text-primary-400">{t.company}</p>}
                  <div className="flex gap-0.5 my-2">
                    {Array.from({ length: t.rating }).map((_, i) => (<Star key={i} className="h-3 w-3 fill-brand-500 text-brand-500" />))}
                  </div>
                  <p className="text-sm text-primary-300 line-clamp-3">&ldquo;{t.content}&rdquo;</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => startEdit(t)} className="p-2 text-primary-400 hover:text-white hover:bg-primary-700 rounded-lg"><Edit2 className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(t._id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {!isLoading && testimonials.length === 0 && <div className="md:col-span-2"><p className="text-center text-primary-400 py-8">No testimonials yet</p></div>}
      </div>
    </div>
  );
}
