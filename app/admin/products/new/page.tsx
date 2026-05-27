'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { Category } from '@/types';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function NewProductPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', shortDescription: '', category: '', price: '', mrp: '',
    stock: '0', brand: '', featured: false, isActive: true,
    specifications: [{ key: '', value: '' }],
    tags: '', images: [] as string[],
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.get<{ success: boolean; data: Category[] }>('/categories?active=true');
        if (res.success) setCategories(res.data || []);
      } catch {}
    }
    loadCategories();
  }, []);

  const addSpec = () => setForm({ ...form, specifications: [...form.specifications, { key: '', value: '' }] });
  const updateSpec = (i: number, field: 'key' | 'value', val: string) => {
    const specs = [...form.specifications];
    specs[i][field] = val;
    setForm({ ...form, specifications: specs });
  };
  const removeSpec = (i: number) => {
    if (form.specifications.length === 1) return;
    setForm({ ...form, specifications: form.specifications.filter((_, idx) => idx !== i) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.description) {
      toast.error('Name, category, and description are required');
      return;
    }
    setIsSubmitting(true);
    try {
      const data = {
        name: form.name,
        description: form.description,
        shortDescription: form.shortDescription,
        category: form.category,
        price: form.price ? parseFloat(form.price) : undefined,
        mrp: form.mrp ? parseFloat(form.mrp) : undefined,
        stock: parseInt(form.stock, 10),
        brand: form.brand || undefined,
        featured: form.featured,
        isActive: form.isActive,
        specifications: form.specifications.filter((s) => s.key && s.value),
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        images: form.images,
      };

      await api.post('/products', data, token);
      toast.success('Product created!');
      router.push('/admin/products');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 rounded-lg text-primary-400 hover:text-white hover:bg-primary-700 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">New Product</h1>
          <p className="text-sm text-primary-400">Add a new product to your catalog</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold text-white">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-primary-200 mb-1">Product Name *</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Havells 6A Switch" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-primary-200 mb-1">Short Description</label>
                <Input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} placeholder="Brief description for cards" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-primary-200 mb-1">Description *</label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Detailed product description" />
              </div>
              <div>
                <label className="block text-sm text-primary-200 mb-1">Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full h-11 rounded-lg border border-primary-600 bg-primary-800/50 px-4 text-sm text-white">
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-primary-200 mb-1">Brand</label>
                <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="e.g., Havells" />
              </div>
              <div>
                <label className="block text-sm text-primary-200 mb-1">Price (₹)</label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0" />
              </div>
              <div>
                <label className="block text-sm text-primary-200 mb-1">MRP (₹)</label>
                <Input type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} placeholder="0" />
              </div>
              <div>
                <label className="block text-sm text-primary-200 mb-1">Stock</label>
                <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm text-primary-200 mb-1">Tags (comma separated)</label>
                <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="wire, copper, havells" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded border-primary-600 bg-primary-800 text-brand-500 focus:ring-brand-500" />
                <span className="text-sm text-primary-200">Featured Product</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded border-primary-600 bg-primary-800 text-brand-500 focus:ring-brand-500" />
                <span className="text-sm text-primary-200">Active</span>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white">Specifications</h2>
              <Button type="button" variant="outline" size="sm" onClick={addSpec}>Add Row</Button>
            </div>
            {form.specifications.map((spec, i) => (
              <div key={i} className="flex gap-2 items-start">
                <Input value={spec.key} onChange={(e) => updateSpec(i, 'key', e.target.value)} placeholder="Key (e.g., Wattage)" className="flex-1" />
                <Input value={spec.value} onChange={(e) => updateSpec(i, 'value', e.target.value)} placeholder="Value (e.g., 12W)" className="flex-1" />
                <button type="button" onClick={() => removeSpec(i)} className="p-2 text-red-400 hover:text-red-300 mt-1">✕</button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold text-white">Images (URLs)</h2>
            <p className="text-xs text-primary-400">Enter image URLs (Cloudinary or other). In production, use the upload feature.</p>
            <Input value={form.images[0] || ''} onChange={(e) => setForm({ ...form, images: [e.target.value] })} placeholder="https://..." />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/admin/products"><Button type="button" variant="outline">Cancel</Button></Link>
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            <Save className="h-4 w-4" /> {isSubmitting ? 'Creating...' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
