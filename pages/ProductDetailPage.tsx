import React, { useEffect, useState, useRef } from 'react';
import { DataService } from '../backend/api';
import { Product, CartItem } from '../shared/types';

interface ProductDetailPageProps {
  productId: string;
  onNavigateHome: () => void;
  onNavigateProducts?: () => void;
  onNavigateProduct: (id: string) => void;
  onNavigateBooking?: () => void;
  onAddToCart?: (item: CartItem) => void; // Update prop signature
}

interface FlyingItem {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  image: string;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ 
  productId, 
  onNavigateHome, 
  onNavigateProducts, 
  onNavigateProduct,
  onNavigateBooking,
  onAddToCart 
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'policy'>('desc');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // State for selections
  const [selectedColor, setSelectedColor] = useState<string>('');

  // Animation State
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Load product data
  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      const prod = await DataService.getProductById(productId);
      if (prod) {
        setProduct(prod);
        setActiveImage(prod.images && prod.images.length > 0 ? prod.images[0] : prod.image);
        
        // Initialize default selections
        if (prod.colors && prod.colors.length > 0) {
          setSelectedColor(prod.colors[0].name);
        }
        setQuantity(1);

        // Load related items
        const related = await DataService.getRelatedProducts(prod.category, prod._id);
        setRelatedProducts(related);
      }
      setLoading(false);
    };
    loadData();
    window.scrollTo(0, 0);
  }, [productId]);

  const handleAddToCartClick = (e: React.MouseEvent) => {
    if (!product) return;

    // 1. Get Coordinates for Animation
    const cartBtn = document.getElementById('header-cart-btn');
    const addBtn = buttonRef.current;

    if (cartBtn && addBtn) {
      const cartRect = cartBtn.getBoundingClientRect();
      const btnRect = addBtn.getBoundingClientRect();

      const newItem: FlyingItem = {
        id: Date.now(),
        startX: btnRect.left + btnRect.width / 2 - 32, 
        startY: btnRect.top + btnRect.height / 2 - 32,
        targetX: cartRect.left + cartRect.width / 2 - 32,
        targetY: cartRect.top + cartRect.height / 2 - 32,
        image: activeImage || product.image
      };

      setFlyingItems(prev => [...prev, newItem]);

      // 2. Remove item after animation and Add to Cart
      setTimeout(() => {
        setFlyingItems(prev => prev.filter(item => item.id !== newItem.id));
        if (onAddToCart) {
          // Construct CartItem Object
          const cartItem: CartItem = {
            productId: product._id,
            name: product.name,
            price: product.price,
            image: activeImage || product.image,
            quantity: quantity,
            selectedColor: selectedColor || undefined,
            maxStock: product.stock || 0
          };
          onAddToCart(cartItem);
        }
      }, 800);
    } else {
      // Fallback
      if (onAddToCart) {
         const cartItem: CartItem = {
            productId: product._id,
            name: product.name,
            price: product.price,
            image: activeImage || product.image,
            quantity: quantity,
            selectedColor: selectedColor || undefined,
            maxStock: product.stock || 0
          };
        onAddToCart(cartItem);
      }
    }
  };

  const currentStock = product?.stock || 0;

  if (loading) {
    return (
      <div className="flex-1 w-full min-h-screen bg-white dark:bg-[#101922] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-1 w-full min-h-screen bg-white dark:bg-[#101922] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Không tìm thấy sản phẩm</h2>
        <button onClick={onNavigateHome} className="text-primary font-bold hover:underline">Quay về trang chủ</button>
      </div>
    );
  }

  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="bg-gray-50 dark:bg-[#101922] min-h-screen flex flex-col w-full relative">
      
      {/* Dynamic Flying Items */}
      {flyingItems.map(item => (
        <div 
          key={item.id}
          className="fixed z-[100] w-16 h-16 rounded-full overflow-hidden shadow-2xl border-2 border-white pointer-events-none"
          style={{
            left: 0,
            top: 0,
            backgroundImage: `url('${item.image}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            // @ts-ignore
            '--start-x': `${item.startX}px`,
            '--start-y': `${item.startY}px`,
            '--target-x': `${item.targetX}px`,
            '--target-y': `${item.targetY}px`,
            animation: 'parabolic-fly 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards'
          }}
        >
        </div>
      ))}
      <style>{`
        @keyframes parabolic-fly {
          0% {
            transform: translate(var(--start-x), var(--start-y)) scale(1);
            opacity: 1;
          }
          60% {
             transform: translate(calc(var(--start-x) + (var(--target-x) - var(--start-x)) * 0.5), calc(var(--target-y) - 100px)) scale(0.8);
          }
          100% {
            transform: translate(var(--target-x), var(--target-y)) scale(0.1);
            opacity: 0.5;
          }
        }
      `}</style>

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex mb-6 text-sm font-medium text-gray-500 dark:text-gray-400">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <button onClick={onNavigateHome} className="hover:text-primary transition-colors">Trang chủ</button>
            </li>
            <li>
              <div className="flex items-center">
                <span className="material-symbols-outlined text-sm mx-1">chevron_right</span>
                <button onClick={onNavigateProducts} className="hover:text-primary transition-colors">Sản phẩm</button>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-sm mx-1">chevron_right</span>
                <span className="text-gray-900 dark:text-white line-clamp-1">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column: Images */}
          <div className="space-y-4">
            <div className="aspect-[4/3] w-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm relative group">
              <div 
                className="w-full h-full bg-center bg-contain bg-no-repeat transition-all duration-300" 
                style={{ backgroundImage: `url('${activeImage}')` }}
              ></div>
              <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full shadow-sm hover:scale-110 transition-transform text-gray-700">
                <span className="material-symbols-outlined fill-current">favorite</span>
              </button>
              {galleryImages.length > 0 && (
                 <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                    <span>Xem {galleryImages.length} ảnh</span>
                 </div>
              )}
            </div>
            {/* Thumbnails Carousel */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
              {galleryImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`snap-start shrink-0 w-24 h-24 rounded-lg border-2 overflow-hidden transition-all ${activeImage === img ? 'border-primary' : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'}`}
                >
                  <div 
                    className="w-full h-full bg-center bg-cover" 
                    style={{ backgroundImage: `url('${img}')` }}
                  ></div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Info & Actions */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">Chính hãng</span>
                {currentStock > 0 ? (
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">Còn hàng ({currentStock})</span>
                ) : (
                  <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">Hết hàng</span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-0.5 text-yellow-400">
                   {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`material-symbols-outlined text-[20px] ${i < Math.round(product.rating || 5) ? 'filled' : 'text-gray-300'}`} style={i < Math.round(product.rating || 5) ? {fontVariationSettings: "'FILL' 1"} : {}}>star</span>
                   ))}
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 underline cursor-pointer">{product.rating} ({product.reviewCount} đánh giá)</span>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-primary">{product.price.toLocaleString('vi-VN')}₫</span>
                {product.originalPrice && (
                    <>
                        <span className="text-lg text-gray-400 line-through">{product.originalPrice.toLocaleString('vi-VN')}₫</span>
                        <span className="text-sm text-red-500 font-medium">-{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>
                    </>
                )}
              </div>

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-4 mb-6">
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                      Màu sắc: <span className="text-gray-500 font-normal">{selectedColor}</span>
                    </span>
                    <div className="flex gap-3">
                      {product.colors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={`w-10 h-10 rounded-full border shadow-sm transition-all ${
                            selectedColor === color.name 
                            ? 'ring-2 ring-offset-2 ring-primary border-transparent transform scale-110' 
                            : 'border-gray-200 dark:border-gray-600 hover:ring-2 hover:ring-offset-1 hover:ring-gray-300'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        ></button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 h-12">
                  <div className="w-32 flex items-center justify-between border border-gray-200 dark:border-gray-600 rounded-lg px-3 bg-gray-50 dark:bg-gray-900">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                      disabled={quantity <= 1}
                      className="text-gray-500 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-[20px]">remove</span>
                    </button>
                    <span className="font-medium text-gray-900 dark:text-white">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(currentStock, quantity + 1))} 
                      disabled={quantity >= currentStock}
                      className="text-gray-500 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                  </div>
                  <button 
                    ref={buttonRef}
                    onClick={handleAddToCartClick}
                    disabled={currentStock === 0}
                    className="flex-1 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/30 disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed active:scale-95"
                  >
                    <span className="material-symbols-outlined">shopping_cart_checkout</span>
                    {currentStock > 0 ? "Thêm vào giỏ hàng" : "Tạm hết hàng"}
                  </button>
                </div>
                <button 
                  onClick={onNavigateBooking}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold h-12 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-primary">calendar_clock</span>
                  Đặt lịch chơi thử tại cửa hàng (30k/giờ)
                </button>
              </div>
            </div>

            {/* Short Benefits */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="material-symbols-outlined text-primary mt-0.5">verified_user</span>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Bảo hành 12 tháng</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Chính hãng Việt Nam</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="material-symbols-outlined text-green-600 mt-0.5">local_shipping</span>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Miễn phí vận chuyển</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Cho đơn hàng trên 2tr</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section Tabs */}
        <div className="mb-16">
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex gap-8 overflow-x-auto">
              <button 
                onClick={() => setActiveTab('desc')}
                className={`pb-4 border-b-2 font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'desc' ? 'border-primary text-primary' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
              >
                Mô tả sản phẩm
              </button>
              <button 
                onClick={() => setActiveTab('specs')}
                className={`pb-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'specs' ? 'border-primary text-primary font-bold' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
              >
                Thông số kỹ thuật
              </button>
              <button 
                onClick={() => setActiveTab('policy')}
                className={`pb-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'policy' ? 'border-primary text-primary font-bold' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
              >
                Chính sách đổi trả
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 text-gray-600 dark:text-gray-300 leading-relaxed">
              {activeTab === 'desc' && (
                <div className="animate-fade-in-up">
                    <p className="mb-6 text-lg">{product.description || "Đang cập nhật mô tả..."}</p>
                    {product.features && product.features.length > 0 && (
                        <>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Đặc điểm nổi bật</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                {product.features.map((feature, i) => (
                                    <li key={i} dangerouslySetInnerHTML={{ __html: `<strong>${feature.split(':')[0]}:</strong>${feature.split(':').slice(1).join(':')}` }}></li>
                                ))}
                            </ul>
                        </>
                    )}
                    <div className="mt-8 rounded-xl overflow-hidden h-80 relative">
                        <div className="absolute inset-0 bg-center bg-cover" style={{backgroundImage: `url('${product.images?.[2] || product.image}')`}}></div>
                    </div>
                </div>
              )}
              {activeTab === 'specs' && (
                  <div className="animate-fade-in-up">
                      <table className="w-full text-sm text-left">
                          <tbody>
                              <tr className="border-b border-gray-100 dark:border-gray-700">
                                  <td className="py-3 font-medium text-gray-900 dark:text-white w-1/3">Thương hiệu</td>
                                  <td className="py-3">{product.brand}</td>
                              </tr>
                              <tr className="border-b border-gray-100 dark:border-gray-700">
                                  <td className="py-3 font-medium text-gray-900 dark:text-white w-1/3">Loại sản phẩm</td>
                                  <td className="py-3">{product.category}</td>
                              </tr>
                               <tr className="border-b border-gray-100 dark:border-gray-700">
                                  <td className="py-3 font-medium text-gray-900 dark:text-white w-1/3">Mã sản phẩm</td>
                                  <td className="py-3">{product.slug}</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              )}
               {activeTab === 'policy' && (
                  <div className="animate-fade-in-up">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">Điều kiện đổi trả</h3>
                      <p className="mb-4">Khách hàng có thể đổi trả trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm bị lỗi do nhà sản xuất.</p>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">Quy trình</h3>
                      <ol className="list-decimal pl-5 space-y-2">
                          <li>Liên hệ hotline chăm sóc khách hàng.</li>
                          <li>Gửi video quay lại tình trạng lỗi.</li>
                          <li>Gửi sản phẩm về trung tâm bảo hành.</li>
                      </ol>
                  </div>
              )}
            </div>

            {/* Related Products Sidebar */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Thường mua cùng</h3>
              <div className="flex flex-col gap-4">
                {relatedProducts.length > 0 ? relatedProducts.map(rp => (
                    <div key={rp._id} onClick={() => onNavigateProduct(rp._id)} className="flex gap-4 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700 group cursor-pointer">
                        <div className="w-20 h-20 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                            <div className="w-full h-full bg-center bg-cover" style={{ backgroundImage: `url('${rp.image}')` }}></div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">{rp.name}</h4>
                            <p className="text-primary font-bold text-sm mt-1">{rp.price.toLocaleString('vi-VN')}₫</p>
                            <button className="mt-2 text-xs font-medium text-gray-500 hover:text-primary flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">add_shopping_cart</span> Thêm
                            </button>
                        </div>
                    </div>
                )) : <p className="text-sm text-gray-500">Chưa có sản phẩm gợi ý.</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Rating & Reviews */}
        {product.reviews && product.reviews.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Đánh giá từ khách hàng</h2>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-12">
              {/* Summary */}
              <div className="md:w-1/3 flex flex-col justify-center">
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-5xl font-black text-gray-900 dark:text-white">{product.rating}</span>
                  <span className="text-gray-500 dark:text-gray-400 mb-1">/ 5</span>
                </div>
                <div className="flex text-yellow-400 mb-2">
                   {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`material-symbols-outlined fill-current ${i < Math.round(product.rating || 5) ? '' : 'text-gray-300'}`}>star</span>
                   ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Dựa trên {product.reviewCount} đánh giá</p>
                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="w-3 text-gray-600 dark:text-gray-300 font-medium">5</span>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[78%]"></div>
                    </div>
                    <span className="w-8 text-right text-gray-500">78%</span>
                  </div>
                   {/* Simplified mock bars for other stars */}
                  <div className="flex items-center gap-3 text-sm">
                    <span className="w-3 text-gray-600 dark:text-gray-300 font-medium">4</span>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[15%]"></div>
                    </div>
                    <span className="w-8 text-right text-gray-500">15%</span>
                  </div>
                </div>
                <button className="mt-6 w-full py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-bold text-gray-700 dark:text-white hover:bg-white dark:hover:bg-gray-700 transition-colors">Viết đánh giá</button>
              </div>
              
              {/* Reviews List */}
              <div className="flex-1 space-y-6">
                {product.reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                {review.avatar ? (
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                        <div className="w-full h-full bg-center bg-cover" style={{ backgroundImage: `url('${review.avatar}')` }}></div>
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">{review.user.charAt(0)}</div>
                                )}
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{review.user}</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="flex text-yellow-400 text-[12px]">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <span key={i} className={`material-symbols-outlined text-[16px] fill-current ${i < review.rating ? '' : 'text-gray-300'}`}>star</span>
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-400">{review.date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{review.content}</p>
                        {review.image && (
                            <div className="mt-3 flex gap-2">
                                <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden cursor-pointer hover:opacity-80">
                                    <div className="w-full h-full bg-center bg-cover" style={{ backgroundImage: `url('${review.image}')` }}></div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        )}
      </main>

      {/* Sticky Mobile Action Bar (Visible only on small screens) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 lg:hidden z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex gap-3">
            <button 
                onClick={onNavigateBooking}
                className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 hover:text-primary"
            >
                <span className="material-symbols-outlined">calendar_clock</span>
            </button>
            <button 
                onClick={handleAddToCartClick}
                disabled={currentStock === 0}
                className="flex-1 bg-primary text-white font-bold rounded-lg h-12 shadow-lg shadow-blue-500/30 disabled:bg-gray-400"
            >
                {currentStock > 0 ? `Thêm vào giỏ - ${product.price.toLocaleString('vi-VN')}₫` : "Tạm hết hàng"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;