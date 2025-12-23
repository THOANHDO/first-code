import React, { useEffect, useState } from 'react';
import { DataService } from '../backend/api';
import { Booking, GameLibrary, FoodDrink, SessionCartItem, FoodDrinkCategory } from '../shared/types';

interface BookingDetailPageProps {
  bookingId: string;
  onNavigateHome: () => void;
}

const BookingDetailPage: React.FC<BookingDetailPageProps> = ({ bookingId, onNavigateHome }) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [games, setGames] = useState<GameLibrary[]>([]);
  const [menu, setMenu] = useState<FoodDrink[]>([]);
  const [loading, setLoading] = useState(true);

  // Session State
  const [sessionCart, setSessionCart] = useState<SessionCartItem[]>([]);
  const [selectedGameIds, setSelectedGameIds] = useState<string[]>([]);
  const [fnbFilter, setFnbFilter] = useState<FoodDrinkCategory | 'ALL'>('ALL');
  const [gameFilter, setGameFilter] = useState<string>('Tất cả');
  const [gameSearch, setGameSearch] = useState('');

  // Modals
  const [showExtendSuccess, setShowExtendSuccess] = useState(false);
  const [showExtendFail, setShowExtendFail] = useState(false);
  const [extensionData, setExtensionData] = useState({ newEndTime: '', price: 0 });

  useEffect(() => {
    const init = async () => {
      const [bData, gData, mData] = await Promise.all([
        DataService.getBookingById(bookingId),
        DataService.getGameLibrary(),
        DataService.getFoodDrinkMenu()
      ]);
      setBooking(bData || null);
      setGames(gData);
      setMenu(mData);
      if (bData) {
        setSelectedGameIds(bData.gameIds || []);
      }
      setLoading(false);
    };
    init();
  }, [bookingId]);

  const maxAllowedGames = (booking?.duration || 1) * 4;

  // F&B Handlers
  const addToSessionCart = (item: FoodDrink) => {
    setSessionCart(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateSessionCartQty = (id: string, delta: number) => {
    setSessionCart(prev => prev.map(i => 
      i._id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
    ));
  };

  const removeFromSessionCart = (id: string) => {
    setSessionCart(prev => prev.filter(i => i._id !== id));
  };

  const submitFnbOrder = async () => {
    if (sessionCart.length === 0) return;
    const res = await DataService.submitSessionOrder(bookingId, sessionCart);
    if (res.success) {
      alert(res.message);
      setSessionCart([]);
    }
  };

  // Extension Handler
  const handleExtend = async () => {
    const res = await DataService.extendBooking(bookingId, 1);
    if (res.success) {
      setExtensionData({ newEndTime: res.newEndTime || '', price: 25000 });
      setShowExtendSuccess(true);
      // Reload booking
      const updated = await DataService.getBookingById(bookingId);
      if (updated) setBooking(updated);
    } else {
      setShowExtendFail(true);
    }
  };

  // Game Handlers
  const toggleGameSelection = async (id: string) => {
    let newIds: string[];
    const isSelected = selectedGameIds.includes(id);
    
    if (isSelected) {
        newIds = selectedGameIds.filter(gid => gid !== id);
    } else {
        if (selectedGameIds.length >= maxAllowedGames) {
            alert(`Giới hạn tối đa ${maxAllowedGames} game cho phiên chơi ${booking?.duration} giờ của bạn.`);
            return;
        }
        newIds = [...selectedGameIds, id];
    }

    setSelectedGameIds(newIds);
    await DataService.swapBookingGame(bookingId, newIds);
  };

  const subTotalFnb = sessionCart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  if (loading) return <div className="flex-1 flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (!booking) return <div className="flex-1 p-10 text-center">Không tìm thấy thông tin phiên chơi. <button onClick={onNavigateHome} className="text-primary font-bold underline">Về trang chủ</button></div>;

  const filteredMenu = menu.filter(item => fnbFilter === 'ALL' || item.category === fnbFilter);
  const filteredGames = games.filter(game => {
      const matchCat = gameFilter === 'Tất cả' || game.category === gameFilter;
      const matchSearch = game.title.toLowerCase().includes(gameSearch.toLowerCase());
      return matchCat && matchSearch;
  });

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111418] dark:text-white min-h-screen flex flex-col relative font-sans">
      
      {/* Extension Success Modal */}
      {showExtendSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowExtendSuccess(false)}></div>
            <div className="relative bg-white dark:bg-[#1a202c] rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-fade-in-up">
                <div className="flex flex-col items-center text-center">
                    <div className="size-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 text-green-600">
                        <span className="material-symbols-outlined text-4xl">check_circle</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#111418] dark:text-white mb-2">Gia hạn thành công!</h3>
                    <p className="text-sm text-[#617589] mb-6">Bạn đã gia hạn thêm 1 giờ chơi. Chúc bạn chơi game vui vẻ!</p>
                    <div className="w-full bg-[#f0f2f4] dark:bg-gray-800 rounded-xl p-4 mb-6 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-[#617589]">Thời gian kết thúc mới</span>
                            <span className="font-bold text-[#111418] dark:text-white">{extensionData.newEndTime}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-[#617589]">Phụ phí</span>
                            <span className="font-bold text-primary">{extensionData.price.toLocaleString()}đ</span>
                        </div>
                    </div>
                    <button onClick={() => setShowExtendSuccess(false)} className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors">Xác nhận</button>
                </div>
            </div>
        </div>
      )}

      {/* Extension Fail Modal */}
      {showExtendFail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowExtendFail(false)}></div>
            <div className="relative bg-white dark:bg-[#1a202c] rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-fade-in-up">
                <div className="flex flex-col items-center text-center">
                    <div className="size-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4 text-red-600">
                        <span className="material-symbols-outlined text-4xl">event_busy</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#111418] dark:text-white mb-2">Không thể gia hạn</h3>
                    <p className="text-sm text-[#617589] mb-6">Rất tiếc, máy đã được đặt bởi khách hàng khác ngay sau khung giờ này.</p>
                    <button onClick={() => setShowExtendFail(false)} className="w-full bg-white dark:bg-gray-800 border border-[#dbe0e6] dark:border-gray-700 text-[#111418] dark:text-white font-bold py-3 rounded-xl">Đóng</button>
                </div>
            </div>
        </div>
      )}

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 items-center text-sm mb-6 text-[#617589]">
          <button onClick={onNavigateHome} className="hover:text-primary font-medium">Trang chủ</button>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="font-medium">Lịch sử đặt lịch</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-[#111418] dark:text-white font-bold">Chi tiết lịch #{bookingId.split('-')[1] || bookingId}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sticky Sidebar */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-[#111418] dark:text-white tracking-tight mb-2">Quản lý phiên chơi</h1>
              <p className="text-[#617589] text-sm">Kiểm soát thời gian, menu F&B và game của bạn.</p>
            </div>

            {/* Session Card */}
            <div className="bg-white dark:bg-[#1a202c] rounded-2xl border border-[#dbe0e6] dark:border-gray-700 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#f0f2f4] dark:border-gray-700">
                    <div className="size-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <span className="material-symbols-outlined">videogame_asset</span>
                    </div>
                    <div>
                        <p className="text-[10px] text-[#617589] font-black uppercase tracking-wider">Đang hoạt động</p>
                        <p className="font-bold text-[#111418] dark:text-white">{booking.stationName}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-end">
                        <span className="text-[#617589] text-sm font-medium">Phiên hiện tại kết thúc lúc</span>
                        <span className="text-primary text-2xl font-black">{booking.endTime}</span>
                    </div>
                    <div className="relative w-full h-3 bg-[#f0f2f4] dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '65%' }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-[#617589] uppercase tracking-tighter">
                        <span>Bắt đầu: {booking.time}</span>
                        <span>Tổng thời gian: {booking.duration}h</span>
                    </div>
                    <button onClick={handleExtend} className="w-full mt-2 bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">add_alarm</span>
                        Gia hạn thêm 1 giờ
                    </button>
                </div>
            </div>

            {/* Current Game Card */}
            <div className="bg-white dark:bg-[#1a202c] rounded-2xl border border-[#dbe0e6] dark:border-gray-700 p-5 shadow-sm">
                <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-4">Danh sách Game mượn ({selectedGameIds.length}/{maxAllowedGames})</h3>
                <div className="space-y-4">
                    {selectedGameIds.length > 0 ? selectedGameIds.slice(0, 1).map(id => {
                        const g = games.find(game => game._id === id);
                        return g ? (
                            <div key={id} className="flex gap-4">
                                <div className="w-16 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                    <img alt={g.title} className="w-full h-full object-cover" src={g.image}/>
                                </div>
                                <div className="flex flex-col justify-center py-1">
                                    <h4 className="font-bold text-sm text-[#111418] dark:text-white leading-tight">{g.title}</h4>
                                    <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-2 py-0.5 rounded mt-1 inline-block w-fit font-bold">{g.category}</span>
                                </div>
                            </div>
                        ) : null;
                    }) : <p className="text-xs text-gray-400 italic">Chưa chọn game.</p>}
                </div>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <p className="text-xs text-blue-800 dark:text-blue-200 flex gap-2 leading-relaxed">
                        <span className="material-symbols-outlined text-[16px] shrink-0">info</span>
                        Muốn đổi game khác? Hãy tìm trong thư viện bên phải và nhấn "Đổi game".
                    </p>
                </div>
            </div>

            {/* F&B Cart Sidebar */}
            <div className="bg-white dark:bg-[#1a202c] rounded-2xl border border-[#dbe0e6] dark:border-gray-700 p-5 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4 border-b border-[#f0f2f4] dark:border-gray-700 pb-3">
                    <h3 className="text-lg font-bold text-[#111418] dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-orange-500">shopping_cart</span>
                        Giỏ hàng tại quầy
                    </h3>
                </div>
                <div className="space-y-4 mb-4 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                    {sessionCart.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-6">Chưa có món nào được chọn</p>
                    ) : sessionCart.map(item => (
                        <div key={item._id} className="flex gap-3 relative group">
                            <div className="size-14 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
                                <img className="w-full h-full object-cover" src={item.image}/>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-sm font-bold text-[#111418] dark:text-white line-clamp-1 pr-4">{item.name}</h4>
                                    <button onClick={() => removeFromSessionCart(item._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <span className="material-symbols-outlined text-[16px]">close</span>
                                    </button>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="flex items-center gap-2 bg-[#f0f2f4] dark:bg-gray-800 rounded px-1.5 py-0.5 border border-transparent">
                                        <button onClick={() => updateSessionCartQty(item._id, -1)} className="size-5 flex items-center justify-center text-[#617589] hover:text-primary font-bold">-</button>
                                        <span className="text-xs font-bold w-4 text-center text-[#111418] dark:text-white">{item.quantity}</span>
                                        <button onClick={() => updateSessionCartQty(item._id, 1)} className="size-5 flex items-center justify-center text-[#617589] hover:text-primary font-bold">+</button>
                                    </div>
                                    <span className="text-sm font-bold text-primary">{(item.price * item.quantity).toLocaleString()}đ</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-auto pt-3 border-t border-[#f0f2f4] dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[#617589] text-sm font-medium">Tạm tính</span>
                        <span className="text-xl font-bold text-[#111418] dark:text-white">{subTotalFnb.toLocaleString()}đ</span>
                    </div>
                    <button onClick={submitFnbOrder} disabled={sessionCart.length === 0} className="w-full bg-gradient-to-r from-primary to-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">send</span>
                        Gửi đơn tới quầy bar
                    </button>
                </div>
            </div>
          </aside>

          {/* Right Main Column */}
          <section className="lg:col-span-8 space-y-10">
            
            {/* F&B Menu */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-[#111418] dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-orange-500">restaurant_menu</span>
                            Menu Đồ ăn & Uống
                        </h2>
                        <p className="text-sm text-[#617589] mt-1">Phục vụ tận nơi, thanh toán cuối giờ.</p>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {['ALL', 'DRINK', 'SNACK', 'NOODLE', 'COFFEE', 'TEA'].map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setFnbFilter(cat as any)}
                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${fnbFilter === cat ? 'bg-[#111418] dark:bg-white text-white dark:text-[#111418] shadow-md' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500'}`}
                            >
                                {cat === 'ALL' ? 'Tất cả' : cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredMenu.map(item => (
                        <div key={item._id} className="bg-white dark:bg-[#1a202c] rounded-2xl border border-[#dbe0e6] dark:border-gray-700 p-4 flex gap-4 hover:border-primary transition-all group">
                            <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={item.image}/>
                            </div>
                            <div className="flex flex-col flex-1 justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-sm text-[#111418] dark:text-white line-clamp-1">{item.name}</h4>
                                        <span className="font-bold text-primary text-sm">{item.price / 1000}k</span>
                                    </div>
                                    <p className="text-[10px] text-[#617589] mt-1 line-clamp-2">{item.description}</p>
                                </div>
                                <button onClick={() => addToSessionCart(item)} className="mt-2 w-full py-1.5 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white text-[10px] font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">add</span>
                                    Thêm vào giỏ
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <hr className="border-[#dbe0e6] dark:border-gray-700 border-dashed"/>

            {/* Game Library Control */}
            <div className="flex flex-col gap-6">
                <div className="bg-white dark:bg-[#1a202c] rounded-2xl p-6 border border-[#dbe0e6] dark:border-gray-700 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <h2 className="text-xl font-bold text-[#111418] dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">sports_esports</span>
                            Thư viện Game tại cửa hàng
                        </h2>
                        <div className="relative w-full md:w-64">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#617589] text-[20px]">search</span>
                            <input 
                                value={gameSearch}
                                onChange={(e) => setGameSearch(e.target.value)}
                                className="w-full h-11 pl-10 pr-4 bg-[#f0f2f4] dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary placeholder-[#617589]" 
                                placeholder="Tìm kiếm tựa game..." 
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                        {['Tất cả', 'Hành động', 'Thể thao', 'Đối kháng', 'RPG', 'Co-op'].map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setGameFilter(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${gameFilter === cat ? 'bg-primary text-white' : 'bg-[#f0f2f4] dark:bg-gray-800 text-gray-500 hover:text-primary'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-4">
                        {filteredGames.map(game => {
                            const isSelected = selectedGameIds.includes(game._id);
                            return (
                                <article key={game._id} className={`group bg-white dark:bg-[#111827] rounded-xl border transition-all overflow-hidden flex flex-col shadow-sm ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-gray-100 dark:border-gray-800'}`}>
                                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
                                        <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={game.image}/>
                                        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider">{game.platform}</div>
                                        {isSelected && (
                                            <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-white text-4xl">check_circle</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 flex flex-col flex-1">
                                        <h3 className="font-bold text-xs text-[#111418] dark:text-white line-clamp-1 mb-1">{game.title}</h3>
                                        <div className="flex items-center gap-1.5 mb-3">
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{game.category}</span>
                                            <span className="text-[10px] text-gray-300">•</span>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{game.players}</span>
                                        </div>
                                        <button 
                                            onClick={() => toggleGameSelection(game._id)}
                                            className={`mt-auto w-full font-bold py-2 rounded-lg text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${isSelected ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-gray-50 dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:bg-primary hover:text-white'}`}
                                        >
                                            <span className="material-symbols-outlined text-[16px]">{isSelected ? 'remove_circle' : 'swap_horiz'}</span>
                                            {isSelected ? 'Bỏ chọn' : 'Đổi game'}
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    <div className="flex justify-center mt-10">
                        <button className="px-8 py-3 bg-white dark:bg-gray-800 border border-[#dbe0e6] dark:border-gray-700 text-[#111418] dark:text-white text-sm font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2">
                            Xem thêm thư viện game
                            <span className="material-symbols-outlined">expand_more</span>
                        </button>
                    </div>
                </div>
            </div>

          </section>
        </div>
      </main>

      <footer className="bg-white dark:bg-[#1a202c] border-t border-[#f0f2f4] dark:border-gray-700 mt-12 py-10">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#617589]">
          <p>© 2024 GameStore Official. Trải nghiệm gaming đích thực.</p>
          <div className="flex gap-8 font-medium">
            <a className="hover:text-primary transition-colors" href="#">Điều khoản sử dụng</a>
            <a className="hover:text-primary transition-colors" href="#">Bảo mật dữ liệu</a>
            <a className="hover:text-primary transition-colors" href="#">Hỗ trợ khách hàng</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BookingDetailPage;