import React, { useEffect, useState } from 'react';
import { DataService } from '../backend/api';
import { StoreLocation } from '../shared/types';

interface StoresPageProps {
  onNavigateHome: () => void;
  onNavigateBooking: () => void;
  onNavigateContact: () => void; // Added
}

const StoresPage: React.FC<StoresPageProps> = ({ onNavigateHome, onNavigateBooking, onNavigateContact }) => {
  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [selectedStore, setSelectedStore] = useState<StoreLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchStores = async () => {
      const data = await DataService.getStores();
      setStores(data);
      if (data.length > 0) {
        setSelectedStore(data[0]);
      }
      setLoading(false);
    };
    fetchStores();
    window.scrollTo(0, 0);
  }, []);

  // Slideshow Logic for selected Store
  useEffect(() => {
    if (!selectedStore?.images || selectedStore.images.length === 0) return;
    
    // Reset to 0 when store changes
    setCurrentImageIndex(0);

    const timer = setInterval(() => {
        setCurrentImageIndex((prev) => 
            (selectedStore.images && prev === selectedStore.images.length - 1) ? 0 : prev + 1
        );
    }, 4000);

    return () => clearInterval(timer);
  }, [selectedStore]);

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const storeId = e.target.value;
    if (storeId === 'all') return; // Or handle logic to show all
    const found = stores.find(s => s._id === storeId);
    if (found) setSelectedStore(found);
  };

  const handleCardClick = (store: StoreLocation) => {
    setSelectedStore(store);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex-1 w-full min-h-screen bg-white dark:bg-[#101922] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Fallback images if specific store images are missing
  const activeImages = (selectedStore?.images && selectedStore.images.length > 0) 
    ? selectedStore.images 
    : (selectedStore?.image ? [selectedStore.image] : []);

  return (
    <div className="flex flex-col bg-white dark:bg-[#101922] w-full font-sans">
      
      {/* Breadcrumbs */}
      <div className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#101922]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm">
            <button onClick={onNavigateHome} className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors">Trang chủ</button>
            <span className="material-symbols-outlined text-xs text-gray-400">chevron_right</span>
            <button onClick={onNavigateContact} className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors">Liên hệ</button>
            <span className="material-symbols-outlined text-xs text-gray-400">chevron_right</span>
            <span className="font-medium text-gray-900 dark:text-white">Hệ thống cửa hàng</span>
          </div>
        </div>
      </div>

      {/* Page Header & Filter */}
      <div className="bg-white dark:bg-[#101922] pb-8 pt-6 shadow-sm border-b border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
                Tìm cửa hàng gần bạn
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Khám phá không gian trải nghiệm game đỉnh cao và mua sắm trực tiếp tại hệ thống GameWorld.
              </p>
            </div>
            <div className="w-full md:w-auto min-w-[300px]">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Chọn khu vực hoặc chi nhánh</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary pointer-events-none">
                  <span className="material-symbols-outlined text-xl">storefront</span>
                </span>
                <select 
                  className="block w-full appearance-none rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-3 pl-10 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm text-gray-900 dark:text-white"
                  onChange={handleStoreChange}
                  value={selectedStore?._id || ''}
                >
                  {stores.map(store => (
                    <option key={store._id} value={store._id}>{store.name}</option>
                  ))}
                </select>
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                  <span className="material-symbols-outlined">expand_more</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Branch Detail Content */}
      {selectedStore && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Main Info & Gallery */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Hero Image / Gallery with Slideshow */}
              <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 group relative">
                <div className="aspect-[16/9] w-full bg-gray-200 dark:bg-gray-800 relative">
                  {activeImages.map((img, idx) => (
                      <img 
                        key={idx}
                        alt={selectedStore.name} 
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 ${idx === currentImageIndex ? 'opacity-100' : 'opacity-0'}`} 
                        src={img} 
                      />
                  ))}
                  
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button className="bg-black/70 hover:bg-black/90 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm flex items-center gap-2 transition-colors">
                      <span className="material-symbols-outlined text-lg">grid_view</span> Xem {activeImages.length} ảnh
                    </button>
                  </div>
                  
                  {/* Indicators */}
                  {activeImages.length > 1 && (
                      <div className="absolute bottom-4 left-4 flex gap-1.5">
                          {activeImages.map((_, idx) => (
                              <div 
                                  key={idx}
                                  className={`h-1 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-6 bg-primary' : 'w-2 bg-white/60'}`}
                              ></div>
                          ))}
                      </div>
                  )}
                </div>
              </div>

              {/* Store Title & Status */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedStore.name}</h3>
                    <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">
                      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-600"></span>
                      Đang mở cửa
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-2">
                    <span className="material-symbols-outlined text-lg">location_on</span>
                    {selectedStore.address}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors text-sm">
                    <span className="material-symbols-outlined text-lg">share</span> Chia sẻ
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors text-sm">
                    <span className="material-symbols-outlined text-lg">favorite</span> Lưu
                  </button>
                </div>
              </div>

              {/* Available Hardware */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">videogame_asset</span>
                  Thiết bị sẵn có tại cửa hàng
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {selectedStore.equipment.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-center p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 hover:border-primary/30 transition-colors">
                        <div className={`w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm mb-3 ${item.colorClass}`}>
                            <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{item.count}</span>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mt-1">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">local_cafe</span>
                  Tiện ích & Dịch vụ
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                  {selectedStore.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                        <span className={`material-symbols-outlined p-1.5 rounded-lg ${amenity.colorClass} dark:bg-opacity-20`}>{amenity.icon}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Map, Hours, CTA */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700 lg:sticky lg:top-24">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Đặt chỗ ngay</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Giữ máy trước để có trải nghiệm tốt nhất, không cần chờ đợi.</p>
                
                <button 
                    onClick={onNavigateBooking}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 mb-3"
                >
                  <span className="material-symbols-outlined">calendar_clock</span>
                  Đặt giờ chơi tại đây
                </button>
                
                <a 
                    className="w-full bg-blue-50 dark:bg-blue-900/20 text-primary hover:bg-blue-100 dark:hover:bg-blue-900/30 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2" 
                    href={`tel:${selectedStore.phone.replace(/\s/g, '')}`}
                >
                  <span className="material-symbols-outlined">call</span>
                  Hotline: {selectedStore.phone}
                </a>

                <hr className="my-6 border-gray-100 dark:border-gray-700"/>

                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wide mb-3">Giờ mở cửa</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Thứ 2 - Thứ 6</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedStore.hours.weekday}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Thứ 7 - Chủ Nhật</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedStore.hours.weekend}</span>
                  </div>
                </div>

                <hr className="my-6 border-gray-100 dark:border-gray-700"/>

                <div className="rounded-xl overflow-hidden h-48 w-full relative bg-gray-100 dark:bg-gray-700 mb-3 group">
                  <iframe 
                    allowFullScreen 
                    height="100%" 
                    loading="lazy" 
                    src={selectedStore.mapEmbedUrl}
                    style={{border: 0}} 
                    title={`Map showing location of ${selectedStore.name}`}
                    width="100%"
                  ></iframe>
                </div>
                <a className="text-sm font-semibold text-primary hover:underline flex items-center justify-center gap-1" href="#" target='_blank'>
                    Xem bản đồ lớn
                    <span className="material-symbols-outlined text-base">open_in_new</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Other Locations Section */}
      <div className="bg-gray-50 dark:bg-[#1a2632] py-16 border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Chi nhánh khác</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.filter(s => s._id !== selectedStore?._id).map(store => (
                <div 
                    key={store._id}
                    onClick={() => handleCardClick(store)}
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                >
                    <div className="h-48 overflow-hidden relative">
                        <img 
                            alt={store.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            src={store.image} 
                        />
                        <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-900 dark:text-white shadow-sm">
                            {store.city.toUpperCase()}
                        </div>
                    </div>
                    <div className="p-5">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{store.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{store.address}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex gap-2">
                                <span className="material-symbols-outlined text-gray-400 text-lg" title="Wifi">wifi</span>
                                <span className="material-symbols-outlined text-gray-400 text-lg" title="Amenities">local_cafe</span>
                            </div>
                            <span className="text-sm font-medium text-primary flex items-center gap-1">
                                Chi tiết <span className="material-symbols-outlined text-base">arrow_forward</span>
                            </span>
                        </div>
                    </div>
                </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default StoresPage;