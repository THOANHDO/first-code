import React, { useState, useEffect } from 'react';
import { DataService } from '../backend/api';
import { Station, BookingInput, User, GameLibrary, CartItem } from '../shared/types';

interface BookingPageProps {
  user: User | null;
  onNavigateHome: () => void;
  onNavigateLogin?: () => void;
  onAddToCart: (item: CartItem) => void;
  onNavigateCheckout: () => void;
}

const TIME_SLOTS = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
];

const BookingPage: React.FC<BookingPageProps> = ({ user, onNavigateHome, onNavigateLogin, onAddToCart, onNavigateCheckout }) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [games, setGames] = useState<GameLibrary[]>([]);
  const [occupiedSlots, setOccupiedSlots] = useState<{start: string, end: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [filterType, setFilterType] = useState<'ALL' | 'PS5' | 'SWITCH' | 'PC'>('ALL');
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);

  const [formData, setFormData] = useState<BookingInput>({
    userId: user?._id,
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    duration: 1,
    stationId: '',
    gameIds: [],
    note: ''
  });

  const maxAllowedGames = formData.duration * 4;

  useEffect(() => {
    const init = async () => {
        const [stData, gameData] = await Promise.all([
            DataService.getStations(),
            DataService.getGameLibrary()
        ]);
        setStations(stData);
        setGames(gameData);
        if (stData.length > 0) {
            setFormData(prev => ({ ...prev, stationId: stData[0]._id }));
        }
        setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (formData.stationId && formData.date) {
        DataService.getOccupiedSlots(formData.date, formData.stationId).then(setOccupiedSlots);
    }
  }, [formData.stationId, formData.date]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: name === 'duration' ? parseInt(value) : value
    }));
  };

  const toggleGame = (id: string) => {
    setFormData(prev => {
        const isSelected = prev.gameIds?.includes(id);
        if (!isSelected) {
            if ((prev.gameIds?.length || 0) >= maxAllowedGames) {
                alert(`Với ${formData.duration} giờ chơi, bạn chỉ được chọn tối đa ${maxAllowedGames} tựa game theo quy định.`);
                return prev;
            }
            return { ...prev, gameIds: [...(prev.gameIds || []), id] };
        } else {
            return { ...prev, gameIds: prev.gameIds?.filter(g => g !== id) };
        }
    });
  };

  const selectedStation = stations.find(s => s._id === formData.stationId);
  const totalPrice = (selectedStation?.pricePerHour || 0) * formData.duration;

  const handleProceedToPayment = () => {
    if (!formData.stationId || !selectedStation) {
        alert("Vui lòng chọn máy chơi game.");
        return;
    }

    setProcessing(true);

    // Create Cart Item for Booking
    const bookingItem: CartItem = {
        productId: selectedStation._id,
        name: `Đặt máy: ${selectedStation.name} (${formData.time} - ${formData.date})`,
        price: selectedStation.pricePerHour, // Unit price per hour
        image: selectedStation.image,
        quantity: formData.duration, // Quantity is duration
        maxStock: 24, // Logic limit
        type: 'SERVICE',
        bookingDate: formData.date,
        bookingTime: formData.time,
        bookingDuration: formData.duration
    };

    // Simulate small delay then navigate
    setTimeout(() => {
        onAddToCart(bookingItem);
        setProcessing(false);
        onNavigateCheckout();
    }, 500);
  };

  const isSlotOccupied = (slotTime: string) => {
    const slotMins = timeToMinutes(slotTime);
    return occupiedSlots.some(busy => {
        const start = timeToMinutes(busy.start);
        const end = timeToMinutes(busy.end);
        return slotMins >= start && slotMins < end;
    });
  };

  const timeToMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const calculateEndTime = () => {
    const [h, m] = formData.time.split(':').map(Number);
    const endMins = h * 60 + m + (formData.duration * 60);
    return `${Math.floor(endMins / 60).toString().padStart(2, '0')}:${(endMins % 60).toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  const filteredStations = stations.filter(s => filterType === 'ALL' || s.type === filterType);

  return (
    <div className="w-full bg-[#f6f7f8] dark:bg-[#101922] min-h-screen font-sans relative pb-10">
      
      {/* Game Selection Modal */}
      {isGameModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsGameModalOpen(false)}></div>
              <div className="relative bg-white dark:bg-[#1a2632] w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">Thư viện Game</h3>
                        <p className="text-sm text-gray-500">Đã chọn {formData.gameIds?.length}/{maxAllowedGames} game</p>
                      </div>
                      <button onClick={() => setIsGameModalOpen(false)} className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-red-500">
                        <span className="material-symbols-outlined">close</span>
                      </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                          {games.map(game => (
                              <div key={game._id} onClick={() => toggleGame(game._id)} className="group flex flex-col gap-3 cursor-pointer">
                                  <div className={`relative rounded-2xl overflow-hidden aspect-[3/4] shadow-md transition-all ${formData.gameIds?.includes(game._id) ? 'ring-4 ring-primary ring-offset-4 dark:ring-offset-gray-900 scale-95' : 'hover:shadow-xl'}`}>
                                      <img src={game.image} className="w-full h-full object-cover" />
                                      <div className={`absolute inset-0 flex items-center justify-center transition-all ${formData.gameIds?.includes(game._id) ? 'bg-primary/70 opacity-100' : 'bg-transparent opacity-0 group-hover:bg-primary/20 group-hover:opacity-100'}`}>
                                          <span className="material-symbols-outlined text-white text-4xl">{formData.gameIds?.includes(game._id) ? 'check_circle' : 'add_circle'}</span>
                                      </div>
                                  </div>
                                  <h4 className={`font-bold text-xs leading-tight text-center transition-colors ${formData.gameIds?.includes(game._id) ? 'text-primary' : 'text-slate-700 dark:text-gray-300'}`}>{game.title}</h4>
                              </div>
                          ))}
                      </div>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-[#151f2a] border-t border-gray-100 dark:border-gray-800 flex justify-end">
                      <button onClick={() => setIsGameModalOpen(false)} className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg">Xong</button>
                  </div>
              </div>
          </div>
      )}

      {/* Breadcrumbs & Header */}
      <div className="bg-white dark:bg-[#1a2632] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-[1280px] mx-auto px-6 py-10">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <button onClick={onNavigateHome} className="hover:text-primary">Trang chủ</button>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span className="font-medium text-slate-900 dark:text-white">Đặt lịch chơi game</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Đặt Lịch & Chiến Game</h1>
            <p className="text-gray-500 max-w-2xl text-lg leading-relaxed">Trải nghiệm không gian gaming cao cấp. Đặt máy trước, chọn game yêu thích và chúng tôi sẽ chuẩn bị sẵn cho bạn!</p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Sections */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* STEP 1 */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl font-bold flex items-center gap-3 dark:text-white">
                    <span className="size-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">1</span>
                    Chọn khu vực máy
                </h2>
                <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
                    {['ALL', 'PS5', 'SWITCH', 'PC'].map(type => (
                        <button key={type} onClick={() => setFilterType(type as any)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterType === type ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                            {type === 'ALL' ? 'Tất cả' : type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredStations.map(st => (
                    <div key={st._id} onClick={() => st.status === 'AVAILABLE' && setFormData(prev => ({ ...prev, stationId: st._id }))} className={`group relative bg-white dark:bg-[#1a2632] rounded-2xl p-4 border-2 transition-all cursor-pointer ${formData.stationId === st._id ? 'border-primary shadow-lg shadow-primary/10' : 'border-gray-100 dark:border-gray-800 hover:border-primary/50'} ${st.status !== 'AVAILABLE' ? 'opacity-60 grayscale' : ''}`}>
                        <div className={`absolute top-4 right-4 text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider z-10 ${st.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : st.status === 'MAINTENANCE' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {st.status === 'AVAILABLE' && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
                            {st.status === 'AVAILABLE' ? 'Trống' : st.status === 'MAINTENANCE' ? 'Bảo trì' : 'Đang bận'}
                        </div>
                        <div className="aspect-video w-full rounded-xl bg-gray-100 dark:bg-gray-800 mb-4 overflow-hidden">
                            <img src={st.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <h3 className="font-bold text-lg mb-1 dark:text-white">{st.name}</h3>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{st.description}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-primary font-black text-lg">{st.pricePerHour.toLocaleString()}đ/giờ</span>
                            <div className={`size-8 rounded-full flex items-center justify-center transition-all ${formData.stationId === st._id ? 'bg-primary text-white scale-110' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                <span className="material-symbols-outlined text-[20px]">{formData.stationId === st._id ? 'check' : 'add'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </section>

          {/* STEP 2 */}
          <section className="bg-white dark:bg-[#1a2632] rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold flex items-center gap-3 dark:text-white mb-8">
                <span className="size-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">2</span>
                Thời gian chơi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="space-y-4">
                    <label className="font-black text-xs text-gray-400 uppercase tracking-widest block">Ngày đặt máy</label>
                    <input type="date" name="date" min={new Date().toISOString().split('T')[0]} value={formData.date} onChange={handleChange} className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-primary" />
                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <p className="text-xs font-bold text-primary mb-1">Quy định:</p>
                        <p className="text-xs text-gray-500 leading-relaxed italic">Vui lòng đến đúng giờ đã đặt. Nếu trễ quá 15 phút mà không thông báo, máy sẽ tự động được giải phóng.</p>
                    </div>
                </div>
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <label className="font-black text-xs text-gray-400 uppercase tracking-widest block mb-4">Giờ bắt đầu</label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {TIME_SLOTS.map(slot => {
                                const occupied = isSlotOccupied(slot);
                                return (
                                    <button key={slot} disabled={occupied} onClick={() => setFormData(prev => ({ ...prev, time: slot }))} className={`py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all relative overflow-hidden ${occupied ? 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 border-transparent line-through cursor-not-allowed' : formData.time === slot ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-white dark:bg-gray-700 border-gray-100 dark:border-gray-600 text-slate-600 dark:text-gray-300 hover:border-primary/40'}`}>
                                        {slot}
                                        {formData.time === slot && !occupied && <div className="absolute top-0 right-0 size-2 bg-primary rounded-bl-lg"></div>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <div className="flex-1 w-full">
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-tight">Số giờ chơi</label>
                            <div className="flex items-center gap-4">
                                <button onClick={() => setFormData(prev => ({ ...prev, duration: Math.max(1, prev.duration - 1) }))} className="size-10 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 font-black text-xl text-slate-600 dark:text-white">-</button>
                                <span className="text-2xl font-black text-slate-800 dark:text-white min-w-[2ch] text-center">{formData.duration}</span>
                                <button onClick={() => setFormData(prev => ({ ...prev, duration: Math.min(8, prev.duration + 1) }))} className="size-10 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 font-black text-xl text-slate-600 dark:text-white">+</button>
                                <span className="text-sm font-bold text-gray-400 uppercase ml-1">Giờ</span>
                            </div>
                        </div>
                        <div className="w-full sm:w-px h-px sm:h-12 bg-gray-200 dark:bg-gray-700"></div>
                        <div className="flex-1 w-full text-left sm:text-right">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Dự kiến kết thúc</p>
                            <p className="text-2xl font-black text-primary">{calculateEndTime()}</p>
                        </div>
                    </div>
                </div>
            </div>
          </section>

          {/* STEP 3 */}
          <section>
            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold flex items-center gap-3 dark:text-white">
                      <span className="size-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">3</span>
                      Yêu cầu game cài sẵn (Tối đa {maxAllowedGames})
                  </h2>
                  <p className="text-xs text-gray-500 ml-11">Thẻ bài game đã chọn: {formData.gameIds?.length || 0}</p>
                </div>
                <button onClick={() => setIsGameModalOpen(true)} className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                  Xem thêm thư viện <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                </button>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide snap-x">
                {games.slice(0, 10).map(game => (
                    <div key={game._id} onClick={() => toggleGame(game._id)} className="snap-start shrink-0 w-[140px] flex flex-col gap-3 group cursor-pointer">
                        <div className={`relative rounded-2xl overflow-hidden aspect-[3/4] shadow-md transition-all ${formData.gameIds?.includes(game._id) ? 'ring-4 ring-primary ring-offset-4 dark:ring-offset-gray-900 scale-95' : 'hover:shadow-xl group-hover:-translate-y-1'}`}>
                            <img src={game.image} className="w-full h-full object-cover" />
                            <div className={`absolute inset-0 flex items-center justify-center transition-all ${formData.gameIds?.includes(game._id) ? 'bg-primary/70 opacity-100' : 'bg-transparent opacity-0 group-hover:bg-primary/20 group-hover:opacity-100'}`}>
                                <span className="material-symbols-outlined text-white text-4xl">{formData.gameIds?.includes(game._id) ? 'check_circle' : 'add_circle'}</span>
                            </div>
                            {game.isHot && <div className="absolute top-3 right-3 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded shadow-sm uppercase">Hot</div>}
                        </div>
                        <h4 className={`font-bold text-sm leading-tight text-center ${formData.gameIds?.includes(game._id) ? 'text-primary' : 'text-slate-700 dark:text-gray-300'}`}>{game.title}</h4>
                    </div>
                ))}
            </div>
          </section>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-24 bg-white dark:bg-[#1a2632] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl p-8 space-y-6">
            <h3 className="font-black text-2xl text-slate-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Tóm tắt đơn đặt</h3>
            
            <div className="space-y-5">
                <div className="flex gap-4">
                    <div className="size-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-primary">videogame_asset</span></div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Loại máy & Khu vực</p>
                        <p className="font-bold text-slate-800 dark:text-white text-sm">{selectedStation?.name || 'Chưa chọn máy'}</p>
                        <p className="text-xs text-primary font-bold">{selectedStation?.zone}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="size-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-primary">calendar_today</span></div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Thời gian sử dụng</p>
                        <p className="font-bold text-slate-800 dark:text-white text-sm">{formData.time} - {calculateEndTime()}</p>
                        <p className="text-xs text-gray-500">{formData.date} ({formData.duration} giờ)</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="size-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-primary">stadia_controller</span></div>
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Game yêu cầu ({formData.gameIds?.length || 0})</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {formData.gameIds && formData.gameIds.length > 0 ? (
                                formData.gameIds.map(id => {
                                    const g = games.find(game => game._id === id);
                                    return <span key={id} className="bg-primary/10 text-primary text-[10px] font-black px-2.5 py-1 rounded-full uppercase truncate max-w-[120px]">{g?.title}</span>;
                                })
                            ) : (
                                <span className="text-xs text-gray-400 italic">Mặc định thư viện sẵn có</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-dashed border-gray-200 dark:border-gray-800 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Đơn giá thuê máy</span>
                    <span className="font-bold dark:text-white">{selectedStation?.pricePerHour.toLocaleString()}đ/giờ</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Thời lượng chơi</span>
                    <span className="font-bold dark:text-white">x {formData.duration}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800 mt-2">
                    <span className="text-lg font-black dark:text-white">Tổng cộng</span>
                    <span className="text-3xl font-black text-primary">{totalPrice.toLocaleString()}đ</span>
                </div>
            </div>

            <button 
                onClick={handleProceedToPayment}
                disabled={processing || !formData.stationId}
                className="w-full h-14 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 mt-2"
            >
                {processing ? <span className="animate-spin material-symbols-outlined">progress_activity</span> : 'THÊM VÀO GIỎ & THANH TOÁN'}
                {!processing && <span className="material-symbols-outlined">shopping_cart_checkout</span>}
            </button>
            <p className="text-[10px] text-center text-gray-400 font-medium">Đặt lịch không rủi ro - Bạn có thể hủy hoàn toàn miễn phí trước 30 phút.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingPage;