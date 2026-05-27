'use client';

import { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { SiteSettings } from '@/types';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<SiteSettings>({
    whatsappNumber: '',
    phoneNumber: '',
    shopAddress: '',
    shopEmail: '',
  });

  const load = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: SiteSettings }>('/settings', token);
      if (res.success && res.data) {
        setForm({
          whatsappNumber: res.data.whatsappNumber || '',
          phoneNumber: res.data.phoneNumber || '',
          shopAddress: res.data.shopAddress || '',
          shopEmail: res.data.shopEmail || '',
        });
      }
    } catch {
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, [token]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/settings', form, token);
      toast.success('Settings saved');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card><CardContent className="p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
        </CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-primary-400">Manage site configuration</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 text-primary-400 hover:text-white hover:bg-primary-700 rounded-lg transition-colors">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-primary-200 mb-1.5">WhatsApp Number</label>
            <Input
              value={form.whatsappNumber}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              placeholder="+919876543210"
            />
            <p className="text-xs text-primary-400 mt-1">Used for WhatsApp chat button and inquiry replies</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-200 mb-1.5">Phone Number</label>
            <Input
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              placeholder="+91-9876543210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-200 mb-1.5">Shop Address</label>
            <Input
              value={form.shopAddress}
              onChange={(e) => setForm({ ...form, shopAddress: e.target.value })}
              placeholder="Shop address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-200 mb-1.5">Shop Email</label>
            <Input
              value={form.shopEmail}
              onChange={(e) => setForm({ ...form, shopEmail: e.target.value })}
              placeholder="info@devendraelectricals.com"
            />
          </div>

          <div className="pt-2">
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
