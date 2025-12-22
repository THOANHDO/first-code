import React, { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ContactPage from './pages/ContactPage'; 
import StoresPage from './pages/StoresPage'; // NEW IMPORT
import { CartItem, User } from './shared/types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Tính tổng số lượng hiển thị trên badge
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
    // Navigate to booking page (Future)
    setCurrentPage('booking');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage('products');
    window.scrollTo(0, 0);
  };

  const handleAddToCart = (item: CartItem) => {
    // RULE: Check login before adding to cart
    if (!currentUser) {
      alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
      setCurrentPage('login');
      return;
    }

    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(
        i => i.productId === item.productId && i.selectedColor === item.selectedColor
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
    setCartItems(prev => prev.filter(item => 
      !(item.productId === productId && item.selectedColor === selectedColor)
    ));
  };

  const handleCheckout = () => {
    setCurrentPage('checkout');
    window.scrollTo(0, 0);
  };

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('home'); // Redirect to home after login
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCartItems([]); // Optional: clear cart on logout
    setCurrentPage('home');
  };

  // Render Auth Pages independently
  if (currentPage === 'login') {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess} 
        onNavigateHome={() => handleNavigate('home')} 
        onNavigateForgotPassword={() => handleNavigate('forgot-password')}
      />
    );
  }

  if (currentPage === 'forgot-password') {
    return (
      <ForgotPasswordPage
        onNavigateLogin={() => handleNavigate('login')}
        onNavigateHome={() => handleNavigate('home')}
      />
    );
  }

  return (
    <MainLayout 
      onNavigate={handleNavigate} 
      onSearch={handleSearch} 
      currentPage={currentPage} 
      cartCount={cartCount} 
      user={currentUser}
      onLogout={handleLogout}
    >
      {currentPage === 'home' && (
        <HomePage 
          onNavigateProduct={handleNavigateProduct} 
          onNavigateProducts={() => handleNavigate('products')}
        />
      )}
      {currentPage === 'products' && (
        <ProductsPage 
          onNavigateHome={() => handleNavigate('home')} 
          onNavigateProduct={handleNavigateProduct}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
        />
      )}
      {currentPage === 'product-detail' && currentProductId && (
        <ProductDetailPage 
          productId={currentProductId}
          onNavigateHome={() => handleNavigate('home')}
          onNavigateProducts={() => handleNavigate('products')}
          onNavigateProduct={handleNavigateProduct}
          onNavigateBooking={handleNavigateBooking}
          onAddToCart={handleAddToCart} 
        />
      )}
      {currentPage === 'cart' && (
        <CartPage 
          items={cartItems}
          onNavigateHome={() => handleNavigate('home')}
          onNavigateProducts={() => handleNavigate('products')}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
          onAddToCart={handleAddToCart}
          onCheckout={handleCheckout}
        />
      )}
      {currentPage === 'contact' && (
        <ContactPage 
          onNavigateStores={() => handleNavigate('stores')}
          onNavigateBooking={() => handleNavigate('booking')}
        />
      )}
      {currentPage === 'stores' && (
        <StoresPage 
          onNavigateHome={() => handleNavigate('home')}
          onNavigateBooking={() => handleNavigate('booking')}
          onNavigateContact={() => handleNavigate('contact')}
        />
      )}
      {currentPage === 'checkout' && (
        <div className="flex-grow flex items-center justify-center py-20">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Trang Thanh Toán (Checkout)</h2>
                <p className="text-gray-500">Đang được phát triển...</p>
                <button onClick={() => handleNavigate('cart')} className="mt-4 text-primary hover:underline">Quay lại giỏ hàng</button>
            </div>
        </div>
      )}
      {currentPage === 'booking' && (
        <div className="flex-grow flex items-center justify-center py-20">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Trang Đặt Lịch (Booking)</h2>
                <p className="text-gray-500">Đang được phát triển...</p>
                 <button onClick={() => handleNavigate('home')} className="mt-4 text-primary hover:underline">Quay lại trang chủ</button>
            </div>
        </div>
      )}
    </MainLayout>
  );
};

export default App;