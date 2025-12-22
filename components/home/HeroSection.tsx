import React, { useEffect, useState, useRef } from 'react';
import { DataService } from '../../backend/api';
import { Banner } from '../../shared/types';

const HeroSection: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    DataService.getBanners().then(data => {
      setBanners(data);
      setLoading(false);
    });
  }, []);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = window.setTimeout(
      () =>
        setCurrentIndex((prevIndex) =>
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        ),
      5000 // Chuyển slide mỗi 5s
    );

    return () => resetTimeout();
  }, [currentIndex, banners.length]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <section className="w-full relative overflow-hidden bg-gray-50 pb-10 pt-6 lg:pt-10 min-h-[500px]">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[1440px]">
          <div className="w-full h-[500px] bg-gray-200 rounded-3xl animate-pulse"></div>
        </div>
      </section>
    );
  }

  if (banners.length === 0) return null;

  return (
    <section className="w-full relative overflow-hidden bg-gray-50 pb-10 pt-6 lg:pt-10">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[1440px] relative z-10">
        <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/50 min-h-[500px] md:min-h-[560px]">
          
          {/* Slider Content */}
          {banners.map((banner, index) => (
            <div 
              key={banner._id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
               {/* Background Image */}
               <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms] ease-linear scale-100" 
                  style={{
                    backgroundImage: `url("${banner.imageUrl}")`,
                    transform: index === currentIndex ? 'scale(105)' : 'scale(100)'
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
                
                {/* Text Content */}
                <div className="relative h-full flex items-center">
                  <div className="p-8 md:p-16 lg:p-20 max-w-3xl flex flex-col items-start gap-6">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-300 transition-all duration-700 delay-100 ${index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                      <span className="animate-pulse w-2 h-2 rounded-full bg-primary"></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-white">{banner.badge}</span>
                    </div>
                    
                    <h1 className={`text-white text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight drop-shadow-lg transition-all duration-700 delay-200 ${index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                      {banner.title} <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">{banner.highlightText}</span>
                    </h1>
                    
                    <p className={`text-gray-200 text-lg md:text-xl font-medium max-w-xl leading-relaxed drop-shadow-md transition-all duration-700 delay-300 ${index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                      {banner.description}
                    </p>
                    
                    <div className={`flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2 transition-all duration-700 delay-500 ${index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                      <button className="group flex items-center justify-center gap-2 rounded-xl h-14 px-8 bg-primary hover:bg-primary-dark text-white text-base font-bold transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1">
                        <span>{banner.primaryBtn}</span>
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </button>
                      <button className="flex items-center justify-center rounded-xl h-14 px-8 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 text-base font-bold transition-all hover:-translate-y-1">
                        {banner.secondaryBtn}
                      </button>
                    </div>
                    
                    <div className={`mt-4 flex items-center gap-4 text-sm text-gray-300 font-medium transition-all duration-700 delay-700 ${index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                      <div className="flex -space-x-2">
                        {banner.stats.map((stat, i) => (
                          stat.text && (
                            <div key={i} className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-[10px] ${stat.bg}`}>
                              {stat.text}
                            </div>
                          )
                        ))}
                      </div>
                      <p>{banner.stats.find(s => s.label)?.label}</p>
                    </div>
                  </div>
                </div>
            </div>
          ))}

          {/* Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-white/30 hover:bg-white/60'}`}
                onClick={() => handleDotClick(idx)}
              ></button>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;