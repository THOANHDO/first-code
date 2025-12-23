import React, { useEffect, useState, useRef } from 'react';
import { User, Order, Booking } from '../shared/types';
import { DataService, AuthService } from '../backend/api';
import ProfileSidebar from '../components/profile/ProfileSidebar';

interface ProfilePageProps {
  user: User;
  onNavigateHome: () => void;
  onNavigateOrders: () => void;
  onNavigateBookings: () => void;
  onNavigateWishlist: () => void;
  onNavigateAddressBook: () => void; // Added
  onNavigateBookingDetail?: (id: string) => void;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onNavigateHome, onNavigateOrders, onNavigateBookings, onNavigateWishlist, onNavigateAddressBook, onNavigateBookingDetail, onLogout }) => {
  // Form State
  const [formData, setFormData] = useState({
    name: user.name || '',
    gamerTag: user.gamerTag || '',
    email: user.email || '',
    phone: user.phone || '',
    birthDate: user.birthDate || '',
    gender: user.gender || 'Khác',
    avatar: user.avatar || ''
  });

  // Preview Image State (for immediate feedback)
  const [previewAvatar, setPreviewAvatar] = useState<string>(user.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Data State
  const [recentOrder, setRecentOrder] = useState<Order | null>(null);
  const [upcomingBooking, setUpcomingBooking] = useState<Booking | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [orders, bookings] = await Promise.all([
        DataService.getUserOrders(user._id),
        DataService.getUserBookings(user._id)
      ]);
      
      // Filter out pure booking orders for the recent order display
      const productOrders = orders.filter(order => 
        order.items.some(item => item.type !== 'SERVICE')
      );

      if (productOrders.length > 0) setRecentOrder(productOrders[0]);
      if (bookings.length > 0) setUpcomingBooking(bookings[0]);
    };
    fetchData();
  }, [user._id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (val: string) => {
    setFormData(prev => ({ ...prev, gender: val as any }));
  };

  // Handle File Upload
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 2MB for example)
      if (file.size > 2 * 1024 * 1024) {
        alert("File ảnh quá lớn. Vui lòng chọn ảnh dưới 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewAvatar(result);
        setFormData(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
        const res = await AuthService.updateProfile(user._id, formData);
        if (res.success) {
            alert(res.message);
        } else {
            alert(res.message);
        }
    } catch (e) {
        alert("Lỗi kết nối.");
    } finally {
        setSaving(false);
    }
  };

  // Navigation Handler for Sidebar
  const handleSidebarNavigate = (page: string) => {
    if (page === 'orders') onNavigateOrders();
    if (page === 'bookings') onNavigateBookings();
    if (page === 'wishlist') onNavigateWishlist();
    if (page === 'address-book') onNavigateAddressBook();
  };

  // Helper date format
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  // Get first product to display (ignore services)
  const getDisplayProduct = (order: Order) => {
      const prod = order.items.find(i => i.type !== 'SERVICE');
      return prod || order.items[0]; // Fallback
  };

  return (
    <div className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-10 py-6 lg:py-10 font-sans">
      
      {/* Main Layout using Flexbox */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Common Sidebar */}
        <ProfileSidebar 
            user={user} 
            activePage="profile" 
            onNavigate={handleSidebarNavigate} 
            onLogout={onLogout} 
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap gap-2 mb-2 text-sm">
            <button onClick={onNavigateHome} className="text-[#617589] hover:text-primary transition-colors">Trang chủ</button>
            <span className="text-[#617589]">/</span>
            <span className="text-[#617589]">Tài khoản</span>
            <span className="text-[#617589]">/</span>
            <span className="text-[#111418] font-medium dark:text-white">Hồ sơ của tôi</span>
          </nav>

          {/* Profile Header Card */}
          <div className="bg-white dark:bg-[#1a2632] rounded-xl p-6 shadow-sm border border-[#e5e7eb] dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex items-center gap-5">
                <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                  <div 
                    className="bg-center bg-no-repeat bg-cover rounded-full size-24 border-4 border-white dark:border-gray-600 shadow-md transition-opacity group-hover:opacity-90" 
                    style={{ backgroundImage: `url("${previewAvatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFP0tlVEVnnQhPZx77BlJD80tqcnJjmrkPALbn9Pp90RwnNhviQC807TYiIo_Arn_1SxgjiP3si4M_FjIuIXRvMfK5SpvYYXbbfiojQxka47BbsnDA1D5O3YK5crgf59wsF33TW4G8i-LrUFPvA54AjLKbBc19fZmv4vCrvufch_vT3aRB7lR2rcYB9kCqM3QNVboXMzClV3bkqoDa5mHTH0akn3WKg_QqbtU4Q9wfcvQxPMLypovmwYAkz9SL8ejRKJKRH8o9Fw'}")` }}
                  ></div>
                  <button className="absolute bottom-0 right-0 bg-[#f0f2f4] hover:bg-white dark:bg-gray-700 dark:hover:bg-gray-600 border border-[#d1d5db] dark:border-gray-600 text-[#111418] dark:text-white p-1.5 rounded-full shadow-sm transition-colors cursor-pointer" title="Đổi ảnh">
                    <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                  </button>
                  {/* Hidden File Input */}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-[#111418] dark:text-white text-2xl font-bold tracking-tight">Hồ sơ người dùng</h1>
                  <p className="text-[#617589] dark:text-gray-400 text-sm mt-1">Quản lý thông tin cá nhân và bảo mật</p>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        Gamer Tag: {formData.gamerTag || 'Chưa đặt'}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        <span className="material-symbols-outlined text-[14px] mr-1 filled text-yellow-600 dark:text-yellow-400" style={{fontVariationSettings: "'FILL' 1"}}>stars</span>
                        {user.points || 0} Điểm thưởng
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Form */}
          <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e5e7eb] dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
              <h2 className="text-[#111418] dark:text-white text-lg font-bold">Thông tin cá nhân</h2>
              <span className="text-xs text-[#617589] dark:text-gray-400 bg-[#f0f2f4] dark:bg-gray-700 px-2 py-1 rounded">Cập nhật lần cuối: Vừa xong</span>
            </div>
            <div className="p-6">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#111418] dark:text-gray-300 text-sm font-semibold">Họ và tên</label>
                  <div className="group flex items-center w-full rounded-lg border border-[#dce0e5] dark:border-gray-600 bg-white dark:bg-gray-800 px-3 h-11 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <input 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-transparent border-none p-0 text-sm text-[#111418] dark:text-white focus:ring-0 outline-none placeholder:text-[#9ca3af]" 
                        placeholder="Nhập họ và tên" 
                        type="text"
                    />
                  </div>
                </div>

                {/* Gamer Tag */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#111418] dark:text-gray-300 text-sm font-semibold">Biệt danh (Gamer Tag)</label>
                  <div className="group flex items-center w-full rounded-lg border border-[#dce0e5] dark:border-gray-600 bg-white dark:bg-gray-800 px-3 h-11 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <span className="material-symbols-outlined text-[#9ca3af] group-focus-within:text-primary mr-2 text-[20px] transition-colors">sports_esports</span>
                    <input 
                        name="gamerTag"
                        value={formData.gamerTag}
                        onChange={handleChange}
                        className="w-full bg-transparent border-none p-0 text-sm text-[#111418] dark:text-white focus:ring-0 outline-none placeholder:text-[#9ca3af]" 
                        placeholder="Nhập biệt danh" 
                        type="text"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#111418] dark:text-gray-300 text-sm font-semibold">Email</label>
                  <div className="flex items-center w-full rounded-lg border border-[#dce0e5] dark:border-gray-600 bg-[#f9fafb] dark:bg-gray-900 px-3 h-11 cursor-not-allowed">
                    <span className="material-symbols-outlined text-[#9ca3af] mr-2 text-[20px]">mail</span>
                    <input className="w-full bg-transparent border-none p-0 text-sm text-[#6b7280] dark:text-gray-500 focus:ring-0 outline-none" disabled type="email" value={formData.email}/>
                    <span className="text-xs text-green-600 font-medium ml-2 whitespace-nowrap flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] filled" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                        Đã xác thực
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#111418] dark:text-gray-300 text-sm font-semibold">Số điện thoại</label>
                  <div className="group flex items-center w-full rounded-lg border border-[#dce0e5] dark:border-gray-600 bg-white dark:bg-gray-800 px-3 h-11 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <span className="material-symbols-outlined text-[#9ca3af] group-focus-within:text-primary mr-2 text-[20px] transition-colors">call</span>
                    <input 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-transparent border-none p-0 text-sm text-[#111418] dark:text-white focus:ring-0 outline-none placeholder:text-[#9ca3af]" 
                        type="tel"
                        placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>

                {/* Birth Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#111418] dark:text-gray-300 text-sm font-semibold">Ngày sinh</label>
                  <div className="group flex items-center w-full rounded-lg border border-[#dce0e5] dark:border-gray-600 bg-white dark:bg-gray-800 px-3 h-11 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <span className="material-symbols-outlined text-[#9ca3af] group-focus-within:text-primary mr-2 text-[20px] transition-colors">cake</span>
                    <input 
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="w-full bg-transparent border-none p-0 text-sm text-[#111418] dark:text-white focus:ring-0 outline-none" 
                        type="date"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#111418] dark:text-gray-300 text-sm font-semibold">Giới tính</label>
                  <div className="flex gap-4 h-11 items-center">
                    {['Nam', 'Nữ', 'Khác'].map(option => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                            <input 
                                name="gender" 
                                type="radio" 
                                checked={formData.gender === option}
                                onChange={() => handleGenderChange(option)}
                                className="text-primary focus:ring-primary border-gray-300 focus:ring-2"
                            />
                            <span className="text-sm text-[#111418] dark:text-white">{option}</span>
                        </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-[#f0f2f4] dark:border-gray-700">
                  <button className="px-5 py-2.5 rounded-lg text-sm font-bold text-[#617589] dark:text-gray-400 bg-transparent hover:bg-[#f0f2f4] dark:hover:bg-gray-700 transition-colors" type="button">
                    Hủy bỏ
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-primary hover:bg-blue-600 shadow-sm shadow-blue-200 dark:shadow-none transition-colors flex items-center gap-2 disabled:opacity-70" 
                    type="button"
                  >
                    {saving ? (
                        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-[18px]">save</span>
                            Lưu thay đổi
                        </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Recent Activity Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Recent Order */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-700 p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#111418] dark:text-white">Đơn hàng gần đây</h3>
                <button onClick={onNavigateOrders} className="text-primary text-xs font-bold hover:underline">Xem tất cả</button>
              </div>
              {recentOrder ? (() => {
                  const displayProd = getDisplayProduct(recentOrder);
                  // Double check we have a displayable product
                  if (!displayProd) return <p className="text-sm text-gray-400 italic">Chưa có đơn hàng sản phẩm nào.</p>;
                  
                  return (
                    <div className="flex gap-4 items-center">
                      <div className="size-16 rounded-lg bg-[#f0f2f4] dark:bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden">
                          <img src={displayProd.image} alt={displayProd.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col flex-1">
                          <p className="text-sm font-bold text-[#111418] dark:text-white line-clamp-1">
                              {displayProd.name} 
                              {recentOrder.items.filter(i => i.type !== 'SERVICE').length > 1 && ` + ${recentOrder.items.filter(i => i.type !== 'SERVICE').length - 1} khác`}
                          </p>
                          <p className="text-xs text-[#617589] dark:text-gray-400">ĐH #{recentOrder._id} • {formatDate(recentOrder.createdAt)}</p>
                          <span className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 w-fit">{recentOrder.status === 'COMPLETED' ? 'Giao hàng thành công' : 'Đang xử lý'}</span>
                      </div>
                    </div>
                  );
              })() : (
                  <p className="text-sm text-gray-400 italic">Chưa có đơn hàng nào.</p>
              )}
            </div>

            {/* Upcoming Booking */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-700 p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#111418] dark:text-white">Lịch chơi sắp tới</h3>
                <button 
                    onClick={() => upcomingBooking && onNavigateBookingDetail && onNavigateBookingDetail(upcomingBooking._id)}
                    className="text-primary text-xs font-bold hover:underline"
                >
                    Quản lý
                </button>
              </div>
              {upcomingBooking ? (
                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-4 text-white relative overflow-hidden group cursor-pointer" onClick={() => onNavigateBookingDetail && onNavigateBookingDetail(upcomingBooking._id)}>
                    <div className="absolute right-0 top-0 h-full w-1/2 bg-white/5 skew-x-12 transform origin-bottom-right group-hover:bg-white/10 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-primary text-lg">videogame_asset</span>
                            <span className="text-xs font-medium uppercase tracking-wider opacity-80">{upcomingBooking.stationName}</span>
                        </div>
                        <p className="text-lg font-bold">{formatDate(upcomingBooking.date)}</p>
                        <p className="text-sm opacity-80">{upcomingBooking.time} - {upcomingBooking.endTime} ({upcomingBooking.duration} giờ)</p>
                    </div>
                  </div>
              ) : (
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-500">Bạn chưa có lịch đặt nào.</p>
                  </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;