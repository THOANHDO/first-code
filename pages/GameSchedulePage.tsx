import React, { useEffect, useState, useMemo } from 'react';
import { User, Booking, Product, Station } from '../shared/types';
import { DataService } from '../backend/api';
import ProfileSidebar from '../components/profile/ProfileSidebar';

interface GameSchedulePageProps {
  user: User;
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateOrders: () => void;
  onNavigateBooking: () => void;
  onNavigateWishlist: () => void;
  onNavigateAddressBook: () => void; // Added
  onNavigateBookingDetail?: (id: string) => void;
  onNavigateProduct?: (id: string) => void;
  onNavigateProducts?: () => void;
  onLogout: () => void;
}

const GameSchedulePage: React.FC<GameSchedulePageProps> = ({ 
    user, 
    onNavigateHome, 
    onNavigateProfile,
    onNavigateOrders,
    onNavigateBooking, 
    onNavigateWishlist,
    onNavigateAddressBook,
    onNavigateBookingDetail,
    onNavigateProduct,
    onNavigateProducts,
    onLogout 
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');
  const [hotGames, setHotGames] = useState<Product[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  // Status mapping to tab keys
  const getTabStatus = (status: string) => {
      if (status === 'CONFIRMED' || status === 'PENDING') return 'UPCOMING';
      if (status === 'COMPLETED') return 'COMPLETED';
      if (status === 'CANCELLED') return 'CANCELLED';
      return 'UPCOMING';
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [bookingData, productData, stationData] = await Promise.all([
        DataService.getUserBookings(user._id),
        DataService.getProducts({ sort: 'popular', limit: 4 }),
        DataService.getStations()
      ]);
      setBookings(bookingData);
      setHotGames(productData.data);
      setStations(stationData);
      setLoading(false);
    };
    fetchData();
  }, [user._id]);

  // Filtering Logic
  const filteredBookings = useMemo(() => {
      return bookings.filter(b => getTabStatus(b.status) === activeTab);
  }, [bookings, activeTab]);

  const handleSidebarNavigate = (page: string) => {
    if (page === 'profile') onNavigateProfile();
    if (page === 'orders') onNavigateOrders();
    if (page === 'wishlist') onNavigateWishlist();
    if (page === 'address-book') onNavigateAddressBook();
  };

  const formatDate = (dateStr: string) => {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getStatusInfo = (status: string) => {
      switch (status) {
          case 'CONFIRMED': return { label: 'Đã xác nhận', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: 'check_circle' };
          case 'PENDING': return { label: 'Chờ xác nhận', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: 'hourglass_top' };
          case 'COMPLETED': return { label: 'Hoàn thành', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300', icon: 'check' };
          case 'CANCELLED': return { label: 'Đã hủy', color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400', icon: 'cancel' };
          default: return { label: status, color: 'bg-gray-100 text-gray-600', icon: 'info' };
      }
  };

  const getStationImage = (stationId: string) => {
      const station = stations.find(s => s._id === stationId);
      return station?.image || 'https://images.unsplash.com/photo-1606144042614-b441db3ce569?q=80&w=600&auto=format&fit=crop';
  };

  return (
    <div className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-10 py-6 lg:py-10 font-sans">
      
      {/* Main Layout using Flexbox to match HTML Structure */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <ProfileSidebar 
            user={user} 
            activePage="bookings" 
            onNavigate={handleSidebarNavigate} 
            onLogout={onLogout} 
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
                <button onClick={onNavigateHome} className="text-gray-500 hover:text-primary transition-colors">Trang chủ</button>
                <span className="text-gray-400">/</span>
                <button onClick={onNavigateProfile} className="text-gray-500 hover:text-primary transition-colors">Tài khoản</button>
                <span className="text-gray-400">/</span>
                <span className="text-[#111418] dark:text-white font-medium">Lịch chơi game</span>
            </div>

            {/* Page Heading */}
            <div className="mb-6">
                <h1 className="text-[#111418] dark:text-white text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Lịch chơi game của bạn</h1>
                <p className="text-gray-500 dark:text-gray-400 text-base">Quản lý các buổi chơi game sắp tới và xem lại lịch sử trải nghiệm tại cửa hàng.</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex gap-6 overflow-x-auto no-scrollbar">
                    <button 
                        onClick={() => setActiveTab('UPCOMING')}
                        className="relative flex flex-col items-center justify-center pb-3 pt-2 group cursor-pointer"
                    >
                        <p className={`text-sm font-bold tracking-wide whitespace-nowrap transition-colors ${activeTab === 'UPCOMING' ? 'text-primary' : 'text-gray-500 dark:text-gray-400 group-hover:text-[#111418] dark:group-hover:text-white'}`}>
                            Sắp tới ({bookings.filter(b => getTabStatus(b.status) === 'UPCOMING').length})
                        </p>
                        <div className={`absolute bottom-0 w-full h-[3px] rounded-t-full transition-colors ${activeTab === 'UPCOMING' ? 'bg-primary' : 'bg-transparent group-hover:bg-gray-300 dark:group-hover:bg-gray-600'}`}></div>
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('COMPLETED')}
                        className="relative flex flex-col items-center justify-center pb-3 pt-2 group cursor-pointer"
                    >
                        <p className={`text-sm font-bold tracking-wide whitespace-nowrap transition-colors ${activeTab === 'COMPLETED' ? 'text-primary' : 'text-gray-500 dark:text-gray-400 group-hover:text-[#111418] dark:group-hover:text-white'}`}>
                            Đã hoàn thành
                        </p>
                        <div className={`absolute bottom-0 w-full h-[3px] rounded-t-full transition-colors ${activeTab === 'COMPLETED' ? 'bg-primary' : 'bg-transparent group-hover:bg-gray-300 dark:group-hover:bg-gray-600'}`}></div>
                    </button>

                    <button 
                        onClick={() => setActiveTab('CANCELLED')}
                        className="relative flex flex-col items-center justify-center pb-3 pt-2 group cursor-pointer"
                    >
                        <p className={`text-sm font-bold tracking-wide whitespace-nowrap transition-colors ${activeTab === 'CANCELLED' ? 'text-primary' : 'text-gray-500 dark:text-gray-400 group-hover:text-[#111418] dark:group-hover:text-white'}`}>
                            Đã hủy
                        </p>
                        <div className={`absolute bottom-0 w-full h-[3px] rounded-t-full transition-colors ${activeTab === 'CANCELLED' ? 'bg-primary' : 'bg-transparent group-hover:bg-gray-300 dark:group-hover:bg-gray-600'}`}></div>
                    </button>
                </div>
            </div>

            {/* Booking List */}
            <div className="flex flex-col gap-4">
                {loading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-[#1a2632] h-48 rounded-xl animate-pulse"></div>
                    ))
                ) : filteredBookings.length > 0 ? (
                    filteredBookings.map(item => {
                        const status = getStatusInfo(item.status);
                        
                        return (
                            <div key={item._id} className="bg-white dark:bg-[#1a2632] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row gap-5">
                                    {/* Image */}
                                    <div className={`w-full md:w-48 lg:w-56 aspect-video rounded-lg bg-gray-100 overflow-hidden relative flex-shrink-0 group ${item.status === 'COMPLETED' || item.status === 'CANCELLED' ? 'grayscale opacity-80' : ''}`}>
                                        <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url('${getStationImage(item.stationId)}')` }}></div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="flex-1 flex flex-col justify-between gap-4">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${status.color}`}>
                                                    <span className="material-symbols-outlined text-[14px]">{status.icon}</span>
                                                    {status.label}
                                                </div>
                                                <p className="text-sm font-bold text-gray-400 dark:text-gray-500">#{item._id}</p>
                                            </div>
                                            <h3 className="text-lg md:text-xl font-bold text-[#111418] dark:text-white mb-2 line-clamp-1">{item.stationName}</h3>
                                            <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[18px] text-gray-400">calendar_clock</span>
                                                    <span>{formatDate(item.date)} | <span className="font-bold text-[#111418] dark:text-white">{item.time} - {item.endTime}</span></span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[18px] text-gray-400">location_on</span>
                                                    <span>{item.storeId === 'hcm-q1' ? 'GameWorld Quận 1' : 'GameWorld Thủ Đức'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[18px] text-gray-400">payments</span>
                                                    <span>Tổng tiền: <span className="font-bold text-[#111418] dark:text-white">{item.totalPrice.toLocaleString()}đ</span></span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                                            {activeTab === 'UPCOMING' && (
                                                <div className="flex flex-col gap-3">
                                                    <button 
                                                        onClick={() => onNavigateBookingDetail && onNavigateBookingDetail(item._id)}
                                                        className="w-full sm:w-fit px-6 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-colors"
                                                    >
                                                        Xem chi tiết
                                                    </button>
                                                    <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30">
                                                        <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">warning</span>
                                                        <p>Không thể dời lịch hoặc hủy buổi đặt lịch tại đây vì đã thanh toán. Vui lòng liên lạc cho cửa hàng để giải quyết.</p>
                                                    </div>
                                                </div>
                                            )}
                                            {activeTab === 'COMPLETED' && (
                                                <div className="flex flex-wrap gap-2">
                                                    <button 
                                                        onClick={onNavigateBooking}
                                                        className="flex-1 sm:flex-none items-center justify-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-[#111418] dark:text-white text-sm font-bold transition-colors"
                                                    >
                                                        Đặt lại
                                                    </button>
                                                </div>
                                            )}
                                            {activeTab === 'CANCELLED' && (
                                                <button className="flex-1 sm:flex-none items-center justify-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-[#111418] dark:text-white text-sm font-bold transition-colors">
                                                    Đặt lại
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-[#1a2632] rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                        <div className="size-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-4xl text-gray-400">calendar_today</span>
                        </div>
                        <h3 className="text-lg font-bold text-[#111418] dark:text-white">Không tìm thấy lịch đặt nào</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6 max-w-md text-center">
                            Bạn chưa có lịch đặt nào trong danh mục này.
                        </p>
                    </div>
                )}
            </div>

            {/* SEO & Cross-sell Section */}
            <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-[#111418] dark:text-white">Game đang HOT tháng này</h3>
                    <button 
                        onClick={onNavigateProducts}
                        className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
                    >
                        Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {hotGames.map(game => (
                        <div 
                            key={game._id} 
                            onClick={() => onNavigateProduct && onNavigateProduct(game._id)}
                            className="bg-white dark:bg-[#1a2632] rounded-lg p-3 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow group cursor-pointer"
                        >
                            <div className="aspect-square bg-gray-100 rounded-md mb-3 overflow-hidden">
                                <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform" style={{ backgroundImage: `url('${game.image}')` }}></div>
                            </div>
                            <h4 className="font-bold text-[#111418] dark:text-white text-sm leading-tight mb-1 truncate">{game.name}</h4>
                            <p className="text-primary font-bold text-sm">{game.price.toLocaleString()}đ</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default GameSchedulePage;