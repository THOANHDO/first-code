import React, { useEffect, useState } from 'react';
import { CartItem, Product, Coupon } from '../shared/types';
import { DataService } from '../backend/api';

interface CartPageProps {
  items: CartItem[];
  onNavigateHome: () => void;
  onNavigateProducts: () => void;
  onUpdateQuantity: (productId: string, selectedColor: string | undefined, newQuantity: number) => void;
  onRemoveItem: (productId: string, selectedColor: string | undefined) => void;
  onAddToCart: (item: CartItem) => void;
  onCheckout: () => void; // Added Prop
}

const CartPage: React.FC<CartPageProps> = ({ 
  items, 
  onNavigateHome, 
  onNavigateProducts,
  onUpdateQuantity,
  onRemoveItem,
  onAddToCart,
  onCheckout
}) => {
  const [crossSellProducts, setCrossSellProducts] = useState<Product[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Fetch cross-sell products on mount
  useEffect(() => {
    DataService.getCrossSellProducts().then(setCrossSellProducts);
  }, []);

  // Reset coupon if items change significantly (optional logic, kept simple here)
  useEffect(() => {
    if (items.length === 0) setAppliedCoupon(null);
  }, [items.length]);

  // Calculations
  const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'PERCENT') {
        discountAmount = (subTotal * appliedCoupon.discount) / 100;
        // Optional: Cap max discount if needed, based on coupon description/logic
        if (appliedCoupon.code === 'GAME10' && discountAmount > 500000) discountAmount = 500000;
    } else {
        discountAmount = appliedCoupon.discount;
    }
  }
  // Ensure discount doesn't exceed total
  if (discountAmount > subTotal) discountAmount = subTotal;

  const totalAmount = subTotal - discountAmount;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Format Currency Helper
  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + 'đ';

  const handleAddCrossSell = (product: Product) => {
    const item: CartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      maxStock: product.stock || 100,
      type: 'PRODUCT'
    };
    onAddToCart(item);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    setIsValidatingCoupon(true);

    try {
        const result = await DataService.checkCoupon(couponCode.trim());
        if (result.success && result.data) {
            // Check min order value if exists
            if (result.data.minOrderValue && subTotal < result.data.minOrderValue) {
                setCouponError(`Đơn hàng tối thiểu ${formatPrice(result.data.minOrderValue)}`);
                setAppliedCoupon(null);
            } else {
                setAppliedCoupon(result.data);
                setCouponCode(''); // Clear input on success
            }
        } else {
            setCouponError(result.message || 'Mã giảm giá không hợp lệ');
            setAppliedCoupon(null);
        }
    } catch (err) {
        setCouponError('Lỗi kiểm tra mã giảm giá');
    } finally {
        setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  if (items.length === 0) {
    return (
      <div className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-40 py-20 text-center">
        <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-6xl text-gray-300">shopping_cart_off</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Giỏ hàng của bạn đang trống</h2>
            <p className="text-slate-500 mb-8">Hãy dạo một vòng cửa hàng để tìm những món đồ ưng ý nhé!</p>
            <button 
                onClick={onNavigateProducts}
                className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1"
            >
                Tiếp tục mua sắm
            </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-40 py-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex mb-6">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                    <button onClick={onNavigateHome} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors">
                        Trang chủ
                    </button>
                </li>
                <li>
                    <div className="flex items-center">
                        <span className="material-symbols-outlined text-slate-400 text-sm mx-1">chevron_right</span>
                        <button onClick={onNavigateProducts} className="ml-1 text-sm font-medium text-slate-500 hover:text-primary md:ml-2 dark:text-gray-400 dark:hover:text-white transition-colors">Sản phẩm</button>
                    </div>
                </li>
                <li aria-current="page">
                    <div className="flex items-center">
                        <span className="material-symbols-outlined text-slate-400 text-sm mx-1">chevron_right</span>
                        <span className="ml-1 text-sm font-medium text-slate-900 md:ml-2 dark:text-gray-200">Giỏ hàng</span>
                    </div>
                </li>
            </ol>
        </nav>

        {/* Page Heading */}
        <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Giỏ hàng của bạn</h1>
            <p className="text-slate-500 dark:text-gray-400">Bạn đang có <span className="font-bold text-primary">{totalItems} sản phẩm</span> trong giỏ hàng.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Cart Items List (Left Column) */}
            <div className="flex-1 w-full space-y-4">
                
                {items.map((item) => (
                    <div key={`${item.productId}-${item.selectedColor || 'default'}`} className="bg-white dark:bg-[#1A2633] rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-[#2A3B4D] flex flex-col sm:flex-row gap-6 transition-all hover:shadow-md">
                        <div className="shrink-0 relative group">
                            <div className="w-full sm:w-[120px] aspect-square rounded-lg bg-gray-100 dark:bg-[#2A3B4D] overflow-hidden flex items-center justify-center">
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                />
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-between gap-4">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1">{item.name}</h3>
                                    <div className="flex flex-wrap gap-2 text-sm text-slate-500 dark:text-gray-400">
                                        <span className="bg-gray-100 dark:bg-[#2A3B4D] px-2 py-0.5 rounded text-xs font-medium">Phiên bản Quốc tế</span>
                                        {item.selectedColor && (
                                            <span className="bg-gray-100 dark:bg-[#2A3B4D] px-2 py-0.5 rounded text-xs font-medium">Màu: {item.selectedColor}</span>
                                        )}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => onRemoveItem(item.productId, item.selectedColor)}
                                    aria-label="Xóa sản phẩm" 
                                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                            </div>
                            <div className="flex flex-wrap items-end justify-between gap-4">
                                <div className="flex items-center border border-gray-200 dark:border-[#2A3B4D] rounded-lg bg-gray-50 dark:bg-[#2A3B4D] h-10 w-fit">
                                    <button 
                                        onClick={() => onUpdateQuantity(item.productId, item.selectedColor, item.quantity - 1)}
                                        className="w-9 h-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#36495d] rounded-l-lg transition-colors text-slate-600 dark:text-white"
                                    >-</button>
                                    <input 
                                        type="number" 
                                        value={item.quantity}
                                        readOnly
                                        className="w-12 text-center bg-transparent border-none p-0 text-slate-900 dark:text-white font-medium focus:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <button 
                                        onClick={() => onUpdateQuantity(item.productId, item.selectedColor, item.quantity + 1)}
                                        className="w-9 h-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#36495d] rounded-r-lg transition-colors text-slate-600 dark:text-white"
                                    >+</button>
                                </div>
                                <div className="text-right">
                                    <p className="text-primary font-bold text-xl">{formatPrice(item.price)}</p>
                                    {/* Mock original price logic just for visual compatibility with example */}
                                    <p className="text-xs text-slate-400 line-through">{formatPrice(item.price * 1.1)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Suggested Products Carousel Area */}
                {crossSellProducts.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-dashed border-gray-200 dark:border-[#2A3B4D]">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Mua thêm ưu đãi</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {crossSellProducts.map(product => (
                                <div 
                                    key={product._id} 
                                    onClick={() => handleAddCrossSell(product)}
                                    className="bg-white dark:bg-[#1A2633] rounded-lg p-3 border border-gray-100 dark:border-[#2A3B4D] hover:border-primary/50 transition-colors group cursor-pointer"
                                >
                                    <div className="aspect-square bg-gray-50 dark:bg-[#2A3B4D] rounded mb-2 overflow-hidden">
                                        <img 
                                            src={product.image} 
                                            alt={product.name} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                                        />
                                    </div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2 h-10">{product.name}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-sm font-bold text-primary">{formatPrice(product.price)}</span>
                                        <button className="text-primary hover:bg-primary/10 rounded-full p-1">
                                            <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Order Summary (Right Column - Sticky) */}
            <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-24">
                <div className="bg-white dark:bg-[#1A2633] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-[#2A3B4D]">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Tổng đơn hàng</h3>
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-slate-500 dark:text-gray-400">
                            <span>Tạm tính</span>
                            <span className="font-medium text-slate-900 dark:text-white">{formatPrice(subTotal)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500 dark:text-gray-400">
                            <span>Phí vận chuyển</span>
                            <span className="font-medium text-green-600">Miễn phí</span>
                        </div>
                        
                        {/* Discount Display */}
                        {appliedCoupon ? (
                            <div className="flex justify-between text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg border border-green-100 dark:border-green-800/30">
                                <span className="font-medium flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">sell</span>
                                    {appliedCoupon.code}
                                </span>
                                <span className="font-bold">-{formatPrice(discountAmount)}</span>
                            </div>
                        ) : (
                            <div className="flex justify-between text-slate-500 dark:text-gray-400">
                                <span>Giảm giá</span>
                                <span className="font-medium text-slate-900 dark:text-white">0đ</span>
                            </div>
                        )}

                        <div className="pt-4 border-t border-dashed border-gray-200 dark:border-[#2A3B4D]">
                            <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-2">Mã giảm giá</label>
                            
                            {appliedCoupon ? (
                                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                                    <div className="text-sm">
                                        <p className="font-bold text-blue-700 dark:text-blue-300">{appliedCoupon.code}</p>
                                        <p className="text-blue-600/80 dark:text-blue-400/80 text-xs">{appliedCoupon.description}</p>
                                    </div>
                                    <button 
                                        onClick={handleRemoveCoupon} 
                                        className="text-gray-400 hover:text-red-500 p-1"
                                        title="Bỏ mã giảm giá"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">close</span>
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex gap-2">
                                        <input 
                                            className="flex-1 rounded-lg border-gray-200 bg-gray-50 dark:bg-[#2A3B4D] dark:border-none focus:ring-primary focus:border-primary text-sm dark:text-white p-2.5 border" 
                                            placeholder="Nhập mã (VD: GAME10)" 
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                        />
                                        <button 
                                            onClick={handleApplyCoupon}
                                            disabled={isValidatingCoupon || !couponCode}
                                            className="px-4 py-2 bg-gray-100 dark:bg-[#36495d] hover:bg-gray-200 dark:hover:bg-[#4a627a] text-slate-900 dark:text-white font-semibold text-sm rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            {isValidatingCoupon ? '...' : 'Áp dụng'}
                                        </button>
                                    </div>
                                    {couponError && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span>{couponError}</p>}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between items-end mb-6 pt-4 border-t border-gray-100 dark:border-[#2A3B4D]">
                        <span className="text-lg font-bold text-slate-900 dark:text-white">Tổng cộng</span>
                        <div className="text-right">
                            <span className="block text-2xl font-extrabold text-primary">{formatPrice(totalAmount)}</span>
                            <span className="text-xs text-slate-500 dark:text-gray-400">(Đã bao gồm VAT)</span>
                        </div>
                    </div>
                    <button 
                        onClick={onCheckout}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mb-4"
                    >
                        <span>Tiến hành thanh toán</span>
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                    <button 
                        onClick={onNavigateProducts}
                        className="block w-full text-center text-sm font-medium text-slate-500 hover:text-primary dark:text-gray-400 transition-colors"
                    >
                        Tiếp tục mua sắm
                    </button>

                    {/* Trust Badges */}
                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-[#2A3B4D] grid grid-cols-3 gap-2 text-center">
                        <div className="flex flex-col items-center gap-1">
                            <span className="material-symbols-outlined text-green-500 text-2xl">verified_user</span>
                            <span className="text-[10px] text-slate-500 dark:text-gray-500 font-medium">Bảo mật 100%</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <span className="material-symbols-outlined text-blue-500 text-2xl">local_shipping</span>
                            <span className="text-[10px] text-slate-500 dark:text-gray-500 font-medium">Giao siêu tốc</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <span className="material-symbols-outlined text-orange-500 text-2xl">published_with_changes</span>
                            <span className="text-[10px] text-slate-500 dark:text-gray-500 font-medium">Đổi trả 7 ngày</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
};

export default CartPage;