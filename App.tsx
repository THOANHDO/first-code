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
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import GameSchedulePage from './pages/GameSchedulePage';
import WishlistPage from './pages/WishlistPage';
import AddressBookPage from './pages/AddressBookPage';
import { CartItem, User } from './shared/types';
import { DataService } from './backend/api';

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
    setCartItems(prev => {
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
        return { ...item, quantity: Math.min(Math.max(1, newQuantity), item.maxStock) };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (productId: string, selectedColor: string | undefined) => {
    setCartItems(prev => prev.filter(item => {
        if (item.type === 'SERVICE') {
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

  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const handleCheckoutRequest = () => {
    if (currentUser) {
      handleNavigate('checkout');
    } else {
      alert("Vui lòng đăng nhập để tiếp tục thanh toán.");
      handleNavigate('login');
    }
  };

  // Wishlist Handler
  const handleToggleWishlist = async (productId: string) => {
    if (!currentUser) {
        alert("Vui lòng đăng nhập để lưu sản phẩm yêu thích.");
        handleNavigate('login');
        return;
    }
    
    // Optimistic UI Update locally first (optional but good for UX)
    // Here we rely on API response to sync state properly
    const res = await DataService.toggleWishlist(currentUser._id, productId);
    if (res.success && res.wishlist) {
        setCurrentUser({ ...currentUser, wishlist: res.wishlist });
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
      {currentPage === 'home' && <HomePage onNavigateProduct={handleNavigateProduct} onNavigateProducts={() => handleNavigate('products')} user={currentUser} onToggleWishlist={handleToggleWishlist} />}
      {currentPage === 'products' && <ProductsPage onNavigateHome={() => handleNavigate('home')} onNavigateProduct={handleNavigateProduct} searchQuery={searchQuery} onClearSearch={() => setSearchQuery('')} user={currentUser} onToggleWishlist={handleToggleWishlist} />}
      {currentPage === 'product-detail' && currentProductId && <ProductDetailPage productId={currentProductId} onNavigateHome={() => handleNavigate('home')} onNavigateProducts={() => handleNavigate('products')} onNavigateProduct={handleNavigateProduct} onNavigateBooking={handleNavigateBooking} onAddToCart={handleAddToCart} user={currentUser} onToggleWishlist={handleToggleWishlist} />}
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
      {currentPage === 'checkout' && (
        <CheckoutPage 
            items={cartItems} 
            user={currentUser} 
            onNavigateHome={() => handleNavigate('home')} 
            onNavigateCart={() => handleNavigate('cart')} 
            onOrderSuccess={handleCheckoutSuccess} 
            onNavigateOrders={() => handleNavigate('orders')}
            onNavigateBookings={() => handleNavigate('bookings')}
        />
      )}
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
      {currentPage === 'profile' && currentUser && (
        <ProfilePage 
            user={currentUser} 
            onNavigateHome={() => handleNavigate('home')}
            onNavigateOrders={() => handleNavigate('orders')}
            onNavigateBookings={() => handleNavigate('bookings')}
            onNavigateWishlist={() => handleNavigate('wishlist')}
            onNavigateAddressBook={() => handleNavigate('address-book')}
            onNavigateBookingDetail={handleNavigateBookingDetail}
            onLogout={handleLogout}
        />
      )}
      {currentPage === 'orders' && currentUser && (
        <OrdersPage 
            user={currentUser} 
            onNavigateHome={() => handleNavigate('home')}
            onNavigateProfile={() => handleNavigate('profile')}
            onNavigateBookings={() => handleNavigate('bookings')}
            onNavigateWishlist={() => handleNavigate('wishlist')}
            onNavigateAddressBook={() => handleNavigate('address-book')}
            onNavigateContact={() => handleNavigate('contact')}
            onNavigateOrderDetail={(id) => alert("Trang chi tiết đơn hàng " + id + " sẽ được phát triển sau.")} 
            onLogout={handleLogout}
        />
      )}
      {currentPage === 'bookings' && currentUser && (
        <GameSchedulePage
            user={currentUser}
            onNavigateHome={() => handleNavigate('home')}
            onNavigateProfile={() => handleNavigate('profile')}
            onNavigateOrders={() => handleNavigate('orders')}
            onNavigateWishlist={() => handleNavigate('wishlist')}
            onNavigateAddressBook={() => handleNavigate('address-book')}
            onNavigateBooking={handleNavigateBooking}
            onNavigateBookingDetail={handleNavigateBookingDetail}
            onNavigateProduct={handleNavigateProduct}
            onNavigateProducts={() => handleNavigate('products')}
            onLogout={handleLogout}
        />
      )}
      {currentPage === 'wishlist' && currentUser && (
        <WishlistPage
            user={currentUser}
            onNavigateHome={() => handleNavigate('home')}
            onNavigateProfile={() => handleNavigate('profile')}
            onNavigateOrders={() => handleNavigate('orders')}
            onNavigateBookings={() => handleNavigate('bookings')}
            onNavigateAddressBook={() => handleNavigate('address-book')}
            onNavigateProduct={handleNavigateProduct}
            onNavigateProducts={() => handleNavigate('products')}
            onAddToCart={handleAddToCart}
            onLogout={handleLogout}
            onRemoveFromWishlist={handleToggleWishlist}
        />
      )}
      {currentPage === 'address-book' && currentUser && (
        <AddressBookPage
            user={currentUser}
            onNavigateHome={() => handleNavigate('home')}
            onNavigateProfile={() => handleNavigate('profile')}
            onNavigateOrders={() => handleNavigate('orders')}
            onNavigateBookings={() => handleNavigate('bookings')}
            onNavigateWishlist={() => handleNavigate('wishlist')}
            onUserUpdate={handleUserUpdate}
            onLogout={handleLogout}
        />
      )}
    </MainLayout>
  );
};

export default App;