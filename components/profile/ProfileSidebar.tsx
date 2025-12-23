import React from 'react';
import { User } from '../../shared/types';

interface ProfileSidebarProps {
  user: User;
  activePage: 'profile' | 'orders' | 'bookings' | 'wishlist' | 'address-book';
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ user, activePage, onNavigate, onLogout }) => {
  
  const menuItems = [
    { id: 'profile', label: 'Thông tin tài khoản', icon: 'person' },
    { id: 'orders', label: 'Đơn hàng của tôi', icon: 'shopping_bag' },
    { id: 'bookings', label: 'Lịch chơi game', icon: 'calendar_month' },
    { id: 'wishlist', label: 'Sản phẩm yêu thích', icon: 'favorite' },
    { id: 'address-book', label: 'Sổ địa chỉ', icon: 'location_on' }, // Added
  ];

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white dark:bg-[#1a2632] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
        
        {/* User Info Card */}
        <div className="flex items-center gap-3 mb-6 px-2">
          <div 
            className="size-12 rounded-full bg-gray-200 dark:bg-gray-700 bg-cover bg-center" 
            style={{ backgroundImage: `url("${user.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFP0tlVEVnnQhPZx77BlJD80tqcnJjmrkPALbn9Pp90RwnNhviQC807TYiIo_Arn_1SxgjiP3si4M_FjIuIXRvMfK5SpvYYXbbfiojQxka47BbsnDA1D5O3YK5crgf59wsF33TW4G8i-LrUFPvA54AjLKbBc19fZmv4vCrvufch_vT3aRB7lR2rcYB9kCqM3QNVboXMzClV3bkqoDa5mHTH0akn3WKg_QqbtU4Q9wfcvQxPMLypovmwYAkz9SL8ejRKJKRH8o9Fw'}")` }}
          ></div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Xin chào,</p>
            <p className="font-bold text-[#111418] dark:text-white line-clamp-1">{user.name}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group w-full text-left font-medium ${
                  isActive 
                    ? 'bg-primary/10 text-primary dark:text-primary font-bold' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span 
                  className={`material-symbols-outlined text-[20px] ${isActive ? 'fill-1' : ''}`} 
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}

          <div className="my-2 border-t border-gray-100 dark:border-gray-700"></div>
          
          <button 
            onClick={onLogout} 
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium w-full text-left"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="text-sm">Đăng xuất</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default ProfileSidebar;