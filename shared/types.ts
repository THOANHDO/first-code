// Data Models mirroring a MongoDB Schema

export interface Review {
  id: string;
  user: string;
  avatar?: string;
  rating: number;
  date: string;
  content: string;
  image?: string;
}

export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating?: number;
  reviewCount?: number; 
  brand?: string;       
  tags?: string[]; 
  slug: string;
  stock?: number;
  colors?: { name: string; hex: string }[];
  description?: string; 
  shortDescription?: string;
  specs?: { label: string; value: string }[];
  features?: string[];
  reviews?: Review[];
}

// UPGRADE: Hỗ trợ cả sản phẩm và dịch vụ (đặt lịch) trong giỏ hàng
export type CartItemType = 'PRODUCT' | 'SERVICE';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedColor?: string;
  maxStock: number;
  type?: CartItemType; // Mặc định là 'PRODUCT'
  // Fields cho Service Booking
  bookingDate?: string;
  bookingTime?: string;
  bookingDuration?: number; // Số giờ
}

export interface Category {
  _id: string;
  name: string;
  subtitle: string;
  image: string;
  icon: string;
  slug: string;
  code: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
}

export interface NewsArticle {
  _id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string; 
  categoryColor: string; 
  date: string;
  readTime: string;
}

export interface Banner {
  _id: string;
  badge: string;
  title: string;
  highlightText: string; 
  description: string;
  imageUrl: string;
  primaryBtn: string;
  secondaryBtn: string;
  stats: { text: string; label: string; bg: string }[];
}

export interface Feature {
  _id: string;
  icon: string;
  color: string;
  title: string;
  description: string;
}

export interface GameStationImage {
  _id: string;
  url: string;
  alt: string;
}

export interface ProductFilterParams {
  search?: string;
  categories?: string[]; 
  brands?: string[];     
  minPrice?: number;
  maxPrice?: number;
  sort?: 'popular' | 'newest' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export type FilterType = 'ALL' | 'PLAYSTATION' | 'NINTENDO' | 'ACCESSORIES' | 'TCG' | 'FIGURE';

// NEW: Định nghĩa phương thức thanh toán
export type PaymentMethod = 'COD' | 'BANK_TRANSFER' | 'MOMO' | 'ZALOPAY';

// NEW: Coupon Interface
export interface Coupon {
  code: string;
  discount: number; // Value e.g., 10 (percent) or 50000 (fixed)
  type: 'PERCENT' | 'FIXED';
  description: string;
  minOrderValue?: number;
}

// Input để tạo đơn hàng
export interface OrderInput {
  userId?: string; // Optional if guest
  items: CartItem[];
  totalAmount: number;
  customerName: string;
  phone: string;
  email: string;       
  address: string;
  city: string;        
  paymentMethod: PaymentMethod; 
  note?: string;
  // New fields for discounts
  couponCode?: string;
  discountAmount?: number;
}

// Order đã lưu trong DB
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';

export interface Order extends OrderInput {
  _id: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: 'PAID' | 'UNPAID';
}

// NEW: Định nghĩa Dịch vụ cho trang Booking
export interface Service {
  _id: string;
  name: string;
  description: string;
  pricePerHour: number;
  image: string;
  amenities: string[];
}

export interface BookingInput {
  userId?: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  duration: number; // Số giờ
  serviceId: string;
  peopleCount: number;
  note?: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Booking extends BookingInput {
  _id: string;
  createdAt: string;
  status: BookingStatus;
  totalPrice: number;
  serviceName?: string; // Cache tên dịch vụ để hiển thị
}

export interface NewsletterInput {
  email: string;
}

// NEW: User Auth Types Expanded
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'USER' | 'ADMIN';
  password?: string; 
  // Fields for checkout auto-fill
  phone?: string;
  address?: string;
  city?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

// NEW: Contact Form Input
export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// NEW: Store Location Interface
export interface StoreLocation {
  _id: string;
  name: string;
  address: string;
  city: string; // Used for filtering e.g., "hcm-q1"
  image: string;
  images?: string[]; // Added for slideshow
  mapEmbedUrl: string;
  phone: string;
  hours: {
    weekday: string;
    weekend: string;
  };
  amenities: {
    icon: string;
    label: string;
    colorClass: string; // e.g., "text-green-600 bg-green-50"
  }[];
  equipment: {
    icon: string;
    name: string;
    count: number;
    colorClass: string; // e.g., "text-primary"
  }[];
}