import React, { useEffect, useState, useMemo } from 'react';
import { User, Order } from '../shared/types';
import { DataService, AuthService } from '../backend/api';
import ProfileSidebar from '../components/profile/ProfileSidebar';

interface OrdersPageProps {
  user: User;
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateBookings: () => void;
  onNavigateWishlist: () => void; 
  onNavigateAddressBook: () => void;
  onNavigateContact: () => void;
  onNavigateOrderDetail?: (id: string) => void;
  onLogout: () => void;
}

// Order History Item (Simplified to just Order)
interface OrderHistoryItem {
    id: string;
    date: string;
    status: string;
    total: number;
    details: Order;
}

const ITEMS_PER_PAGE = 10;

const OrdersPage: React.FC<OrdersPageProps> = ({ 
    user, 
    onNavigateHome, 
    onNavigateProfile, 
    onNavigateBookings,
    onNavigateWishlist,
    onNavigateAddressBook,
    onNavigateContact, 
    onNavigateOrderDetail, 
    onLogout 
}) => {
  const [items, setItems] = useState<OrderHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Status mapping to tab keys
  const getTabStatus = (status: string) => {
      if (status === 'PENDING') return 'PENDING_PAYMENT';
      if (status === 'SHIPPING' || status === 'CONFIRMED') return 'PROCESSING';
      if (status === 'COMPLETED') return 'DELIVERED';
      if (status === 'CANCELLED') return 'CANCELLED';
      return 'ALL';
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Fetch Orders
      const orders = await DataService.getUserOrders(user._id);

      // Filter out orders that contain ONLY 'SERVICE' items (Bookings)
      // These should be displayed in the Game Schedule / Bookings page instead
      const productOrders = orders.filter(order => 
        order.items.some(item => item.type !== 'SERVICE')
      );

      const normalizedOrders: OrderHistoryItem[] = productOrders.map(o => ({
          id: o._id,
          date: o.createdAt,
          status: o.status,
          total: o.totalAmount,
          details: o
      }));

      // Sort by newest first
      setItems(normalizedOrders.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
      setLoading(false);
    };
    fetchData();
  }, [user._id]);

  // Reset to page 1 when filters change
  useEffect(() => {
      setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Filtering & Search Logic
  const filteredItems = useMemo(() => {
      let result = items;

      // 1. Filter by Tab
      if (activeTab !== 'ALL') {
          result = result.filter(item => {
              const itemTab = getTabStatus(item.status);
              return itemTab === activeTab;
          });
      }

      // 2. Filter by Search (Optimized: Case insensitive, ID or Product Name)
      if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          result = result.filter(item => {
              // Check Order ID
              const idMatch = item.id.toLowerCase().includes(q);
              
              // Check Product Names
              const order = item.details;
              // Only search in PRODUCT items
              const contentMatch = order.items
                .filter(i => i.type !== 'SERVICE')
                .some(i => i.name.toLowerCase().includes(q));
              
              return idMatch || contentMatch;
          });
      }

      return result;
  }, [items, activeTab, searchQuery]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages) {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  const handleSidebarNavigate = (page: string) => {
    if (page === 'profile') onNavigateProfile();
    if (page === 'bookings') onNavigateBookings();
    if (page === 'wishlist') onNavigateWishlist();
    if (page === 'address-book') onNavigateAddressBook();
  };

  const formatDate = (isoString: string) => {
      const date = new Date(isoString);
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getStatusDisplay = (status: string) => {
      const config: any = {
          'PENDING': { label: 'Chờ thanh toán', class: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: 'pending' },
          'SHIPPING': { label: 'Đang giao hàng', class: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300', icon: 'local_shipping' },
          'CONFIRMED': { label: 'Đang xử lý', class: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300', icon: 'inventory' },
          'COMPLETED': { label: 'Giao thành công', class: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300', icon: 'check_circle' },
          'CANCELLED': { label: 'Đã hủy', class: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300', icon: 'cancel' }
      };
      return config[status] || { label: status, class: 'bg-gray-100 text-gray-600', icon: 'info' };
  };

  return (
    <div className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-10 py-6 lg:py-10 font-sans">
      
      {/* Main Layout using Flexbox */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <ProfileSidebar 
            user={user} 
            activePage="orders" 
            onNavigate={handleSidebarNavigate} 
            onLogout={onLogout} 
        />

        {/* Main Order Content */}
        <main className="flex-1 flex flex-col gap-6 min-w-0">
          
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap gap-2 mb-2 text-sm">
            <button onClick={onNavigateHome} className="text-[#617589] hover:text-primary transition-colors">Trang chủ</button>
            <span className="text-[#617589]">/</span>
            <button onClick={onNavigateProfile} className="text-[#617589] hover:text-primary transition-colors">Tài khoản</button>
            <span className="text-[#617589]">/</span>
            <span className="text-[#111418] dark:text-white font-medium">Lịch sử đơn hàng</span>
          </nav>

          {/* Page Heading & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-[#111418] dark:text-white text-3xl font-bold tracking-tight">Lịch sử đơn hàng</h1>
              <p className="text-[#617589] dark:text-gray-400 mt-1 text-sm">Quản lý và theo dõi tiến độ các đơn hàng sản phẩm của bạn.</p>
            </div>
            <div className="relative w-full sm:w-auto group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#617589] text-[20px] group-focus-within:text-primary transition-colors">search</span>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white dark:bg-[#1a2632] border border-[#e5e7eb] dark:border-gray-700 rounded-lg text-sm w-full sm:w-64 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-[#111418] dark:text-white transition" 
                placeholder="Tìm Mã đơn / Tên SP" 
                type="text"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-[#e5e7eb] dark:border-gray-700 overflow-x-auto">
            <div className="flex w-max min-w-full gap-6 sm:gap-8 px-1">
              {[
                  { id: 'ALL', label: 'Tất cả' },
                  { id: 'PENDING_PAYMENT', label: 'Chờ thanh toán', count: items.filter(i => i.status === 'PENDING').length },
                  { id: 'PROCESSING', label: 'Đang xử lý' },
                  { id: 'DELIVERED', label: 'Đã giao' },
                  { id: 'CANCELLED', label: 'Đã hủy' }
              ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === tab.id ? 'text-primary border-primary font-bold' : 'text-[#617589] dark:text-gray-400 border-transparent hover:text-[#111418] dark:hover:text-white hover:border-gray-300'}`}
                  >
                    {tab.label}
                    {tab.count ? <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-red-100 text-red-600 rounded-full">{tab.count}</span> : null}
                  </button>
              ))}
            </div>
          </div>

          {/* Order List */}
          <div className="flex flex-col gap-4">
            {loading ? (
                Array.from({length: 3}).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-[#1a2632] h-48 rounded-xl animate-pulse"></div>
                ))
            ) : paginatedItems.length > 0 ? (
                paginatedItems.map(item => {
                    const statusInfo = getStatusDisplay(item.status);
                    const order = item.details;
                    
                    // IMPORTANT: Filter out items that are SERVICES (Bookings) from the display list
                    // This ensures the Order Card only shows physical products
                    const displayItems = order.items.filter(prod => prod.type !== 'SERVICE');

                    return (
                        <article key={item.id} className="bg-white dark:bg-[#1a2632] rounded-xl border border-[#e5e7eb] dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            {/* Header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-[#f9fafb] dark:bg-[#151f2a] border-b border-[#e5e7eb] dark:border-gray-700">
                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                    <span className="font-bold text-[#111418] dark:text-white">#{item.id}</span>
                                    <span className="text-[#617589]">|</span>
                                    <span className="text-[#617589]">{formatDate(item.date)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.class}`}>
                                        <span className="material-symbols-outlined text-[14px]">{statusInfo.icon}</span>
                                        {statusInfo.label}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Items (Only Products) */}
                            {displayItems.map((prod, idx) => (
                                <div key={`${item.id}-item-${idx}`} className={`p-5 flex flex-col sm:flex-row gap-5 ${idx < displayItems.length - 1 ? 'border-b border-dashed border-[#e5e7eb] dark:border-gray-700' : ''}`}>
                                    <div className="w-full sm:w-24 h-24 shrink-0 rounded-lg bg-[#f0f2f4] dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
                                        <img className="w-full h-full object-cover" src={prod.image} alt={prod.name} />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between gap-2">
                                        <div>
                                            <h3 className="text-base font-bold text-[#111418] dark:text-white mb-1 line-clamp-2">{prod.name}</h3>
                                            <p className="text-sm text-[#617589]">Phân loại: {prod.selectedColor || 'Tiêu chuẩn'}</p>
                                            <p className="text-sm text-[#617589]">Số lượng: x{prod.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row sm:flex-col justify-end items-end sm:gap-1">
                                        <span className="text-lg font-bold text-[#111418] dark:text-white">{(prod.price * prod.quantity).toLocaleString()}đ</span>
                                    </div>
                                </div>
                            ))}

                            {/* Footer Actions */}
                            <div className="px-5 py-4 border-t border-[#e5e7eb] dark:border-gray-700 flex flex-wrap items-center justify-between gap-4 bg-[#fcfcfc] dark:bg-transparent">
                                <p className="text-sm text-[#617589] dark:text-gray-400">Thành tiền: <span className="text-base font-bold text-primary ml-1">{item.total.toLocaleString()}đ</span></p>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={onNavigateContact}
                                        className="px-4 py-2 text-sm font-medium text-[#617589] dark:text-gray-300 bg-white dark:bg-transparent border border-[#dbe0e6] dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                    >
                                        Liên hệ Shop
                                    </button>
                                    <button 
                                        onClick={() => onNavigateOrderDetail && onNavigateOrderDetail(item.id)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600 transition shadow-sm shadow-blue-200 dark:shadow-none"
                                    >
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        </article>
                    );
                })
            ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-[#1a2632] rounded-xl border border-dashed border-[#e5e7eb] dark:border-gray-700">
                    <div className="size-20 bg-[#f0f2f4] dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-4xl text-[#617589]">receipt_long</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#111418] dark:text-white">Không tìm thấy đơn hàng nào</h3>
                    <p className="text-[#617589] mt-2 mb-6 max-w-md text-center">
                        {searchQuery ? `Không có kết quả cho "${searchQuery}"` : "Bạn chưa có đơn hàng sản phẩm nào."}
                    </p>
                    {!searchQuery && (
                        <button onClick={onNavigateHome} className="px-6 py-2.5 text-sm font-bold text-white bg-primary rounded-lg hover:bg-blue-600 transition">
                            Mua sắm ngay
                        </button>
                    )}
                </div> 
            )}
          </div>

          {/* Pagination */}
          {filteredItems.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="size-10 flex items-center justify-center rounded-lg bg-white dark:bg-[#1a2632] border border-[#e5e7eb] dark:border-gray-700 text-[#617589] hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                
                {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    return (
                        <button 
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`size-10 flex items-center justify-center rounded-lg transition font-medium ${currentPage === page ? 'bg-primary text-white font-bold shadow-sm' : 'bg-white dark:bg-[#1a2632] border border-[#e5e7eb] dark:border-gray-700 text-[#111418] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        >
                            {page}
                        </button>
                    );
                })}

                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="size-10 flex items-center justify-center rounded-lg bg-white dark:bg-[#1a2632] border border-[#e5e7eb] dark:border-gray-700 text-[#617589] hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OrdersPage;