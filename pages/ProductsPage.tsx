import React, { useEffect, useState, useRef } from 'react';
import { DataService } from '../backend/api';
import { Product, GameStationImage, Category, Brand, ProductFilterParams } from '../shared/types';

interface ProductsPageProps {
  onNavigateHome: () => void;
  onNavigateProduct?: (id: string) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
}

const ITEMS_PER_PAGE = 10;
const MAX_PRICE_RANGE = 20000000;

const ProductsPage: React.FC<ProductsPageProps> = ({ onNavigateHome, onNavigateProduct, searchQuery, onClearSearch }) => {
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [promoImages, setPromoImages] = useState<GameStationImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(MAX_PRICE_RANGE);
  const [sortOption, setSortOption] = useState<'popular' | 'newest' | 'price_asc' | 'price_desc'>('popular');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Banner State
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  // Fetch Static Resources (Categories, Brands, Banner)
  useEffect(() => {
    DataService.getCategories().then(setCategories);
    DataService.getBrands().then(setBrands);
    DataService.getGameStationImages().then(setPromoImages);
  }, []);

  // Main Data Fetching (Products)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      const params: ProductFilterParams = {
        search: searchQuery,
        categories: selectedCategories,
        brands: selectedBrands,
        maxPrice: priceRange,
        sort: sortOption,
        page: currentPage,
        limit: ITEMS_PER_PAGE
      };

      const result = await DataService.getProducts(params);
      
      setProducts(result.data);
      setTotalPages(result.totalPages);
      setTotalItems(result.total);
      setLoading(false);
    };

    fetchProducts();
    // Scroll to top of grid when page changes
    if (currentPage > 1) {
       document.getElementById('product-grid-start')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [searchQuery, selectedCategories, selectedBrands, priceRange, sortOption, currentPage]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, selectedBrands, priceRange, sortOption]);

  // Handlers
  const toggleCategory = (code: string) => {
    setSelectedCategories(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const toggleBrand = (name: string) => {
    setSelectedBrands(prev => 
      prev.includes(name) ? prev.filter(b => b !== name) : [...prev, name]
    );
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange(Number(e.target.value));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as any);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Banner Slideshow Logic
  useEffect(() => {
    if (promoImages.length === 0) return;
    
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setCurrentPromoIndex((prev) => (prev === promoImages.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [currentPromoIndex, promoImages.length]);

  return (
    <div className="flex-1 w-full bg-gray-50 dark:bg-[#101922] min-h-screen">
      <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
        <div className="flex flex-col w-full max-w-[1280px] flex-1">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 p-4 pl-0">
            <button onClick={onNavigateHome} className="text-slate-500 hover:text-primary transition-colors text-base font-medium leading-normal">
              Trang chủ
            </button>
            <span className="text-slate-400 text-base font-medium leading-normal">/</span>
            <span className="text-slate-700 dark:text-white text-base font-medium leading-normal">Sản phẩm</span>
          </nav>

          {/* Animated Hero Banner */}
          <section className="mb-8 rounded-2xl overflow-hidden relative group min-h-[320px] shadow-lg">
            {/* Background Slideshow */}
            {promoImages.length > 0 ? (
              promoImages.map((img, idx) => (
                <div 
                  key={img._id}
                  className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${idx === currentPromoIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.8) 100%), url("${img.url}")`
                  }}
                >
                </div>
              ))
            ) : (
               <div className="absolute inset-0 bg-gray-900 z-0"></div>
            )}

            <div className="relative z-10 flex min-h-[320px] flex-col gap-6 items-start justify-end px-6 pb-10 md:px-10">
              <div className="flex flex-col gap-2 text-left max-w-2xl animate-fade-in-up">
                <h1 className="text-white text-3xl md:text-5xl font-black leading-tight tracking-[-0.033em] drop-shadow-md">
                  Trải nghiệm trước, Mua sắm sau
                </h1>
                <p className="text-white/90 text-sm md:text-lg font-normal leading-relaxed drop-shadow-sm">
                  Đến ngay cửa hàng GameStore để trải nghiệm máy PS5, Switch và PC cấu hình cao mới nhất. Đặt lịch ngay hôm nay để nhận ưu đãi!
                </p>
              </div>
              <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-8 bg-primary hover:bg-primary-dark text-white text-base font-bold leading-normal tracking-wide transition-all shadow-lg shadow-primary/30 hover:-translate-y-1">
                <span className="truncate">Đặt lịch chơi ngay</span>
              </button>
            </div>
            
            {/* Slide Indicators */}
            <div className="absolute bottom-4 right-6 z-20 flex gap-1.5">
               {promoImages.map((_, idx) => (
                 <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentPromoIndex ? 'w-6 bg-primary' : 'w-1.5 bg-white/50'}`}></div>
               ))}
            </div>
          </section>

          {/* Page Layout: Sidebar + Grid */}
          <div className="flex flex-col lg:flex-row gap-8" id="product-grid-start">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-8 p-1">
                {/* Categories Filter */}
                <div>
                  <h3 className="text-slate-800 dark:text-white text-lg font-bold mb-4">Danh mục</h3>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer group select-none">
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.length === 0}
                        onChange={() => setSelectedCategories([])}
                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 dark:bg-gray-700 dark:border-gray-600 transition-colors" 
                      />
                      <span className="text-slate-600 dark:text-gray-300 text-base font-medium group-hover:text-primary transition-colors">Tất cả</span>
                    </label>
                    {categories.map(cat => (
                      <label key={cat._id} className="flex items-center gap-3 cursor-pointer group select-none">
                        <input 
                          type="checkbox" 
                          checked={selectedCategories.includes(cat.code)}
                          onChange={() => toggleCategory(cat.code)}
                          className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 dark:bg-gray-700 dark:border-gray-600 transition-colors" 
                        />
                        <span className="text-slate-600 dark:text-gray-300 text-base font-medium group-hover:text-primary transition-colors">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-slate-800 dark:text-white text-lg font-bold mb-4">Khoảng giá</h3>
                  <div className="flex flex-col gap-4">
                    <input 
                      type="range" 
                      min="0" 
                      max={MAX_PRICE_RANGE} 
                      step="500000"
                      value={priceRange}
                      onChange={handlePriceChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary" 
                    />
                    <div className="flex justify-between text-sm text-slate-500 font-medium">
                      <span>0đ</span>
                      <span>{priceRange >= MAX_PRICE_RANGE ? 'Tất cả' : `${(priceRange / 1000000).toFixed(1)}Tr+`}</span>
                    </div>
                    <div className="text-sm text-slate-700 dark:text-gray-300">
                      Tối đa: <span className="font-bold text-primary">{priceRange.toLocaleString('vi-VN')}đ</span>
                    </div>
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-slate-800 dark:text-white text-lg font-bold mb-4">Thương hiệu</h3>
                  <div className="flex flex-wrap gap-2">
                    {brands.map(brand => (
                      <div 
                        key={brand._id} 
                        onClick={() => toggleBrand(brand.name)}
                        className={`px-3 py-1.5 rounded-full border text-sm font-medium cursor-pointer transition-colors ${
                          selectedBrands.includes(brand.name)
                            ? 'bg-primary border-primary text-white'
                            : 'border-gray-200 dark:border-gray-700 text-slate-600 dark:text-gray-300 bg-white dark:bg-slate-800 hover:border-primary hover:text-primary'
                        }`}
                      >
                        {brand.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Product List Area */}
            <div className="flex-1">
              {/* Top Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                   {searchQuery ? (
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                        Kết quả: "{searchQuery}"
                      </h2>
                      {onClearSearch && (
                        <button 
                          onClick={onClearSearch}
                          className="text-xs font-bold text-red-500 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                   ) : (
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Danh sách sản phẩm</h2>
                   )}
                  <p className="text-slate-500 text-sm mt-1">
                    Hiển thị {products.length} trên tổng số {totalItems} sản phẩm
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-600 dark:text-white whitespace-nowrap">Sắp xếp:</span>
                  <div className="relative">
                    <select 
                      value={sortOption}
                      onChange={handleSortChange}
                      className="form-select block w-full pl-3 pr-10 py-2.5 text-sm border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl bg-white text-slate-600 cursor-pointer shadow-sm dark:bg-slate-800 dark:border-gray-700 dark:text-white transition-all"
                    >
                        <option value="popular">Phổ biến nhất</option>
                        <option value="newest">Mới nhất</option>
                        <option value="price_asc">Giá: Thấp đến cao</option>
                        <option value="price_desc">Giá: Cao đến thấp</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Chips Quick Filter (Synced with selectedCategories) */}
              <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                <button 
                  onClick={() => setSelectedCategories([])}
                  className={`flex h-9 shrink-0 items-center justify-center px-5 rounded-full text-sm font-medium transition-all ${
                    selectedCategories.length === 0 
                    ? 'bg-primary text-white shadow-md shadow-primary/20' 
                    : 'bg-white border border-gray-200 text-slate-600 hover:border-primary hover:text-primary'
                  }`}
                >
                  Tất cả
                </button>
                {/* Demo Quick Chips mapping to specific known category codes */}
                <button 
                  onClick={() => toggleCategory('PLAYSTATION')}
                  className={`flex h-9 shrink-0 items-center justify-center px-5 rounded-full text-sm font-medium transition-all ${
                    selectedCategories.includes('PLAYSTATION')
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-white border border-gray-200 text-slate-600 hover:border-primary hover:text-primary'
                  }`}
                >
                  PlayStation
                </button>
                <button 
                  onClick={() => toggleCategory('NINTENDO')}
                   className={`flex h-9 shrink-0 items-center justify-center px-5 rounded-full text-sm font-medium transition-all ${
                    selectedCategories.includes('NINTENDO')
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-white border border-gray-200 text-slate-600 hover:border-primary hover:text-primary'
                  }`}
                >
                  Nintendo
                </button>
                <button 
                  onClick={() => toggleCategory('TCG')}
                   className={`flex h-9 shrink-0 items-center justify-center px-5 rounded-full text-sm font-medium transition-all ${
                    selectedCategories.includes('TCG')
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-white border border-gray-200 text-slate-600 hover:border-primary hover:text-primary'
                  }`}
                >
                  Thẻ Bài
                </button>
              </div>

              {/* Product Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {[1,2,3,4,5,6].map(i => (
                     <div key={i} className="aspect-[4/3] bg-gray-200 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <article 
                      key={product._id} 
                      onClick={() => onNavigateProduct && onNavigateProduct(product._id)}
                      className="group bg-white dark:bg-[#1a2632] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
                    >
                      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                        {product.tags && product.tags.length > 0 && (
                          <span className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm z-10 tracking-wide ${
                            product.tags.includes('HOT') ? 'bg-red-500' : 
                            product.tags.includes('PRE-ORDER') ? 'bg-slate-800' : 'bg-primary'
                          }`}>
                            {product.tags[0]}
                          </span>
                        )}
                        <img 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          src={product.image} 
                        />
                        <button className="absolute bottom-3 right-3 bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-lg text-slate-700 dark:text-white hover:text-primary hover:bg-gray-50 transition-all translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300">
                          <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                        </button>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="text-[11px] text-primary font-bold mb-1.5 uppercase tracking-wider">{product.category}</div>
                        <h3 className="text-slate-800 dark:text-white text-base font-bold leading-snug mb-2 line-clamp-2 min-h-[42px] group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mb-4">
                          <div className="flex text-yellow-400">
                             {/* Render stars based on rating */}
                             {Array.from({ length: 5 }).map((_, i) => (
                               <span key={i} className={`material-symbols-outlined text-[16px] ${i < Math.round(product.rating || 5) ? 'filled' : 'text-gray-300'}`} style={i < Math.round(product.rating || 5) ? {fontVariationSettings: "'FILL' 1"} : {}}>star</span>
                             ))}
                          </div>
                          <span className="text-xs font-medium text-slate-400">({product.reviewCount || 0} đánh giá)</span>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800">
                          <span className="text-slate-900 dark:text-white text-lg font-extrabold">{product.price.toLocaleString('vi-VN')}₫</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="size-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-4xl text-gray-400">filter_list_off</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy sản phẩm</h3>
                  <p className="text-slate-500 max-w-md">
                    Không có sản phẩm nào phù hợp với bộ lọc hiện tại. Hãy thử điều chỉnh hoặc xóa bộ lọc.
                  </p>
                  <button 
                    onClick={() => {
                      setSelectedCategories([]);
                      setSelectedBrands([]);
                      setPriceRange(MAX_PRICE_RANGE);
                      if(onClearSearch) onClearSearch();
                    }}
                    className="mt-6 px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Xóa toàn bộ lọc
                  </button>
                </div>
              )}

              {/* Pagination */}
              {products.length > 0 && totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center gap-2">
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                    </button>
                    
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      // Simple logic to show some pages, improved logic can be added for many pages
                      if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                         return (
                            <button 
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold transition-all shadow-sm ${
                                currentPage === pageNum
                                  ? 'bg-primary text-white shadow-primary/20'
                                  : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary'
                              }`}
                            >
                              {pageNum}
                            </button>
                         );
                      } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                        return <span key={pageNum} className="flex h-10 w-10 items-center justify-center text-slate-400">...</span>
                      }
                      return null;
                    })}

                    <button 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>

          {/* SEO / About Section */}
          <section className="mt-20 border-t border-gray-200 dark:border-gray-700 pt-10 pb-10">
            <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Thế giới Game & Đồ chơi hàng đầu</h2>
            <div className="prose dark:prose-invert max-w-none text-slate-500 dark:text-gray-400 leading-relaxed">
              <p className="mb-4">
                Chào mừng bạn đến với GameStore, điểm đến lý tưởng cho những tín đồ đam mê game tại Việt Nam. Chúng tôi tự hào cung cấp đa dạng các sản phẩm từ máy chơi game console như PS5, Nintendo Switch, Xbox Series X cho đến các loại thẻ bài game (TCG) hot nhất như Pokemon, Yugioh.
              </p>
              <p>
                Không chỉ bán hàng, GameStore còn mang đến dịch vụ <strong>đặt lịch chơi game</strong> độc đáo. Bạn có thể đến trực tiếp cửa hàng để trải nghiệm những tựa game mới nhất trên dàn máy cấu hình khủng trước khi quyết định mua. Chúng tôi cam kết mang lại không gian giải trí lành mạnh, hiện đại và thân thiện nhất cho cộng đồng game thủ.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;