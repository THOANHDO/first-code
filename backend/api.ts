import { PRODUCTS_DB, CATEGORIES_DB, ARTICLES_DB, BANNERS_DB, FEATURES_DB, GAME_STATION_IMAGES_DB, BRANDS_DB, SERVICES_DB, USERS_DB, OTP_STORE, ORDERS_DB, BOOKINGS_DB, CONTACT_MESSAGES_DB, COUPONS_DB, STORES_DB } from './database';
import { Product, Category, NewsArticle, Banner, Feature, GameStationImage, FilterType, OrderInput, NewsletterInput, Brand, ProductFilterParams, PaginatedResult, BookingInput, Service, User, AuthResponse, Order, Booking, ContactInput, Coupon, StoreLocation } from '../shared/types';

// Hàm hỗ trợ loại bỏ dấu tiếng Việt để tìm kiếm tối ưu
const removeAccents = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
};

export const DataService = {
  // --- READ API (GET) ---
  
  getBanners: async (): Promise<Banner[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return BANNERS_DB;
  },

  getGameStationImages: async (): Promise<GameStationImage[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return GAME_STATION_IMAGES_DB;
  },

  getFeatures: async (): Promise<Feature[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return FEATURES_DB;
  },

  getServices: async (): Promise<Service[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return SERVICES_DB;
  },

  getStores: async (): Promise<StoreLocation[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return STORES_DB;
  },

  getProducts: async (params: ProductFilterParams = {}): Promise<PaginatedResult<Product>> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let result = [...PRODUCTS_DB]; // Clone array

    // 1. Tìm kiếm (Search)
    if (params.search && params.search.trim() !== '') {
      const normalizedQuery = removeAccents(params.search.trim());
      result = result.filter(p => {
        const normalizedName = removeAccents(p.name);
        const normalizedBrand = p.brand ? removeAccents(p.brand) : '';
        const normalizedTags = p.tags ? p.tags.map(t => removeAccents(t)).join(' ') : '';
        return normalizedName.includes(normalizedQuery) || 
               normalizedBrand.includes(normalizedQuery) ||
               normalizedTags.includes(normalizedQuery);
      });
    }

    // 2. Lọc theo Category
    if (params.categories && params.categories.length > 0) {
      result = result.filter(p => params.categories!.includes(p.category));
    }

    // 3. Lọc theo Brand
    if (params.brands && params.brands.length > 0) {
      result = result.filter(p => p.brand && params.brands!.includes(p.brand));
    }

    // 4. Lọc theo Khoảng giá
    if (params.maxPrice !== undefined) {
      result = result.filter(p => p.price <= params.maxPrice!);
    }

    // 5. Sắp xếp
    if (params.sort) {
      switch (params.sort) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'popular':
          result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
          break;
        case 'newest':
          result.sort((a, b) => b._id.localeCompare(a._id)); 
          break;
      }
    }

    // 6. Phân trang
    const page = params.page || 1;
    const limit = params.limit || 10;
    const totalItems = result.length;
    const totalPages = Math.ceil(totalItems / limit);
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedData = result.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      total: totalItems,
      page: page,
      totalPages: totalPages
    };
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return PRODUCTS_DB.find(p => p._id === id);
  },

  getRelatedProducts: async (category: string, currentId: string): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return PRODUCTS_DB
      .filter(p => p.category === category && p._id !== currentId)
      .slice(0, 4); 
  },

  getCrossSellProducts: async (): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Lấy các sản phẩm có giá rẻ (< 100k) hoặc thuộc category ACCESSORIES để làm sản phẩm mua kèm
    return PRODUCTS_DB.filter(p => p.price < 100000 || p.category === 'ACCESSORIES').slice(0, 4);
  },

  getCategories: async (): Promise<Category[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return CATEGORIES_DB;
  },
  
  getBrands: async (): Promise<Brand[]> => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return BRANDS_DB;
  },

  getArticles: async (): Promise<NewsArticle[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return ARTICLES_DB;
  },

  checkCoupon: async (code: string): Promise<{success: boolean, data?: Coupon, message?: string}> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const coupon = COUPONS_DB.find(c => c.code === code);
    if (coupon) {
        return { success: true, data: coupon, message: "Áp dụng mã giảm giá thành công!" };
    }
    return { success: false, message: "Mã giảm giá không tồn tại hoặc đã hết hạn." };
  },

  // --- USER DATA APIs ---

  getUserOrders: async (userId: string): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return ORDERS_DB.filter(o => o.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getUserBookings: async (userId: string): Promise<Booking[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return BOOKINGS_DB.filter(b => b.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // --- WRITE API (POST) ---

  createOrder: async (input: OrderInput): Promise<{success: boolean, message: string, orderId: string}> => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing
    
    // Create new Order object
    const newOrder: Order = {
        _id: `ORD-${Date.now().toString().slice(-6)}`,
        ...input,
        createdAt: new Date().toISOString(),
        status: 'PENDING',
        paymentStatus: 'UNPAID'
    };
    
    // Save to Mock DB
    ORDERS_DB.push(newOrder);
    
    return {
      success: true,
      message: "Đặt hàng thành công! Chúng tôi sẽ liên hệ sớm.",
      orderId: newOrder._id
    };
  },

  submitBooking: async (input: BookingInput): Promise<{success: boolean, message: string, bookingId: string}> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find service to get price (mock logic)
    const service = SERVICES_DB.find(s => s._id === input.serviceId);
    const pricePerHour = service ? service.pricePerHour : 0;
    const totalPrice = pricePerHour * input.duration;

    const newBooking: Booking = {
        _id: `BKG-${Date.now().toString().slice(-6)}`,
        ...input,
        createdAt: new Date().toISOString(),
        status: 'PENDING',
        totalPrice: totalPrice,
        serviceName: service?.name
    };

    // Save to Mock DB
    BOOKINGS_DB.push(newBooking);

    return {
      success: true,
      message: "Đặt lịch thành công! Vui lòng đến đúng giờ.",
      bookingId: newBooking._id
    };
  },

  submitReview: async (productId: string, userId: string, rating: number, content: string): Promise<{success: boolean, message: string}> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const productIndex = PRODUCTS_DB.findIndex(p => p._id === productId);
    if (productIndex === -1) return { success: false, message: "Sản phẩm không tồn tại" };

    const user = USERS_DB.find(u => u._id === userId);
    const userName = user ? user.name : "Khách";

    const newReview = {
        id: `r${Date.now()}`,
        user: userName,
        rating: rating,
        date: "Vừa xong",
        content: content,
        avatar: user?.avatar
    };

    // Add to mock product
    if (!PRODUCTS_DB[productIndex].reviews) {
        PRODUCTS_DB[productIndex].reviews = [];
    }
    PRODUCTS_DB[productIndex].reviews!.unshift(newReview);
    
    // Update count/rating mock (simple logic)
    PRODUCTS_DB[productIndex].reviewCount = (PRODUCTS_DB[productIndex].reviewCount || 0) + 1;

    return { success: true, message: "Đánh giá thành công!" };
  },

  submitContact: async (input: ContactInput): Promise<{success: boolean, message: string}> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    CONTACT_MESSAGES_DB.push(input);
    
    return { 
        success: true, 
        message: "Tin nhắn của bạn đã được gửi. Chúng tôi sẽ phản hồi sớm nhất!" 
    };
  },

  subscribeNewsletter: async (input: NewsletterInput): Promise<{success: boolean}> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    console.log("Subscribed email:", input.email);
    return { success: true };
  }
};

export const AuthService = {
  login: async (email: string, password?: string): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Sim network
    
    const user = USERS_DB.find(u => u.email === email);
    
    if (user) {
        // Trong app thật: so sánh hash password (ví dụ: bcrypt.compare)
        // Trong mock này: so sánh string trực tiếp
        if (user.password && user.password === password) {
             // Return user object without the password field for security
             const { password: _, ...userWithoutPassword } = user; 
             return { success: true, user: userWithoutPassword as User };
        }
        return { success: false, message: "Mật khẩu không đúng." };
    }

    return { success: false, message: "Tài khoản không tồn tại. Vui lòng đăng ký." };
  },

  // Added Register Function with password
  register: async (email: string, name: string, password?: string): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check duplicate
    if (USERS_DB.some(u => u.email === email)) {
        return { success: false, message: "Email này đã được đăng ký." };
    }

    // Create new user mock
    const newUser: User = {
        _id: 'u_' + Date.now(),
        email,
        name,
        role: 'USER',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2b8cee&color=fff`,
        password: password // Store password in mock DB
    };

    // Add to mock DB (in-memory only)
    USERS_DB.push(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return { success: true, user: userWithoutPassword as User };
  },

  // NEW: Forgot Password - Step 1: Request Code
  forgotPassword: async (email: string): Promise<{success: boolean, message: string}> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!email.includes('@') || email.length < 5) {
        return { success: false, message: "Email không hợp lệ." };
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save to mock storage
    OTP_STORE[email] = otp;

    // In a real app, this OTP is sent via Email/SMS.
    // Here we return it in the message for demo purposes.
    return { 
        success: true, 
        message: `Mã xác nhận của bạn là: ${otp}` 
    };
  },

  // NEW: Forgot Password - Step 2: Verify OTP
  verifyOtp: async (email: string, otp: string): Promise<{success: boolean, message: string}> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const storedOtp = OTP_STORE[email];
    if (storedOtp && storedOtp === otp) {
        return { success: true, message: "Mã xác thực hợp lệ." };
    }
    return { success: false, message: "Mã xác thực không đúng hoặc đã hết hạn." };
  },

  // NEW: Forgot Password - Step 3: Reset Password
  resetPassword: async (email: string, otp: string, newPassword: string): Promise<{success: boolean, message: string}> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Re-verify OTP for security
    const storedOtp = OTP_STORE[email];
    if (!storedOtp || storedOtp !== otp) {
        return { success: false, message: "Phiên xác thực không hợp lệ." };
    }

    // Find User
    const userIndex = USERS_DB.findIndex(u => u.email === email);
    if (userIndex === -1) {
        return { success: false, message: "Người dùng không tồn tại." };
    }

    // Update Password
    USERS_DB[userIndex].password = newPassword;

    // Clear OTP
    delete OTP_STORE[email];

    return { success: true, message: "Đổi mật khẩu thành công. Vui lòng đăng nhập lại." };
  },

  updateProfile: async (userId: string, data: Partial<User>): Promise<{success: boolean, user?: User, message?: string}> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const userIndex = USERS_DB.findIndex(u => u._id === userId);
    if (userIndex === -1) return { success: false, message: "User not found" };

    // Update fields
    const updatedUser = { ...USERS_DB[userIndex], ...data };
    USERS_DB[userIndex] = updatedUser;

    // Return without password
    const { password: _, ...userWithoutPassword } = updatedUser;
    return { success: true, user: userWithoutPassword as User, message: "Cập nhật thành công!" };
  },

  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};