'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Tags, MessageSquare, Image as ImageIcon,
  Star, Settings, Menu, X, LogOut, ChevronRight, Zap, Users
} from 'lucide-react';
import { AuthProvider, useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';

const sidebarLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user && !pathname.includes('/login')) {
      router.push('/admin/login');
    }
  }, [user, isLoading, pathname, router]);

  if (pathname.includes('/login')) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-900">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-primary-900 flex">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-primary-800 border-r border-primary-700 transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-primary-700">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-brand-500" />
              <div>
                <div className="text-sm font-bold text-white">Devendra</div>
                <div className="text-xs text-brand-500">Electricals Admin</div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-500/10 text-brand-500 border border-brand-500/20'
                      : 'text-primary-300 hover:text-white hover:bg-primary-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                  {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-primary-700">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center">
                <Users className="h-4 w-4 text-brand-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-primary-400 capitalize">{user.role}</p>
              </div>
            </div>
            <button
              onClick={() => { logout(); router.push('/admin/login'); }}
              className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-primary-900/95 backdrop-blur-lg border-b border-primary-700 px-4 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-primary-300 hover:text-white hover:bg-primary-700"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <Link href="/" className="text-xs text-primary-400 hover:text-brand-500 transition-colors">
              View Website
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
