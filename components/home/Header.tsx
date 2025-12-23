import React, { useState, useEffect } from 'react';
import { User } from '../../shared/types';
import { AuthService } from '../../backend/api';

interface HeaderProps {
  onNavigate: (page: string) => void;
  onSearch: (query: string) => void;
  currentPage: string;
  cartCount?: number;
  user?: User | null; // Added
  onLogout?: () => void; // Added
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onSearch, currentPage, cartCount = 0, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [animateCart, setAnimateCart] = useState(false);

  // Trigger animation when cartCount changes
  useEffect(() => {
    if (cartCount > 0) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 500); // Increased duration for shake
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const handleSearchSubmit = () => {
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleLogoutClick = async () => {
    await AuthService.logout();
    if (onLogout) onLogout();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <style>{`
        @keyframes cart-bounce {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.2) rotate(-5deg); }
          50% { transform: scale(1.3) rotate(5deg); }
          75% { transform: scale(1.1) rotate(-3deg); }
        }
        .animate-cart-bounce {
          animation: cart-bounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
      <div className="flex items-center justify-between px-4 py-3 md:px-8 lg:px-12 w-full max-w-[1440px] mx-auto gap-4">
        
        {/* Logo */}
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="flex items-center gap-2 group">
          <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined">sports_esports</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-800 text-xl font-extrabold tracking-tight leading-none">GameStore</h1>
            <span className="text-xs text-slate-500 font-medium tracking-wide">Gaming & Hobby</span>
          </div>
        </a>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-12">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer" onClick={handleSearchSubmit}>
              <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors hover:text-primary">search</span>
            </div>
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-slate-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 sm:text-sm"
              placeholder="Tìm kiếm sản phẩm, game, phụ kiện..."
            />
          </div>
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="hidden lg:flex items-center gap-8">
            <button 
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium transition-colors relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:transition-all hover:after:w-full ${currentPage === 'home' ? 'text-primary font-semibold after:w-full' : 'text-slate-500 hover:text-primary'}`}
            >
              Trang chủ
            </button>
            <button 
              onClick={() => onNavigate('products')}
              className={`text-sm font-medium transition-colors relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:transition-all hover:after:w-full ${currentPage === 'products' ? 'text-primary font-semibold after:w-full' : 'text-slate-500 hover:text-primary'}`}
            >
              Sản phẩm
            </button>
            <button 
              onClick={() => onNavigate('contact')}
              className={`text-sm font-medium transition-colors relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:transition-all hover:after:w-full ${currentPage === 'contact' ? 'text-primary font-semibold after:w-full' : 'text-slate-500 hover:text-primary'}`}
            >
              Liên hệ
            </button>
          </nav>
          
          <div className="h-6 w-px bg-gray-200 hidden lg:block"></div>
          
          <div className="flex items-center gap-2">
            <button 
                onClick={() => onNavigate('booking')}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-sm rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_clock</span>
              <span>Đặt máy</span>
            </button>
            
            {/* Cart Button with Animation - Added ID for targeting */}
            <button 
              id="header-cart-btn"
              onClick={() => onNavigate('cart')}
              className={`relative p-2 rounded-lg transition-colors group ${currentPage === 'cart' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:text-primary hover:bg-gray-100'}`}
            >
              <span className={`material-symbols-outlined transition-transform ${animateCart ? 'text-primary animate-cart-bounce' : ''}`}>shopping_cart</span>
              {cartCount > 0 && (
                <span className={`absolute top-1 right-1 flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold shadow-sm transition-all duration-300 ${animateCart ? 'scale-125' : 'scale-100'}`}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Auth Button Logic */}
            {user ? (
               <div className="relative group">
                 <button className="flex items-center gap-2 p-1.5 pl-2 rounded-lg hover:bg-gray-100 transition-colors">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">{user.name.charAt(0)}</div>
                    )}
                    <span className="text-sm font-semibold text-slate-700 hidden lg:block max-w-[100px] truncate">{user.name}</span>
                 </button>
                 {/* Simple Dropdown for Logout */}
                 {/* Modified to fix hover gap: Wrapper div with pt-2 handles spacing while maintaining hover state */}
                 <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block animate-fade-in-up">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-500">Đăng nhập là</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                      </div>
                      <button onClick={handleLogoutClick} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Đăng xuất
                      </button>
                    </div>
                 </div>
               </div>
            ) : (
              <button 
                onClick={() => onNavigate('login')}
                className="p-2 text-slate-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined">person</span>
                <span className="hidden lg:inline text-sm font-bold">Đăng nhập</span>
              </button>
            )}

            <button 
              className="lg:hidden p-2 text-slate-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center" onClick={handleSearchSubmit}>
            <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
          </div>
          <input 
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown} 
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="Tìm kiếm..."
          />
        </div>
      </div>
      
      {/* Mobile Menu Dropdown (Simplified) */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg py-4 px-4 flex flex-col gap-4 animate-fade-in-up">
           <button onClick={() => {onNavigate('home'); setIsMenuOpen(false);}} className="text-left text-slate-700 font-medium py-2 border-b border-gray-50">Trang chủ</button>
           <button onClick={() => {onNavigate('products'); setIsMenuOpen(false);}} className="text-left text-slate-700 font-medium py-2 border-b border-gray-50">Sản phẩm</button>
           <button onClick={() => {onNavigate('contact'); setIsMenuOpen(false);}} className="text-left text-slate-700 font-medium py-2 border-b border-gray-50">Liên hệ</button>
           {!user && (
              <button onClick={() => {onNavigate('login'); setIsMenuOpen(false);}} className="text-left text-primary font-bold py-2 border-b border-gray-50">Đăng nhập / Đăng ký</button>
           )}
        </div>
      )}
    </header>
  );
};

export default Header;