import React, { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ContactPage from './pages/ContactPage'; 
import StoresPage from './pages/StoresPage';
import BookingPage from './pages/BookingPage';
import CheckoutPage from './pages/CheckoutPage';
import BookingDetailPage from './pages/BookingDetailPage';
import { CartItem, User } from './shared/types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (page !== 'products') {
      setSearchQuery('');
    }
    window.scrollTo(0, 0);
  };

  const handleNavigateProduct = (id: string) => {
    setCurrentProductId(id);
    setCurrentPage('product-detail');
  };

  const handleNavigateBooking = () => {
    setCurrentPage('booking');
  };

  const handleNavigateBookingDetail = (id: string) => {
    setCurrentBookingId(id);
    setCurrentPage('booking-detail');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage('products');
    window.scrollTo(0, 0);
  };

  const handleAddToCart = (item: CartItem) => {
    // Cho phép thêm vào giỏ hàng (có thể yêu cầu login sau ở bước checkout nếu muốn)
    // Nhưng theo logic hiện tại, giữ nguyên yêu cầu login nếu cần thiết
    
    setCartItems(prev => {
      // Logic riêng cho BOOKING/SERVICE: Nếu cùng Station, cùng giờ thì update, khác giờ thì thêm mới?
      // Để đơn giản: Nếu type là SERVICE, luôn thêm mới để tránh gộp giờ chơi của các ngày khác nhau
      if (item.type === 'SERVICE') {
         return [...prev, item];
      }

      const existingItemIndex = prev.findIndex(
        i => i.productId === item.productId && i.selectedColor === item.selectedColor && i.type !== 'SERVICE'
      );

      if (existingItemIndex > -1) {
        const newItems = [...prev];
        const newQuantity = newItems[existingItemIndex].quantity + item.quantity;
        newItems[existingItemIndex].quantity = Math.min(newQuantity, item.maxStock);
        return newItems;
      } else {
        return [...prev, item];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, selectedColor: string | undefined, newQuantity: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.productId === productId && item.selectedColor === selectedColor) {
        // Nếu là Service (Booking), quantity chính là số giờ, ko nên update ở cart đơn thuần mà nên có logic riêng
        // Ở đây tạm cho update số giờ
        return { ...item, quantity: Math.min(Math.max(1, newQuantity), item.maxStock) };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (productId: string, selectedColor: string | undefined) => {
    // Với Booking, productId là stationId. Cần cẩn thận nếu xóa nhầm nhiều booking cùng station.
    // Tạm thời filter theo ID (với Booking thì nên dùng thêm timestamp ID unique cho cart item, nhưng ở đây dùng productId)
    // Để fix lỗi xóa nhầm booking: Filter check thêm type
    setCartItems(prev => prev.filter(item => {
        if (item.type === 'SERVICE') {
            // Nếu là service, so sánh chính xác reference hoặc thêm field id unique. 
            // Ở mock này, ta xóa item nếu productId trùng (chấp nhận xóa hết booking cùng máy)
            return item.productId !== productId; 
        }
        return !(item.productId === productId && item.selectedColor === selectedColor);
    }));
  };

  const handleCheckoutSuccess = () => {
    setCartItems([]); // Clear cart
  };

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCartItems([]);
    setCurrentPage('home');
  };

  const handleCheckoutRequest = () => {
    if (currentUser) {
      handleNavigate('checkout');
    } else {
      alert("Vui lòng đăng nhập để tiếp tục thanh toán.");
      handleNavigate('login');
    }
  };

  // Auth Pages
  if (currentPage === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateHome={() => handleNavigate('home')} onNavigateForgotPassword={() => handleNavigate('forgot-password')} />;
  }

  if (currentPage === 'forgot-password') {
    return <ForgotPasswordPage onNavigateLogin={() => handleNavigate('login')} onNavigateHome={() => handleNavigate('home')} />;
  }

  return (
    <MainLayout onNavigate={handleNavigate} onSearch={handleSearch} currentPage={currentPage} cartCount={cartCount} user={currentUser} onLogout={handleLogout}>
      {currentPage === 'home' && <HomePage onNavigateProduct={handleNavigateProduct} onNavigateProducts={() => handleNavigate('products')} />}
      {currentPage === 'products' && <ProductsPage onNavigateHome={() => handleNavigate('home')} onNavigateProduct={handleNavigateProduct} searchQuery={searchQuery} onClearSearch={() => setSearchQuery('')} />}
      {currentPage === 'product-detail' && currentProductId && <ProductDetailPage productId={currentProductId} onNavigateHome={() => handleNavigate('home')} onNavigateProducts={() => handleNavigate('products')} onNavigateProduct={handleNavigateProduct} onNavigateBooking={handleNavigateBooking} onAddToCart={handleAddToCart} />}
      {currentPage === 'cart' && (
        <CartPage 
          items={cartItems} 
          onNavigateHome={() => handleNavigate('home')} 
          onNavigateProducts={() => handleNavigate('products')} 
          onUpdateQuantity={handleUpdateQuantity} 
          onRemoveItem={handleRemoveFromCart} 
          onAddToCart={handleAddToCart} 
          onCheckout={handleCheckoutRequest} 
        />
      )}
      {currentPage === 'contact' && <ContactPage onNavigateStores={() => handleNavigate('stores')} onNavigateBooking={handleNavigateBooking} />}
      {currentPage === 'stores' && <StoresPage onNavigateHome={() => handleNavigate('home')} onNavigateBooking={handleNavigateBooking} onNavigateContact={() => handleNavigate('contact')} />}
      {currentPage === 'checkout' && <CheckoutPage items={cartItems} user={currentUser} onNavigateHome={() => handleNavigate('home')} onNavigateCart={() => handleNavigate('cart')} onOrderSuccess={handleCheckoutSuccess} />}
      {currentPage === 'booking' && (
        <BookingPage 
            user={currentUser} 
            onNavigateHome={() => handleNavigate('home')} 
            onNavigateLogin={() => handleNavigate('login')} 
            onAddToCart={handleAddToCart}
            onNavigateCheckout={handleCheckoutRequest}
        />
      )}
      {currentPage === 'booking-detail' && currentBookingId && <BookingDetailPage bookingId={currentBookingId} onNavigateHome={() => handleNavigate('home')} />}
    </MainLayout>
  );
};

export default App;