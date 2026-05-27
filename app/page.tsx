import { api } from '@/lib/api';
import { HeroSection } from '@/components/home/hero';
import { CategoriesSection } from '@/components/home/categories';
import { FeaturedProducts } from '@/components/home/featured-products';
import { WhyChooseUs } from '@/components/home/why-choose-us';
import { TestimonialsSection } from '@/components/home/testimonials';
import { QuickInquiryForm } from '@/components/home/inquiry-form';
import type { Category, Product, Testimonial } from '@/types';

async function getHomeData() {
  try {
    const [categoriesRes, featuredRes, testimonialsRes] = await Promise.all([
      api.get<{ success: boolean; data: Category[] }>('/categories?active=true'),
      api.get<{ success: boolean; data: Product[] }>('/products/featured?limit=8'),
      api.get<{ success: boolean; data: Testimonial[] }>('/testimonials?active=true'),
    ]);

    return {
      categories: categoriesRes.data || [],
      featuredProducts: featuredRes.data || [],
      testimonials: testimonialsRes.data || [],
    };
  } catch {
    return { categories: [], featuredProducts: [], testimonials: [] };
  }
}

export default async function HomePage() {
  const { categories, featuredProducts, testimonials } = await getHomeData();

  return (
    <>
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FeaturedProducts products={featuredProducts} isLoading={false} />
      <WhyChooseUs />
      <TestimonialsSection testimonials={testimonials} />
      <QuickInquiryForm />
    </>
  );
}
