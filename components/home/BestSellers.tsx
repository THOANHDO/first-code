import React, { useEffect, useState } from 'react';
import { DataService } from '../../backend/api';
import { Product, FilterType, ProductFilterParams } from '../../shared/types';

interface BestSellersProps {
  onNavigateProduct?: (id: string) => void;
  onNavigateProducts: () => void;
}

export default function BestSellers({ onNavigateProduct, onNavigateProducts }: BestSellersProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    const params: ProductFilterParams = {
      limit: 8,
      sort: 'popular'
    };

    if (filter !== 'ALL') {
      params.categories = [filter];
    }

    DataService.getProducts(params).then(response => {
      setProducts(response.data);
      setLoading(false);
    });
  }, [filter]);

  return (
    <section className="w-full py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[1440px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-slate-900 text-2xl md:text-3xl font-bold tracking-tight mb-2">Sản Phẩm Bán Chạy</h2>
            <p className="text-slate-500 text-sm">Những sản phẩm được game thủ săn đón nhất tuần qua</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {[
              { label: 'Tất cả', value: 'ALL' },
              { label: 'PlayStation', value: 'PLAYSTATION' },
              { label: 'Nintendo', value: 'NINTENDO' },
              { label: 'Phụ kiện', value: 'ACCESSORIES' }
            ].map(tab => (
              <button 
                key={tab.value}
                onClick={() => setFilter(tab.value as FilterType)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  filter === tab.value 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'bg-gray-100 text-slate-500 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
             {[1,2,3,4].map(i => (
               <div key={i} className="bg-gray-100 rounded-2xl h-[400px] animate-pulse"></div>
             ))}
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.map(product => (
              <div 
                key={product._id} 
                onClick={() => onNavigateProduct && onNavigateProduct(product._id)}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 flex flex-col h-full cursor-pointer"
              >
                <div className="relative pt-[100%] overflow-hidden bg-white p-4">
                  <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                  
                  {product.tags && product.tags.length > 0 && (
                     <div className="absolute top-3 left-3 flex flex-col gap-1">
                       {product.tags.map(tag => (
                         <span key={tag} className={`text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm ${tag === 'HOT' ? 'bg-blue-500' : 'bg-red-500'}`}>
                           {tag}
                         </span>
                       ))}
                     </div>
                  )}
                  
                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 duration-300">
                    <span className="material-symbols-outlined text-[18px]">favorite</span>
                  </button>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">{product.category}</div>
                  <h3 className="text-slate-800 font-bold text-lg leading-snug line-clamp-2 mb-3 group-hover:text-primary transition-colors">{product.name}</h3>
                  
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      {product.originalPrice && (
                        <span className="text-gray-400 text-xs line-through font-medium">{product.originalPrice.toLocaleString('vi-VN')}đ</span>
                      )}
                      <span className="text-primary font-bold text-xl">{product.price.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <button className="h-10 w-10 rounded-xl bg-gray-100 hover:bg-primary hover:text-white text-slate-800 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm">
                      <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-12">
          <button 
            onClick={onNavigateProducts}
            className="flex items-center gap-2 px-8 py-3 rounded-xl border border-gray-300 hover:border-primary hover:text-primary text-slate-800 font-bold transition-all bg-transparent hover:bg-primary/5"
          >
            <span>Xem thêm sản phẩm</span>
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
        </div>
      </div>
    </section>
  );
}