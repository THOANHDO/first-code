import React, { useEffect, useState } from 'react';
import { DataService } from '../../backend/api';
import { Category } from '../../shared/types';

interface CategorySectionProps {
  onNavigateProducts: () => void;
}

export default function CategorySection({ onNavigateProducts }: CategorySectionProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    DataService.getCategories().then(setCategories);
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="w-full py-12 lg:py-16">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[1440px]">
        <div className="flex justify-between items-end mb-8 md:mb-12">
          <div>
            <h2 className="text-slate-900 text-2xl md:text-3xl font-bold tracking-tight mb-2">Danh Mục Nổi Bật</h2>
            <p className="text-slate-500 text-sm md:text-base">Khám phá thế giới giải trí đa dạng</p>
          </div>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onNavigateProducts(); }}
            className="text-primary font-bold text-sm hover:underline flex items-center gap-1 group"
          >
            Xem tất cả <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </a>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <a 
              key={cat._id} 
              href="#" 
              onClick={(e) => { e.preventDefault(); onNavigateProducts(); }}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{backgroundImage: `url("${cat.image}")`}}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              
              <div className="absolute bottom-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="material-symbols-outlined text-white mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-2 group-hover:translate-y-0">{cat.icon}</span>
                <h3 className="text-white text-xl font-bold mb-1">{cat.name}</h3>
                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity delay-75 duration-300">{cat.subtitle}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}