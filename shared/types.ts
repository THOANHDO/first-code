
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

export type CartItemType = 'PRODUCT' | 'SERVICE';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedColor?: string;
  maxStock: number;
  type?: CartItemType;
  bookingDate?: string;
  bookingTime?: string;
  bookingDuration?: number;
  gameIds?: string[]; // Added to store selected games
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
export type PaymentMethod = 'COD' | 'BANK_TRANSFER' | 'MOMO' | 'VNPAY' | 'ZALOPAY';
export type DeliveryMethod = 'SHIPPING' | 'STORE_PICKUP';

export interface Coupon {
  code: string;
  discount: number;
  type: 'PERCENT' | 'FIXED';
  description: string;
  minOrderValue?: number;
}

export interface OrderInput {
  userId?: string;
  items: CartItem[];
  totalAmount: number;
  customerName: string;
  phone: string;
  email: string;       
  address: string; // Delivery address or Store Address
  city: string;        
  paymentMethod: PaymentMethod; 
  deliveryMethod: DeliveryMethod;
  pickupStoreId?: string; // If STORE_PICKUP
  note?: string;
  couponCode?: string;
  discountAmount?: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';

export interface Order extends OrderInput {
  _id: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: 'PAID' | 'UNPAID';
}

// Station Interface
export type StationStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
export interface Station {
  _id: string;
  name: string;
  type: 'PS5' | 'SWITCH' | 'PC';
  description: string;
  pricePerHour: number;
  image: string;
  status: StationStatus;
  zone: string; 
}

// Game Interface for library
export interface GameLibrary {
  _id: string;
  title: string;
  image: string;
  isHot?: boolean;
  platform?: 'PS5' | 'SWITCH' | 'PC';
  category?: string;
  players?: string;
}

// F&B Interface
export type FoodDrinkCategory = 'DRINK' | 'SNACK' | 'NOODLE' | 'COFFEE' | 'TEA';
export interface FoodDrink {
  _id: string;
  name: string;
  price: number;
  category: FoodDrinkCategory;
  image: string;
  description: string;
  discount?: number;
}

export interface SessionCartItem extends FoodDrink {
  quantity: number;
  note?: string;
}

export interface BookingInput {
  userId?: string;
  name: string;
  phone: string;
  email: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration: number; // Hours
  stationId: string;
  storeId?: string; // Added: Link to specific store location
  gameIds?: string[];
  note?: string;
  paymentMethod?: PaymentMethod;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Booking extends BookingInput {
  _id: string;
  createdAt: string;
  status: BookingStatus;
  paymentStatus: 'PAID' | 'UNPAID';
  totalPrice: number;
  stationName?: string;
  endTime: string; // HH:mm (Calculated)
  fnbOrders?: SessionCartItem[];
}

export interface UserAddress {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  type: 'HOME' | 'OFFICE';
  isDefault: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'USER' | 'ADMIN';
  password?: string; 
  phone?: string;
  address?: string; // Legacy/Display address
  city?: string;    // Legacy/Display city
  // New profile fields
  gamerTag?: string;
  points?: number;
  birthDate?: string;
  gender?: 'Nam' | 'Nữ' | 'Khác';
  wishlist?: string[]; // Array of Product IDs
  addresses?: UserAddress[]; // New Address Book
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewsletterInput {
  email: string;
}

export interface StoreLocation {
  _id: string;
  name: string;
  address: string;
  city: string;
  image: string;
  images?: string[];
  mapEmbedUrl: string;
  phone: string;
  hours: { weekday: string; weekend: string };
  amenities: { icon: string; label: string; colorClass: string }[];
  equipment: { icon: string; name: string; count: number; colorClass: string }[];
}
