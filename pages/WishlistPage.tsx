import React, { useEffect, useState } from 'react';
import { User, Product, CartItem } from '../shared/types';
import { DataService } from '../backend/api';
import ProfileSidebar from '../components/profile/ProfileSidebar';

interface WishlistPageProps {
  user: User;
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateOrders: () => void;
  onNavigateBookings: () => void;
  onNavigateAddressBook: () => void; // Added
  onNavigateProduct: (id: string) => void;
  onNavigateProducts: () => void;
  onAddToCart: (item: CartItem) => void;
  onLogout: () => void;
  onRemoveFromWishlist: (productId: string) => void; // Trigger update in parent
}

const WishlistPage: React.FC<WishlistPageProps> = ({ 
    user, 
    onNavigateHome, 
    onNavigateProfile,
    onNavigateOrders,
    onNavigateBookings,
    onNavigateAddressBook,
    onNavigateProduct,
    onNavigateProducts,
    onAddToCart,
    onLogout,
    onRemoveFromWishlist
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial Fetch Only on Mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await DataService.getWishlistProducts(user._id);
      setProducts(data);
      setLoading(false);
    };
    fetchData();
  }, [user._id]); 

  // Watch for changes in user.wishlist (removals) and update local list efficiently without triggering full loading state
  useEffect(() => {
      if (!loading && user.wishlist) {
          // Filter current product list to keep only those still in user.wishlist
          setProducts(prevProducts => prevProducts.filter(p => user.wishlist?.includes(p._id)));
      }
  }, [user.wishlist, loading]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const item: CartItem = {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        maxStock: product.stock || 10,
        type: 'PRODUCT'
    };
    onAddToCart(item);
  };

  const handleRemove = (e: React.MouseEvent, productId: string) => {
      e.stopPropagation();
      onRemoveFromWishlist(productId);
      // Optimistically remove from local list while parent updates
      setProducts(prev => prev.filter(p => p._id !== productId));
  };

  const handleSidebarNavigate = (page: string) => {
    if (page === 'profile') onNavigateProfile();
    if (page === 'orders') onNavigateOrders();
    if (page === 'bookings') onNavigateBookings();
    if (page === 'address-book') onNavigateAddressBook();
  };

  return (
    <div className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-10 py-6 lg:py-10 font-sans">
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        <ProfileSidebar 
            user={user} 
            activePage="wishlist" 
            onNavigate={handleSidebarNavigate} 
            onLogout={onLogout} 
        />

        <main className="flex-1 flex flex-col min-w-0">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
                <button onClick={onNavigateHome} className="text-gray-500 hover:text-primary transition-colors">Trang chủ</button>
                <span className="text-gray-400">/</span>
                <button onClick={onNavigateProfile} className="text-gray-500 hover:text-primary transition-colors">Tài khoản</button>
                <span className="text-gray-400">/</span>
                <span className="text-[#111418] dark:text-white font-medium">Sản phẩm yêu thích</span>
            </div>

            {/* Page Heading */}
            <div className="mb-6">
                <h1 className="text-[#111418] dark:text-white text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Danh sách yêu thích</h1>
                <p className="text-gray-500 dark:text-gray-400 text-base">Lưu lại những món đồ bạn quan tâm để mua sau.</p>
            </div>

            {/* Product Grid */}
            <div className="flex flex-col gap-4">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="aspect-[4/5] bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => (
                            <div 
                                key={product._id} 
                                onClick={() => onNavigateProduct(product._id)}
                                className="group bg-white dark:bg-[#1a2632] rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all cursor-pointer relative flex flex-col"
                            >
                                <div className="relative aspect-square bg-gray-50 dark:bg-gray-800 overflow-hidden">
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                    />
                                    <button 
                                        onClick={(e) => handleRemove(e, product._id)}
                                        className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-black/60 backdrop-blur rounded-full shadow-sm text-red-500 hover:bg-red-50 transition-colors z-10"
                                        title="Bỏ thích"
                                    >
                                        <span className="material-symbols-outlined text-[20px] filled" style={{fontVariationSettings: "'FILL' 1"}}>favorite</span>
                                    </button>
                                </div>
                                
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="mb-1 text-xs font-bold text-primary uppercase tracking-wider">{product.category}</div>
                                    <h3 className="font-bold text-[#111418] dark:text-white line-clamp-2 mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                                    
                                    <div className="mt-auto pt-3 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                                        <span className="text-lg font-bold text-[#111418] dark:text-white">{product.price.toLocaleString()}đ</span>
                                        <button 
                                            onClick={(e) => handleAddToCart(e, product)}
                                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-[#111418] dark:text-white hover:bg-primary hover:text-white transition-colors"
                                            title="Thêm vào giỏ"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1a2632] rounded-xl border border-dashed border-gray-200 dark:border-gray-800 text-center">
                        <div className="size-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-4xl text-gray-400">favorite_border</span>
                        </div>
                        <h3 className="text-lg font-bold text-[#111418] dark:text-white">Danh sách yêu thích trống</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6 max-w-md">
                            Hãy thả tim cho các sản phẩm bạn thích để lưu vào đây nhé.
                        </p>
                        <button onClick={onNavigateProducts} className="px-6 py-2.5 text-sm font-bold text-white bg-primary rounded-lg hover:bg-blue-600 transition">
                            Khám phá sản phẩm
                        </button>
                    </div>
                )}
            </div>
        </main>
      </div>
    </div>
  );
};

export default WishlistPage;