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
import type { Category } from '@/types';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', icon: '' });

  const loadCategories = async () => {
    if (!token) return;
    try {
      const res = await api.get<{ success: boolean; data: Category[] }>('/categories', token);
      if (res.success) setCategories(res.data || []);
    } catch { toast.error('Failed to load'); } finally { setIsLoading(false); }
  };

  useEffect(() => { loadCategories(); }, [token]);

  const handleCreate = async () => {
    if (!form.name) { toast.error('Name is required'); return; }
    try {
      await api.post('/categories', form, token);
      toast.success('Category created');
      setForm({ name: '', description: '', icon: '' });
      loadCategories();
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed'); }
  };

  const handleUpdate = async (id: string) => {
    try {
      await api.put(`/categories/${id}`, form, token);
      toast.success('Updated');
      setEditing(null);
      loadCategories();
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`, token);
      toast.success('Deleted');
      loadCategories();
    } catch { toast.error('Failed to delete'); }
  };

  const startEdit = (cat: Category) => {
    setEditing(cat._id);
    setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <p className="text-sm text-primary-400">Manage product categories</p>
      </div>

      {/* Create Form */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-primary-400 mb-1">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Category name" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-primary-400 mb-1">Description</label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description" />
          </div>
          <div className="w-32">
            <label className="block text-xs text-primary-400 mb-1">Icon</label>
            <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="zap, sun, etc." />
          </div>
          <Button onClick={handleCreate} size="sm" className="gap-1"><Plus className="h-4 w-4" /> Add</Button>
        </CardContent>
      </Card>

      {/* List */}
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat._id} className="flex items-center gap-4 p-4 rounded-lg border border-primary-700 bg-primary-800/30">
            {editing === cat._id ? (
              <>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="flex-1" />
                <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="icon" className="w-24" />
                <button onClick={() => handleUpdate(cat._id)} className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg"><Check className="h-4 w-4" /></button>
                <button onClick={() => setEditing(null)} className="p-2 text-primary-400 hover:bg-primary-700 rounded-lg"><X className="h-4 w-4" /></button>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <p className="font-medium text-white">{cat.name}</p>
                  <p className="text-xs text-primary-400">Slug: {cat.slug} {cat.description ? `| ${cat.description}` : ''}</p>
                </div>
                <Badge variant={cat.isActive ? 'success' : 'destructive'}>{cat.isActive ? 'Active' : 'Inactive'}</Badge>
                <button onClick={() => startEdit(cat)} className="p-2 text-primary-400 hover:text-white hover:bg-primary-700 rounded-lg"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(cat._id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="h-4 w-4" /></button>
              </>
            )}
          </div>
        ))}
        {!isLoading && categories.length === 0 && <p className="text-center text-primary-400 py-8">No categories yet</p>}
      </div>
    </div>
  );
}
