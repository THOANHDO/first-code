import React, { useEffect, useState, useRef } from 'react';
import { DataService } from '../../backend/api';
import { GameStationImage } from '../../shared/types';

const GameHub: React.FC = () => {
  const [images, setImages] = useState<GameStationImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    DataService.getGameStationImages().then(setImages);
  }, []);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (images.length === 0) return;

    resetTimeout();
    timeoutRef.current = window.setTimeout(
      () =>
        setCurrentImageIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        ),
      4000 // Chuyển ảnh mỗi 4s
    );

    return () => resetTimeout();
  }, [currentImageIndex, images.length]);

  return (
    <section className="w-full py-16 lg:py-24 px-4 relative overflow-hidden bg-slate-900 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] to-[#1e293b] z-0"></div>
      
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
      
      <div className="container mx-auto max-w-[1200px] relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-primary-300 font-semibold text-sm">
              <span className="material-symbols-outlined text-[18px]">sports_esports</span>
              <span>Game Station Hub Official</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
              Không Gian Chơi Game <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Đẳng Cấp Pro Player</span>
            </h2>
            
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
              Hệ thống 50+ máy PC cấu hình khủng RTX 4090, khu vực PS5 màn hình 4K 120Hz và phòng VIP riêng tư. Đặt lịch ngay để giữ chỗ đẹp nhất!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button className="bg-primary hover:bg-primary-dark text-white font-bold rounded-xl px-8 py-4 shadow-lg shadow-primary/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">calendar_month</span>
                <span>Đặt Lịch Ngay</span>
              </button>
              <button className="bg-white/5 hover:bg-white/10 border border-white/20 backdrop-blur-sm text-white font-bold rounded-xl px-8 py-4 transition-all hover:-translate-y-1 flex items-center justify-center">
                Xem Bảng Giá
              </button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-400">check_circle</span> Wifi 6E
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-400">check_circle</span> Đồ uống Free
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-400">check_circle</span> Mở 24/7
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-[550px]">
            <div className="relative group aspect-[4/3]">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative h-full w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-800">
                {/* Image Slider */}
                {images.length > 0 ? (
                  images.map((img, idx) => (
                    <div 
                      key={img._id}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                    >
                      <img 
                        src={img.url} 
                        alt={img.alt} 
                        className="w-full h-full object-cover transform scale-100 transition-transform duration-[4000ms] ease-linear"
                        style={{ transform: idx === currentImageIndex ? 'scale(110)' : 'scale(100)' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                      
                      {/* Image Caption */}
                      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-white/90 border border-white/10">
                        {img.alt}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full bg-slate-800 animate-pulse"></div>
                )}
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-slate-800/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl hidden md:block animate-bounce-slow z-20">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                    <span className="material-symbols-outlined">bolt</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">High Performance</p>
                    <p className="text-gray-400 text-xs">RTX 4090 Series</p>
                  </div>
                </div>
              </div>

               {/* Simple Dots for Game Hub */}
               <div className="absolute bottom-4 right-4 z-20 flex gap-1.5">
                {images.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-6 bg-primary' : 'w-1.5 bg-white/40'}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default GameHub;