import { PRODUCTS_DB, CATEGORIES_DB, ARTICLES_DB, BANNERS_DB, FEATURES_DB, GAME_STATION_IMAGES_DB, BRANDS_DB, USERS_DB, OTP_STORE, ORDERS_DB, BOOKINGS_DB, CONTACT_MESSAGES_DB, COUPONS_DB, STORES_DB, STATIONS_DB, GAMES_LIBRARY_DB, FOOD_DRINK_DB } from './database';
import { Product, Category, NewsArticle, Banner, Feature, GameStationImage, OrderInput, NewsletterInput, Brand, ProductFilterParams, PaginatedResult, BookingInput, User, AuthResponse, Order, Booking, ContactInput, Coupon, StoreLocation, Station, GameLibrary, FoodDrink, SessionCartItem } from '../shared/types';

const timeToMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};

export const DataService = {
  getBanners: async (): Promise<Banner[]> => { await new Promise(r => setTimeout(r, 200)); return BANNERS_DB; },
  getGameStationImages: async (): Promise<GameStationImage[]> => { await new Promise(r => setTimeout(r, 300)); return GAME_STATION_IMAGES_DB; },
  getFeatures: async (): Promise<Feature[]> => { await new Promise(r => setTimeout(r, 200)); return FEATURES_DB; },
  getStores: async (): Promise<StoreLocation[]> => { await new Promise(r => setTimeout(r, 300)); return STORES_DB; },

  getStations: async (): Promise<Station[]> => { 
    await new Promise(r => setTimeout(r, 300)); 
    return STATIONS_DB; 
  },
  
  getGameLibrary: async (): Promise<GameLibrary[]> => {
    await new Promise(r => setTimeout(r, 200));
    return GAMES_LIBRARY_DB;
  },

  getFoodDrinkMenu: async (): Promise<FoodDrink[]> => {
    await new Promise(r => setTimeout(r, 300));
    return FOOD_DRINK_DB;
  },

  getOccupiedSlots: async (date: string, stationId: string): Promise<{start: string, end: string}[]> => {
    await new Promise(r => setTimeout(r, 300));
    return BOOKINGS_DB
        .filter(b => b.date === date && b.stationId === stationId && b.status !== 'CANCELLED')
        .map(b => ({ start: b.time, end: b.endTime }));
  },

  getBookingById: async (id: string): Promise<Booking | undefined> => {
    await new Promise(r => setTimeout(r, 300));
    return BOOKINGS_DB.find(b => b._id === id);
  },

  getProducts: async (params: ProductFilterParams = {}): Promise<PaginatedResult<Product>> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    let result = [...PRODUCTS_DB];
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q));
    }
    if (params.categories && params.categories.length > 0) {
      result = result.filter(p => params.categories!.includes(p.category));
    }
    const page = params.page || 1;
    const limit = params.limit || 10;
    return {
      data: result.slice((page - 1) * limit, page * limit),
      total: result.length,
      page,
      totalPages: Math.ceil(result.length / limit)
    };
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return PRODUCTS_DB.find(p => p._id === id);
  },

  getRelatedProducts: async (category: string, excludeId: string): Promise<Product[]> => {
    await new Promise(r => setTimeout(r, 300));
    return PRODUCTS_DB.filter(p => p.category === category && p._id !== excludeId).slice(0, 4);
  },

  getCrossSellProducts: async (): Promise<Product[]> => {
    await new Promise(r => setTimeout(r, 300));
    return PRODUCTS_DB.slice(0, 4);
  },

  getCategories: async (): Promise<Category[]> => { await new Promise(r => setTimeout(r, 300)); return CATEGORIES_DB; },
  getBrands: async (): Promise<Brand[]> => { await new Promise(r => setTimeout(r, 250)); return BRANDS_DB; },
  getArticles: async (): Promise<NewsArticle[]> => { await new Promise(r => setTimeout(r, 400)); return ARTICLES_DB; },

  checkCoupon: async (code: string): Promise<{success: boolean, data?: Coupon, message?: string}> => {
    await new Promise(r => setTimeout(r, 500));
    const coupon = COUPONS_DB.find(c => c.code === code);
    return coupon ? { success: true, data: coupon } : { success: false, message: "Mã không hợp lệ" };
  },

  createOrder: async (input: OrderInput): Promise<{success: boolean, message: string, orderId: string}> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create the Order
    const newOrder: Order = {
        _id: `ORD-${Date.now().toString().slice(-6)}`,
        ...input,
        createdAt: new Date().toISOString(),
        status: 'PENDING',
        paymentStatus: 'UNPAID'
    };
    ORDERS_DB.push(newOrder);

    // AUTOMATICALLY CREATE BOOKINGS FOR SERVICE ITEMS
    input.items.forEach(item => {
        if (item.type === 'SERVICE' && item.bookingDate && item.bookingTime && item.bookingDuration) {
            // Calculate End Time
            const [h, m] = item.bookingTime.split(':').map(Number);
            const startMins = h * 60 + m;
            const endMins = startMins + (item.bookingDuration * 60);
            const endH = Math.floor(endMins / 60);
            const endM = endMins % 60;
            const endTimeStr = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

            // Find Station Info
            const station = STATIONS_DB.find(s => s._id === item.productId);

            const newBooking: Booking = {
                _id: `BKG-${Math.floor(1000 + Math.random() * 9000)}`,
                userId: input.userId,
                name: input.customerName,
                phone: input.phone,
                email: input.email,
                date: item.bookingDate,
                time: item.bookingTime,
                duration: item.bookingDuration,
                stationId: item.productId,
                storeId: input.pickupStoreId || 'hcm-q1', // Default to Q1 if not specified (or should strictly match selectedStore)
                gameIds: [], 
                createdAt: new Date().toISOString(),
                status: 'CONFIRMED',
                paymentStatus: 'PAID', // Assumed paid via Checkout
                totalPrice: (station?.pricePerHour || 0) * item.bookingDuration,
                stationName: station?.name,
                endTime: endTimeStr
            };
            
            // Validate overlapping (Simplified: just log if conflict, but create anyway for this mock flow)
            BOOKINGS_DB.push(newBooking);
        }
    });

    return { success: true, message: "Đặt hàng thành công!", orderId: newOrder._id };
  },

  submitBooking: async (input: BookingInput): Promise<{success: boolean, message: string, bookingId?: string}> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const [h, m] = input.time.split(':').map(Number);
    const startMins = h * 60 + m;
    const endMins = startMins + (input.duration * 60);
    const endH = Math.floor(endMins / 60);
    const endM = endMins % 60;
    const endTimeStr = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

    const isOverlapping = BOOKINGS_DB.some(b => {
        if (b.date !== input.date || b.stationId !== input.stationId || b.status === 'CANCELLED') return false;
        const bStart = timeToMinutes(b.time);
        const bEnd = timeToMinutes(b.endTime);
        return (startMins < bEnd && endMins > bStart);
    });

    if (isOverlapping) {
        return { success: false, message: "Khung giờ này đã có người đặt. Vui lòng chọn giờ khác hoặc máy khác." };
    }

    const station = STATIONS_DB.find(s => s._id === input.stationId);
    const newBooking: Booking = {
        _id: `BKG-${Math.floor(1000 + Math.random() * 9000)}`,
        ...input,
        createdAt: new Date().toISOString(),
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        totalPrice: (station?.pricePerHour || 0) * input.duration,
        stationName: station?.name,
        endTime: endTimeStr
    };

    BOOKINGS_DB.push(newBooking);
    return { success: true, message: "Đặt lịch thành công!", bookingId: newBooking._id };
  },

  extendBooking: async (id: string, additionalHours: number): Promise<{success: boolean, message: string, newEndTime?: string}> => {
    await new Promise(r => setTimeout(r, 1200));
    const booking = BOOKINGS_DB.find(b => b._id === id);
    if (!booking) return { success: false, message: "Không tìm thấy phiên chơi." };

    if (additionalHours > 2) return { success: false, message: "Chỉ được gia hạn tối đa 2 giờ một lần." };

    const [h, m] = booking.endTime.split(':').map(Number);
    const newEndMins = h * 60 + m + (additionalHours * 60);
    const newEndH = Math.floor(newEndMins / 60);
    const newEndM = newEndMins % 60;
    const newEndTimeStr = `${newEndH.toString().padStart(2, '0')}:${newEndM.toString().padStart(2, '0')}`;

    booking.duration += additionalHours;
    booking.endTime = newEndTimeStr;
    booking.totalPrice += (30000 * additionalHours); 

    return { success: true, message: "Gia hạn thành công!", newEndTime: newEndTimeStr };
  },

  submitSessionOrder: async (id: string, items: SessionCartItem[]): Promise<{success: boolean, message: string}> => {
    await new Promise(r => setTimeout(r, 1000));
    const booking = BOOKINGS_DB.find(b => b._id === id);
    if (booking) {
        booking.fnbOrders = [...(booking.fnbOrders || []), ...items];
    }
    return { success: true, message: "Đã gửi đơn hàng F&B thành công!" };
  },

  swapBookingGame: async (id: string, gameIds: string[]): Promise<{success: boolean, message: string}> => {
    await new Promise(r => setTimeout(r, 800));
    const booking = BOOKINGS_DB.find(b => b._id === id);
    if (booking) {
        booking.gameIds = gameIds;
    }
    return { success: true, message: "Đã cập nhật danh sách game." };
  },

  submitContact: async (input: ContactInput): Promise<{success: boolean, message: string}> => {
    await new Promise(r => setTimeout(r, 1000));
    CONTACT_MESSAGES_DB.push(input);
    return { success: true, message: "Đã gửi tin nhắn!" };
  }
};

export const AuthService = {
  login: async (email: string, password?: string): Promise<AuthResponse> => {
    await new Promise(r => setTimeout(r, 800));
    // Case-insensitive email check
    const user = USERS_DB.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && user.password === password) {
        const { password: _, ...cleanUser } = user;
        return { success: true, user: cleanUser as User };
    }
    return { success: false, message: "Email hoặc mật khẩu không chính xác." };
  },
  register: async (email: string, name: string, password?: string): Promise<AuthResponse> => {
    await new Promise(r => setTimeout(r, 1000));
    const newUser: User = { _id: 'u' + Date.now(), email, name, role: 'USER', password };
    USERS_DB.push(newUser);
    return { success: true, user: newUser };
  },
  logout: async (): Promise<void> => { await new Promise(r => setTimeout(r, 500)); },

  forgotPassword: async (email: string): Promise<{success: boolean, message: string}> => {
    await new Promise(r => setTimeout(r, 1000));
    const user = USERS_DB.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { success: false, message: "Email không tồn tại trong hệ thống." };
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    OTP_STORE[email] = otp;
    return { success: true, message: `Mã OTP đã được gửi (Demo: ${otp})` };
  },

  verifyOtp: async (email: string, otp: string): Promise<{success: boolean, message: string}> => {
    await new Promise(r => setTimeout(r, 800));
    if (OTP_STORE[email] === otp) return { success: true, message: "Mã xác thực chính xác." };
    return { success: false, message: "Mã xác thực không đúng." };
  },

  resetPassword: async (email: string, otp: string, newPassword: string): Promise<{success: boolean, message: string}> => {
    await new Promise(r => setTimeout(r, 1200));
    if (OTP_STORE[email] !== otp) return { success: false, message: "Xác thực không hợp lệ." };
    const userIndex = USERS_DB.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex > -1) {
      USERS_DB[userIndex].password = newPassword;
      delete OTP_STORE[email];
      return { success: true, message: "Mật khẩu đã được thay đổi thành công." };
    }
    return { success: false, message: "Không tìm thấy người dùng." };
  }
};