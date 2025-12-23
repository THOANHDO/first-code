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

// Helper to calculate minutes from time string "HH:MM"
const timeToMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};

const BookingPage: React.FC<BookingPageProps> = ({ user, onNavigateHome, onNavigateLogin, onAddToCart, onNavigateCheckout }) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [games, setGames] = useState<GameLibrary[]>([]);
  const [occupiedSlots, setOccupiedSlots] = useState<{start: string, end: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'ALL' | 'PS5' | 'SWITCH'>('ALL');
  const [durationError, setDurationError] = useState<string | null>(null);

  const [formData, setFormData] = useState<BookingInput>({
    userId: user?._id,
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
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
        // Default selection if available
        if (stData.length > 0 && !formData.stationId) {
            // Find first available station or just first station
            const firstAvailable = stData.find(s => s.status === 'AVAILABLE') || stData[0];
            setFormData(prev => ({ ...prev, stationId: firstAvailable._id }));
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

  // Check if a specific time slot is occupied
  const isTimeOccupied = (time: string) => {
      const slotStart = timeToMinutes(time);
      // A slot is occupied if any existing booking covers this start time
      // Logic: Bookings are [Start, End). 
      // If I want to start at 10:00, check if 10:00 is >= existStart AND 10:00 < existEnd
      return occupiedSlots.some(occ => {
          const occStart = timeToMinutes(occ.start);
          const occEnd = timeToMinutes(occ.end);
          return slotStart >= occStart && slotStart < occEnd;
      });
  };

  // Check if increasing duration would overlap with a future booking
  const canIncreaseDuration = () => {
      if (formData.duration >= 8) return false;
      
      const currentStartMins = timeToMinutes(formData.time);
      const nextEndMins = currentStartMins + ((formData.duration + 1) * 60);
      
      // Check collision for the extended hour
      // New interval would be [Start, Start + Duration + 1]
      // We need to ensure no existing booking STARTS between CurrentEnd and NewEnd
      // Or simply check if the New End time overlaps anything
      
      // Simpler logic: Check if the *newly added hour* slot is free
      // The new hour starts at (CurrentStart + CurrentDuration)
      const newHourStartMins = currentStartMins + (formData.duration * 60);
      
      return !occupiedSlots.some(occ => {
          const occStart = timeToMinutes(occ.start);
          // If an existing booking starts exactly when my current session ends (or before the new extension ends)
          return occStart >= newHourStartMins && occStart < nextEndMins;
      });
  };

  const toggleGame = (id: string) => {
    setFormData(prev => {
        const isSelected = prev.gameIds?.includes(id);
        if (!isSelected) {
            if ((prev.gameIds?.length || 0) >= maxAllowedGames) {
                alert(`Với ${formData.duration} giờ chơi, bạn chỉ được chọn tối đa ${maxAllowedGames} tựa game (4 game/giờ).`);
                return prev;
            }
            return { ...prev, gameIds: [...(prev.gameIds || []), id] };
        } else {
            return { ...prev, gameIds: prev.gameIds?.filter(g => g !== id) };
        }
    });
  };

  const handleStationSelect = (id: string) => {
      setFormData(prev => ({ ...prev, stationId: id, gameIds: [] })); // Reset games when station changes
      setDurationError(null);
      // Scroll to next section smoothly
      document.getElementById('chon-gio')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTimeSelect = (time: string) => {
      setFormData(prev => ({ ...prev, time, duration: 1 }));
      setDurationError(null);
  };

  const selectedStation = stations.find(s => s._id === formData.stationId);
  const totalPrice = (selectedStation?.pricePerHour || 0) * formData.duration;

  // Calculate End Time
  const [startH, startM] = formData.time.split(':').map(Number);
  const endTotalMins = startH * 60 + startM + (formData.duration * 60);
  const endH = Math.floor(endTotalMins / 60);
  const endM = endTotalMins % 60;
  const endTimeDisplay = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

  const handleProceedToPayment = () => {
    if (!formData.stationId || !selectedStation) {
        alert("Vui lòng chọn máy chơi game.");
        return;
    }

    // Client-side collision check
    const startMins = timeToMinutes(formData.time);
    const endMins = startMins + (formData.duration * 60);
    
    const hasConflict = occupiedSlots.some(slot => {
        const existStart = timeToMinutes(slot.start);
        const existEnd = timeToMinutes(slot.end);
        return (startMins < existEnd && endMins > existStart);
    });

    if (hasConflict) {
        setDurationError(`Rất tiếc, khung giờ ${formData.time} đã bị trùng lịch với khách hàng khác.`);
        return;
    }

    const cartItem: CartItem = {
        productId: selectedStation._id,
        name: `Booking: ${selectedStation.name}`,
        price: selectedStation.pricePerHour,
        image: selectedStation.image,
        quantity: 1, 
        maxStock: 1,
        type: 'SERVICE',
        bookingDate: formData.date,
        bookingTime: formData.time,
        bookingDuration: formData.duration,
        gameIds: formData.gameIds // Pass selected games to cart
    };

    onAddToCart(cartItem);
    onNavigateCheckout();
  };

  const increaseDuration = () => {
      setDurationError(null);
      if (canIncreaseDuration()) {
          setFormData(prev => ({ ...prev, duration: prev.duration + 1 }));
      } else {
          setDurationError("Không thể gia hạn thêm vì đã có khách đặt lịch ngay sau giờ này.");
      }
  };

  const decreaseDuration = () => {
      setDurationError(null);
      if (formData.duration > 1) {
          setFormData(prev => {
              // If reducing duration reduces max games allowed, trim the game list?
              const newDuration = prev.duration - 1;
              const newMaxGames = newDuration * 4;
              let newGameIds = prev.gameIds || [];
              if (newGameIds.length > newMaxGames) {
                  newGameIds = newGameIds.slice(0, newMaxGames);
              }
              return { ...prev, duration: newDuration, gameIds: newGameIds };
          });
      }
  };

  if (loading) return <div className="flex-1 flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  const filteredStations = stations.filter(s => {
      if (filterType === 'ALL') return true;
      if (filterType === 'PS5') return s.type === 'PS5';
      if (filterType === 'SWITCH') return s.type === 'SWITCH';
      return true;
  });

  const getMonthYear = (dateStr: string) => {
      const d = new Date(dateStr);
      return `Tháng ${d.getMonth() + 1}, ${d.getFullYear()}`;
  };

  const getDayMonth = (dateStr: string) => {
      const d = new Date(dateStr);
      return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  return (
    <div className="bg-[#f6f7f8] dark:bg-[#101922] min-h-screen text-[#111418] dark:text-white font-sans">
        
        {/* Breadcrumbs & Page Title */}
        <div className="bg-white dark:bg-[#1a2632] border-b border-[#f0f2f4] dark:border-gray-800">
            <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-6">
                <div className="flex items-center gap-2 text-sm text-[#617589] dark:text-gray-400 mb-4">
                    <button onClick={onNavigateHome} className="hover:text-primary">Trang chủ</button>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <span className="font-medium text-[#111418] dark:text-white">Đặt lịch chơi game</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#111418] dark:text-white mb-2">Đặt Lịch & Chiến Game</h1>
                <p className="text-[#617589] dark:text-gray-400 max-w-2xl text-lg">Trải nghiệm không gian gaming cao cấp với PS5 và Nintendo Switch mới nhất. Đặt trước để giữ chỗ ngay!</p>
            </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* LEFT COLUMN: Booking Process */}
            <div className="lg:col-span-8 flex flex-col gap-10">
                
                {/* STEP 1: Select Station */}
                <section id="chon-may">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                        <h2 className="text-xl font-bold flex items-center gap-3 text-[#111418] dark:text-white">
                            <span className="size-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">1</span>
                            Chọn khu vực máy
                        </h2>
                        <div className="flex gap-2">
                            <button onClick={() => setFilterType('ALL')} className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${filterType === 'ALL' ? 'bg-[#EAF4FD] dark:bg-primary/20 text-primary border-primary/20' : 'bg-white dark:bg-gray-800 text-[#617589] dark:text-gray-400 border-[#e5e7eb] dark:border-gray-700 hover:bg-[#f9fafb] dark:hover:bg-gray-700'}`}>Tất cả</button>
                            <button onClick={() => setFilterType('PS5')} className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${filterType === 'PS5' ? 'bg-[#EAF4FD] dark:bg-primary/20 text-primary border-primary/20' : 'bg-white dark:bg-gray-800 text-[#617589] dark:text-gray-400 border-[#e5e7eb] dark:border-gray-700 hover:bg-[#f9fafb] dark:hover:bg-gray-700'}`}>PS5</button>
                            <button onClick={() => setFilterType('SWITCH')} className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${filterType === 'SWITCH' ? 'bg-[#EAF4FD] dark:bg-primary/20 text-primary border-primary/20' : 'bg-white dark:bg-gray-800 text-[#617589] dark:text-gray-400 border-[#e5e7eb] dark:border-gray-700 hover:bg-[#f9fafb] dark:hover:bg-gray-700'}`}>Nintendo Switch</button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {filteredStations.map(station => {
                            const isSelected = formData.stationId === station._id;
                            const isMaintenance = station.status === 'MAINTENANCE';
                            
                            return (
                                <div 
                                    key={station._id}
                                    onClick={() => !isMaintenance && handleStationSelect(station._id)}
                                    className={`group relative bg-white dark:bg-[#1a2632] rounded-2xl p-4 border-2 transition-all cursor-pointer shadow-sm ${
                                        isSelected 
                                        ? 'border-primary shadow-[0_4px_20px_rgba(43,140,238,0.2)]' 
                                        : 'border-transparent hover:border-primary/50 hover:shadow-lg'
                                    } ${isMaintenance ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 z-10 ${
                                        isMaintenance 
                                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    }`}>
                                        {isMaintenance ? (
                                            <><span className="material-symbols-outlined text-[14px]">lock</span> Bảo trì</>
                                        ) : (
                                            <><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Trống</>
                                        )}
                                    </div>
                                    
                                    <div className="aspect-video w-full rounded-xl bg-gray-100 dark:bg-gray-800 mb-4 overflow-hidden relative">
                                        <img 
                                            alt={station.name} 
                                            className={`w-full h-full object-cover transition-transform duration-500 ${!isMaintenance ? 'group-hover:scale-105' : 'grayscale'}`} 
                                            src={station.image}
                                        />
                                    </div>
                                    
                                    <h3 className="font-bold text-lg mb-1 text-[#111418] dark:text-white">{station.name}</h3>
                                    <p className="text-sm text-[#617589] dark:text-gray-400 mb-4 line-clamp-2 min-h-[40px]">{station.description}</p>
                                    
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className={`font-bold ${isSelected ? 'text-primary' : 'text-[#617589] dark:text-gray-300'}`}>{station.pricePerHour.toLocaleString()}đ/giờ</span>
                                        {isSelected ? (
                                            <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[20px]">check</span>
                                            </div>
                                        ) : (
                                            <button 
                                                disabled={isMaintenance}
                                                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                                                    isMaintenance 
                                                    ? 'bg-[#f0f2f4] dark:bg-gray-800 text-[#617589] dark:text-gray-500' 
                                                    : 'bg-[#EAF4FD] dark:bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white'
                                                }`}
                                            >
                                                {isMaintenance ? 'Không khả dụng' : 'Chọn'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* STEP 2: Select Time */}
                <section id="chon-gio" className="scroll-mt-24">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-3 text-[#111418] dark:text-white">
                            <span className="size-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">2</span>
                            Chọn thời gian chơi
                        </h2>
                    </div>
                    
                    <div className={`bg-white dark:bg-[#1a2632] rounded-2xl p-6 border transition-colors shadow-sm ${durationError ? 'border-red-300 dark:border-red-900' : 'border-[#e5e7eb] dark:border-gray-700'}`}>
                        <div className="flex flex-col md:flex-row gap-8">
                            
                            {/* Date Picker Area */}
                            <div className="md:w-1/3 flex flex-col gap-4">
                                <label className="font-bold text-sm text-[#617589] dark:text-gray-400 uppercase tracking-wider">Ngày</label>
                                <div className="bg-[#f0f2f4] dark:bg-gray-800 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="font-bold text-[#111418] dark:text-white">{getMonthYear(formData.date)}</span>
                                        <div className="relative">
                                            {/* Native date picker styled as icon */}
                                            <input 
                                                type="date" 
                                                value={formData.date}
                                                min={new Date().toISOString().split('T')[0]}
                                                onChange={(e) => setFormData(prev => ({...prev, date: e.target.value}))}
                                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                            />
                                            <button className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition text-[#617589] dark:text-gray-400">
                                                <span className="material-symbols-outlined">calendar_month</span>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Simplified Calendar Visual */}
                                    <div className="grid grid-cols-7 text-center text-xs text-[#617589] dark:text-gray-400 gap-y-3 mb-2">
                                        <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
                                    </div>
                                    
                                    <div className="text-center">
                                        <div className="inline-block bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md">
                                            {getDayMonth(formData.date)} (Đã chọn)
                                        </div>
                                        <p className="text-xs text-[#617589] dark:text-gray-400 mt-2">Nhấn vào lịch để đổi ngày</p>
                                    </div>
                                </div>
                            </div>

                            {/* Time Slots Area */}
                            <div className="md:w-2/3 flex flex-col gap-4">
                                <label className="font-bold text-sm text-[#617589] dark:text-gray-400 uppercase tracking-wider">
                                    Khung giờ còn trống {selectedStation ? `(${selectedStation.name})` : ''}
                                </label>
                                
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {TIME_SLOTS.map(time => {
                                        // Visual check for occupied slots
                                        const isOccupied = isTimeOccupied(time);
                                        const isSelected = formData.time === time;

                                        return (
                                            <button 
                                                key={time}
                                                onClick={() => !isOccupied && handleTimeSelect(time)}
                                                disabled={isOccupied}
                                                className={`py-3 px-2 rounded-xl border text-sm font-medium transition-all relative overflow-hidden ${
                                                    isOccupied 
                                                    ? 'border-transparent bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 line-through cursor-not-allowed' 
                                                    : isSelected
                                                        ? 'border-primary bg-[#EAF4FD] dark:bg-primary/20 text-primary font-bold shadow-sm'
                                                        : 'border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary hover:text-primary text-[#111418] dark:text-white'
                                                }`}
                                            >
                                                {time}
                                                {isSelected && <div className="absolute top-0 right-0 size-2 bg-primary rounded-bl-lg"></div>}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Duration Control */}
                                <div>
                                    <div className="mt-4 p-4 bg-[#EAF4FD]/50 dark:bg-primary/10 rounded-xl flex flex-col sm:flex-row items-center justify-between border border-primary/10 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-[#617589] dark:text-gray-300">Thời lượng chơi:</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <button 
                                                    onClick={decreaseDuration}
                                                    className="size-8 rounded-lg bg-white dark:bg-gray-800 border border-[#e5e7eb] dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-[#111418] dark:text-white transition-colors"
                                                >-</button>
                                                <span className="font-bold text-lg min-w-[2ch] text-center text-[#111418] dark:text-white">{formData.duration}</span>
                                                <button 
                                                    onClick={increaseDuration}
                                                    className="size-8 rounded-lg bg-white dark:bg-gray-800 border border-[#e5e7eb] dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-[#111418] dark:text-white transition-colors"
                                                >+</button>
                                                <span className="text-sm text-[#111418] dark:text-white ml-1">giờ</span>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <p className="text-sm text-[#617589] dark:text-gray-300">Dự kiến kết thúc:</p>
                                            <p className="text-lg font-bold text-primary">{endTimeDisplay}</p>
                                            <p className="text-[10px] text-[#617589] dark:text-gray-400 mt-1">
                                                (Tối đa {maxAllowedGames} game)
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Warning Message on Collision */}
                                    {durationError && (
                                        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-lg flex items-start gap-2 animate-fade-in-up">
                                            <span className="material-symbols-outlined text-red-500 text-[18px] shrink-0 mt-0.5">error</span>
                                            <p className="text-xs text-red-600 dark:text-red-300 font-medium">{durationError}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* STEP 3: Select Games */}
                <section id="chon-game" className="scroll-mt-24">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-3 text-[#111418] dark:text-white">
                            <span className="size-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">3</span>
                            Chọn game muốn chơi <span className="text-primary ml-1 text-base font-normal">(Đã chọn: {formData.gameIds?.length || 0}/{maxAllowedGames})</span>
                        </h2>
                    </div>
                    
                    <div className="relative">
                        <div className="flex gap-4 overflow-x-auto pb-4 game-scroll snap-x no-scrollbar">
                            {games.map(game => {
                                const isSelected = formData.gameIds?.includes(game._id);
                                return (
                                    <div 
                                        key={game._id} 
                                        onClick={() => toggleGame(game._id)}
                                        className="snap-start shrink-0 w-[140px] flex flex-col gap-2 group cursor-pointer"
                                    >
                                        <div className={`relative rounded-xl overflow-hidden aspect-[3/4] shadow-md transition-all ${isSelected ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-[#101922]' : 'group-hover:shadow-xl'}`}>
                                            <img 
                                                alt={game.title} 
                                                className="w-full h-full object-cover" 
                                                src={game.image}
                                            />
                                            {isSelected ? (
                                                <div className="absolute inset-0 bg-primary/80 flex items-center justify-center transition-opacity">
                                                    <span className="material-symbols-outlined text-white text-3xl">check_circle</span>
                                                </div>
                                            ) : (
                                                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <span className="material-symbols-outlined text-white text-3xl">add_circle</span>
                                                </div>
                                            )}
                                            {game.isHot && (
                                                <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                                    HOT
                                                </div>
                                            )}
                                        </div>
                                        <h4 className={`font-bold text-sm leading-tight text-center transition-colors line-clamp-2 ${isSelected ? 'text-primary' : 'text-[#111418] dark:text-white group-hover:text-primary'}`}>
                                            {game.title}
                                        </h4>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 text-xs text-blue-700 dark:text-blue-300">
                            <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">info</span>
                            <p>Quy tắc: Với mỗi giờ chơi, bạn được chọn tối đa <strong>4 tựa game</strong> để cài đặt sẵn. Chúng tôi sẽ chuẩn bị trước để bạn có trải nghiệm tốt nhất.</p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="bg-[#f0f2f4] dark:bg-gray-800/50 rounded-2xl p-6 mt-6">
                    <h3 className="font-bold text-lg mb-4 text-[#111418] dark:text-white">Câu hỏi thường gặp</h3>
                    <div className="space-y-4">
                        <details className="group bg-white dark:bg-[#1a2632] rounded-xl p-4 cursor-pointer open:ring-1 open:ring-primary/20">
                            <summary className="font-bold text-[#111418] dark:text-white list-none flex justify-between items-center">
                                Cần đặt trước bao lâu?
                                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                            </summary>
                            <p className="text-[#617589] dark:text-gray-400 text-sm mt-2 leading-relaxed">Bạn nên đặt trước ít nhất 2 giờ để chúng tôi chuẩn bị máy và game tốt nhất cho bạn. Vào cuối tuần, hãy đặt trước 1 ngày để đảm bảo có máy trống.</p>
                        </details>
                        <details className="group bg-white dark:bg-[#1a2632] rounded-xl p-4 cursor-pointer open:ring-1 open:ring-primary/20">
                            <summary className="font-bold text-[#111418] dark:text-white list-none flex justify-between items-center">
                                Có thể hủy lịch không?
                                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                            </summary>
                            <p className="text-[#617589] dark:text-gray-400 text-sm mt-2 leading-relaxed">Có, bạn có thể hủy miễn phí trước giờ chơi 1 tiếng. Vui lòng liên hệ hotline hoặc hủy trực tiếp trên website.</p>
                        </details>
                    </div>
                </section>

            </div>

            {/* RIGHT COLUMN: Sticky Summary */}
            <div className="lg:col-span-4 relative">
                <div className="sticky top-24">
                    <div className="bg-white dark:bg-[#1a2632] rounded-2xl border border-[#e5e7eb] dark:border-gray-700 shadow-xl p-6 flex flex-col gap-5">
                        <h3 className="font-black text-xl text-[#111418] dark:text-white border-b border-[#f0f2f4] dark:border-gray-700 pb-4">Thông tin đặt lịch</h3>
                        
                        {/* Selected Items */}
                        <div className="space-y-4">
                            <div className="flex gap-3 items-start">
                                <div className="size-10 rounded-lg bg-[#f0f2f4] dark:bg-gray-800 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[#617589] dark:text-gray-400">videogame_asset</span>
                                </div>
                                <div>
                                    <p className="text-xs text-[#617589] dark:text-gray-400 font-medium uppercase">Khu vực máy</p>
                                    <p className="font-bold text-[#111418] dark:text-white">{selectedStation ? selectedStation.name : 'Chưa chọn máy'}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="size-10 rounded-lg bg-[#f0f2f4] dark:bg-gray-800 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[#617589] dark:text-gray-400">calendar_clock</span>
                                </div>
                                <div>
                                    <p className="text-xs text-[#617589] dark:text-gray-400 font-medium uppercase">Thời gian</p>
                                    <p className="font-bold text-[#111418] dark:text-white">{formData.time} - {endTimeDisplay}</p>
                                    <p className="text-sm text-[#617589] dark:text-gray-400">{getDayMonth(formData.date)} ({formData.duration} giờ)</p>
                                </div>
                            </div>
                            {formData.gameIds && formData.gameIds.length > 0 && (
                                <div className="flex gap-3 items-start">
                                    <div className="size-10 rounded-lg bg-[#f0f2f4] dark:bg-gray-800 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[#617589] dark:text-gray-400">stadia_controller</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#617589] dark:text-gray-400 font-medium uppercase">Game đã chọn</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {formData.gameIds.map(gid => {
                                                const g = games.find(game => game._id === gid);
                                                return g ? <span key={gid} className="text-xs bg-[#EAF4FD] dark:bg-primary/20 text-primary px-2 py-1 rounded font-bold">{g.title}</span> : null;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-dashed border-[#d1d5db] dark:border-gray-600 my-1"></div>
                        
                        {/* Pricing */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-[#617589] dark:text-gray-400">
                                <span>Đơn giá</span>
                                <span>{selectedStation ? selectedStation.pricePerHour.toLocaleString() : 0}đ / giờ</span>
                            </div>
                            <div className="flex justify-between text-sm text-[#617589] dark:text-gray-400">
                                <span>Thời gian</span>
                                <span>x {formData.duration}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-[#111418] dark:text-white pt-2">
                                <span>Tổng cộng</span>
                                <span className="text-primary text-2xl">{totalPrice.toLocaleString()}đ</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 mt-2">
                            <button 
                                onClick={handleProceedToPayment}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
                            >
                                Thanh toán & Xác nhận
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                            <p className="text-xs text-center text-[#617589] dark:text-gray-400">Thanh toán an toàn qua MOMO, VNPAY hoặc QR Code.</p>
                        </div>
                    </div>

                    {/* Trust Badges - FIXED LAYOUT */}
                    <div className="mt-6 grid grid-cols-3 gap-2 grayscale opacity-70 dark:opacity-50">
                        <div className="flex flex-col items-center gap-1 text-center p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
                            <span className="material-symbols-outlined text-2xl text-[#111418] dark:text-white">verified_user</span>
                            <span className="text-[10px] font-bold text-[#111418] dark:text-white uppercase tracking-wide">Bảo mật</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-center p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors border-x border-gray-200 dark:border-gray-700">
                            <span className="material-symbols-outlined text-2xl text-[#111418] dark:text-white">thumb_up</span>
                            <span className="text-[10px] font-bold text-[#111418] dark:text-white uppercase tracking-wide">Uy tín</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-center p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
                            <span className="material-symbols-outlined text-2xl text-[#111418] dark:text-white">support_agent</span>
                            <span className="text-[10px] font-bold text-[#111418] dark:text-white uppercase tracking-wide">Hỗ trợ 24/7</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};

export default BookingPage;