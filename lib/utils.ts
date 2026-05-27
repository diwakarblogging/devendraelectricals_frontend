import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price?: number): string {
  if (!price) return 'Contact for Price';
  return `₹${price.toLocaleString('en-IN')}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const WHATSAPP_NUMBER = '+919876543210';
export const PHONE_NUMBER = '+91-9876543210';
export const SHOP_ADDRESS = '81/1, main road, near bank of baroda, barra-2, Barra, kanpur nagar, Kanpur, Uttar Pradesh 208027';
export const SHOP_EMAIL = 'info@devendraelectricals.com';
export const MAP_EMBED_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114319.99337717566!2d80.14821769726562!3d26.43961400000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c47b8fd2379d1%3A0xa39729d9546a4c92!2sDevendra%20Electricals!5e0!3m2!1sen!2sin!4v1779830270716!5m2!1sen!2sin';

export function getWhatsAppUrl(message?: string, whatsappNumber?: string): string {
  const number = whatsappNumber || WHATSAPP_NUMBER;
  const text = message
    ? `Hi Devendra Electricals! I'm interested in: ${message}`
    : 'Hi Devendra Electricals! I would like to know more about your products.';
  return `https://wa.me/${number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppProductUrl(productName: string, whatsappNumber?: string): string {
  return getWhatsAppUrl(`I'm interested in purchasing: ${productName}`, whatsappNumber);
}

export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^\+?\d{10,15}$/.test(cleaned);
}

export function getImageUrl(path?: string): string {
  if (!path) return '/images/placeholder.svg';
  if (path.startsWith('http')) return path;
  return path;
}
