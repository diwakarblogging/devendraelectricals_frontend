export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: Category | string;
  price?: number;
  mrp?: number;
  images: string[];
  stock: number;
  featured: boolean;
  isActive: boolean;
  specifications: ProductSpecification[];
  brand?: string;
  tags: string[];
  unit: string;
  seoTitle?: string;
  seoDescription?: string;
  metaKeywords?: string;
  viewCount: number;
  inquiryCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  message: string;
  product?: Product;
  productName?: string;
  quantity?: number;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  source: 'website' | 'whatsapp' | 'phone';
  isRead: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  buttonText: string;
  isActive: boolean;
  order: number;
}

export interface Testimonial {
  _id: string;
  name: string;
  company?: string;
  content: string;
  rating: number;
  avatar?: string;
  isActive: boolean;
  order: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager';
  phone?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
  total?: number;
  totalPages?: number;
  currentPage?: number;
}

export interface DashboardStats {
  stats: {
    totalProducts: number;
    totalCategories: number;
    totalInquiries: number;
    totalBanners: number;
    totalTestimonials: number;
    pendingInquiries: number;
    featuredProducts: number;
    totalViews: number;
  };
  categoryDistribution: { name: string; count: number }[];
  recentInquiries: Inquiry[];
  recentProducts: Product[];
}
