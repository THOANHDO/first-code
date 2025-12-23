import React, { useState, useEffect } from 'react';
import { CartItem, OrderInput, PaymentMethod, User, DeliveryMethod, StoreLocation } from '../shared/types';
import { DataService } from '../backend/api';
import { PAYMENT_INFO } from '../backend/database';

interface CheckoutPageProps {
  items: CartItem[];
  user: User | null;
  onNavigateHome: () => void;
  onNavigateCart: () => void;
  onOrderSuccess: () => void;
  onNavigateOrders: () => void;
  onNavigateBookings: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ items, user, onNavigateHome, onNavigateCart, onOrderSuccess, onNavigateOrders, onNavigateBookings }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');
  
  // Store Data
  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');

  // Determine Order Type
  const hasBooking = items.some(i => i.type === 'SERVICE');
  const hasProduct = items.some(i => i.type !== 'SERVICE');
  // Logic: "Booking Only" means strictly no products. Mixed orders go to Order History generally, but user wants strict separation.
  // The Navigation Button logic below handles the redirect.
  const isBookingOnly = hasBooking && !hasProduct;
  const isMixed = hasBooking && hasProduct;

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(
    hasBooking ? 'STORE_PICKUP' : 'SHIPPING'
  );

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    city: user?.city || 'Hồ Chí Minh',
    address: user?.address || '',
    saveAddress: false, // UI only for now
    paymentMethod: 'COD' as PaymentMethod,
    note: ''
  });

  // Load Stores and Set Defaults
  useEffect(() => {
    DataService.getStores().then(data => {
        setStores(data);
        if (data.length > 0) {
            setSelectedStoreId(data[0]._id);
        }
    });
  }, []);

  const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Shipping Fee Logic
  const shippingFee = deliveryMethod === 'STORE_PICKUP' ? 0 : 30000;
  
  const discountAmount = 0; 
  const totalAmount = subTotal + shippingFee - discountAmount;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleToggleSaveAddress = () => {
      setFormData(prev => ({ ...prev, saveAddress: !prev.saveAddress }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const selectedStore = stores.find(s => s._id === selectedStoreId);
    
    // If Store Pickup, override address with Store Address
    const finalAddress = deliveryMethod === 'STORE_PICKUP' && selectedStore 
        ? `${selectedStore.name} - ${selectedStore.address}`
        : formData.address;

    const orderInput: OrderInput = {
      userId: user?._id,
      items: items,
      totalAmount: totalAmount,
      customerName: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: finalAddress,
      city: formData.city,
      paymentMethod: formData.paymentMethod,
      deliveryMethod: deliveryMethod,
      pickupStoreId: deliveryMethod === 'STORE_PICKUP' ? selectedStoreId : undefined,
      note: formData.note
    };

    try {
      const res = await DataService.createOrder(orderInput);
      if (res.success) {
        setCreatedOrderId(res.orderId);
        setSuccess(true);
        onOrderSuccess();
      }
    } catch (err) {
      alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const selectedStore = stores.find(s => s._id === selectedStoreId);
  const qrUrl = `https://img.vietqr.io/image/${PAYMENT_INFO.bankId}-${PAYMENT_INFO.accountNo}-${PAYMENT_INFO.template}.png?amount=${totalAmount}&addInfo=GSVN ${Math.floor(Math.random()*1000)}`;

  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in-up bg-white dark:bg-[#101922]">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-lg shadow-green-500/20">
          <span className="material-symbols-outlined text-6xl">check_circle</span>
        </div>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            {isBookingOnly ? "Đặt lịch thành công!" : "Đặt hàng thành công!"}
        </h2>
        <p className="text-slate-500 dark:text-gray-400 mb-2 text-lg">Mã đơn: <span className="font-bold text-slate-900 dark:text-white">#{createdOrderId}</span></p>
        <p className="text-slate-500 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
            {isBookingOnly 
                ? `Vui lòng đến đúng giờ tại ${selectedStore?.name}. Chúng tôi đã gửi vé điện tử vào email của bạn.`
                : `Chúng tôi đã gửi email xác nhận đến ${formData.email}. Cảm ơn bạn đã tin tưởng GameStore.`
            }
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
            <button onClick={onNavigateHome} className="flex-1 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-slate-700 dark:text-white font-bold py-3.5 px-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                Về trang chủ
            </button>
            <button 
                onClick={isBookingOnly ? onNavigateBookings : onNavigateOrders}
                className="flex-1 bg-primary hover:bg-blue-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-primary/30 transition-all"
            >
                {isBookingOnly ? "Xem lịch đặt" : "Theo dõi đơn"}
            </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">remove_shopping_cart</span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Giỏ hàng trống</h2>
              <button onClick={onNavigateHome} className="mt-4 text-primary font-bold hover:underline">Quay lại mua sắm</button>
          </div>
      );
  }

  return (
    <div className="bg-gray-50 dark:bg-[#101922] min-h-screen py-8 font-sans">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8">
        
        {/* Breadcrumbs */}
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm md:text-base">
            <button onClick={onNavigateCart} className="text-slate-500 hover:text-primary font-medium dark:text-gray-400">Giỏ hàng</button>
            <span className="text-slate-400 font-medium">/</span>
            <span className="text-slate-500 font-medium dark:text-gray-400">Thông tin vận chuyển</span>
            <span className="text-slate-400 font-medium">/</span>
            <span className="text-primary font-bold">Thanh toán</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN */}
          <div className="flex-1 flex flex-col gap-8">
            
            {/* Delivery/Store Info Section */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-[#1a2632] dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">
                            {deliveryMethod === 'SHIPPING' ? 'local_shipping' : 'storefront'}
                        </span>
                        {isBookingOnly ? 'Thông tin người đặt & Địa điểm' : 'Thông tin nhận hàng'}
                    </h2>
                </div>

                {/* Delivery Method Switcher (Only if not Booking Only) */}
                {!isBookingOnly && (
                    <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6">
                        <button 
                            onClick={() => setDeliveryMethod('SHIPPING')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${deliveryMethod === 'SHIPPING' ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                            Giao tận nơi
                        </button>
                        <button 
                            onClick={() => setDeliveryMethod('STORE_PICKUP')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${deliveryMethod === 'STORE_PICKUP' ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">store</span>
                            Nhận tại cửa hàng
                        </button>
                    </div>
                )}

                {/* Common Info Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        placeholder="Họ tên người nhận"
                        className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm focus:ring-1 focus:ring-primary outline-none"
                    />
                    <input 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        placeholder="Số điện thoại"
                        className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm focus:ring-1 focus:ring-primary outline-none"
                    />
                    <input 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        placeholder="Email (nhận thông báo)"
                        className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm focus:ring-1 focus:ring-primary outline-none md:col-span-2"
                    />
                </div>

                {/* CONDITIONAL CONTENT BASED ON METHOD */}
                {deliveryMethod === 'SHIPPING' ? (
                    <div className="space-y-4 animate-fade-in-up">
                        <input 
                            name="address" 
                            value={formData.address} 
                            onChange={handleChange} 
                            placeholder="Địa chỉ nhận hàng chi tiết"
                            className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm focus:ring-1 focus:ring-primary outline-none"
                        />
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                id="saveAddress" 
                                checked={formData.saveAddress} 
                                onChange={handleToggleSaveAddress}
                                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                            />
                            <label htmlFor="saveAddress" className="text-sm text-slate-600 dark:text-gray-400 cursor-pointer select-none">
                                Lưu vào sổ địa chỉ (Mặc định cho lần sau)
                            </label>
                        </div>
                        <p className="text-sm mt-2 text-blue-600 bg-blue-50 px-3 py-2 rounded dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50 flex items-start gap-2">
                            <span className="material-symbols-outlined text-[18px] shrink-0">info</span>
                            Thời gian giao hàng dự kiến: 2-3 ngày làm việc.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 animate-fade-in-up">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">Chọn cửa hàng & khu vực</label>
                            <div className="relative">
                                <select 
                                    value={selectedStoreId}
                                    onChange={(e) => setSelectedStoreId(e.target.value)}
                                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
                                >
                                    {stores.map(s => (
                                        <option key={s._id} value={s._id}>{s.name} - {s.city.toUpperCase()}</option>
                                    ))}
                                </select>
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500">store</span>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        {selectedStore && (
                            <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="h-48 w-full bg-gray-200 relative group">
                                    <iframe 
                                        src={selectedStore.mapEmbedUrl}
                                        className="w-full h-full border-0"
                                        loading="lazy"
                                        title="Store Map"
                                    ></iframe>
                                    <a href={selectedStore.mapEmbedUrl} target="_blank" rel="noreferrer" className="absolute bottom-2 right-2 bg-white/90 text-xs font-bold px-3 py-1 rounded shadow text-slate-800 hover:text-primary flex items-center gap-1">
                                        Mở rộng <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                                    </a>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                                    <p className="font-bold text-slate-900 dark:text-white flex items-start gap-2 text-sm">
                                        <span className="material-symbols-outlined text-[18px] text-primary shrink-0">location_on</span>
                                        {selectedStore.address}
                                    </p>
                                    <p className="text-slate-500 dark:text-gray-400 text-sm ml-6 mt-1">{selectedStore.hours.weekday} (Cuối tuần: {selectedStore.hours.weekend})</p>
                                    
                                    {hasBooking && (
                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <p className="text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider mb-1">Lịch đặt máy của bạn:</p>
                                            {items.filter(i => i.type === 'SERVICE').map((booking, idx) => (
                                                <div key={idx} className="flex justify-between text-sm mb-1">
                                                    <span className="text-slate-700 dark:text-gray-300">{booking.name}</span>
                                                    <span className="font-bold">{booking.bookingTime} - {booking.bookingDate}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {isMixed && (
                                        <div className="mt-3 p-2 bg-orange-50 text-orange-800 text-xs rounded border border-orange-100 flex gap-2">
                                            <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                                            <span>Các sản phẩm vật lý trong đơn hàng sẽ được chuẩn bị sẵn tại quầy cho bạn.</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* Payment Method */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-[#1a2632] dark:border-gray-700">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">payments</span>
                    Phương thức thanh toán
                </h2>
                
                <div className="flex flex-col gap-4">
                    {/* COD Option - Hide if Booking Only */}
                    {!isBookingOnly && (
                        <label className={`group relative flex cursor-pointer flex-col rounded-xl border transition-all hover:border-primary ${formData.paymentMethod === 'COD' ? 'border-primary bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600'}`}>
                            <input 
                                type="radio" 
                                name="payment_method" 
                                className="peer sr-only" 
                                checked={formData.paymentMethod === 'COD'} 
                                onChange={() => setFormData(prev => ({ ...prev, paymentMethod: 'COD' }))} 
                            />
                            <div className="flex items-start gap-4 p-4 w-full">
                                <div className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border ${formData.paymentMethod === 'COD' ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                                    <div className={`h-2 w-2 rounded-full bg-white ${formData.paymentMethod === 'COD' ? 'opacity-100' : 'opacity-0'}`}></div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-bold text-slate-900 dark:text-white">Thanh toán khi nhận hàng (COD)</p>
                                        <span className="material-symbols-outlined text-gray-400">local_atm</span>
                                    </div>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                                        {deliveryMethod === 'STORE_PICKUP' ? 'Thanh toán tại quầy thu ngân.' : 'Thanh toán tiền mặt cho shipper.'}
                                    </p>
                                </div>
                            </div>
                            {formData.paymentMethod === 'COD' && (
                                <div className="border-t border-gray-200 dark:border-gray-600 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 dark:text-gray-400">Tổng tiền cần thanh toán:</span>
                                            <span className="font-bold text-lg text-primary">{totalAmount.toLocaleString()}đ</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </label>
                    )}

                    {/* QR Code Option - Always Available */}
                    <label className={`group relative flex cursor-pointer flex-col rounded-xl border transition-all hover:border-primary ${formData.paymentMethod === 'BANK_TRANSFER' ? 'border-primary' : 'border-gray-200 dark:border-gray-600'}`}>
                        <input 
                            type="radio" 
                            name="payment_method" 
                            className="peer sr-only" 
                            checked={formData.paymentMethod === 'BANK_TRANSFER'} 
                            onChange={() => setFormData(prev => ({ ...prev, paymentMethod: 'BANK_TRANSFER' }))} 
                        />
                        <div className="flex items-start gap-4 p-4 w-full">
                            <div className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border ${formData.paymentMethod === 'BANK_TRANSFER' ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                                <div className={`h-2 w-2 rounded-full bg-white ${formData.paymentMethod === 'BANK_TRANSFER' ? 'opacity-100' : 'opacity-0'}`}></div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-bold text-slate-900 dark:text-white">Quét mã QR (VietQR)</p>
                                    <span className="material-symbols-outlined text-gray-400">qr_code_scanner</span>
                                </div>
                                <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                                    {isBookingOnly ? 'Thanh toán trước để giữ chỗ.' : 'Quét mã QR qua ứng dụng ngân hàng.'}
                                </p>
                            </div>
                        </div>
                        {formData.paymentMethod === 'BANK_TRANSFER' && (
                            <div className="border-t border-gray-200 dark:border-gray-600 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="flex flex-col items-center gap-3 shrink-0">
                                        <div className="bg-white p-2 rounded-lg shadow-sm w-48 h-48 flex items-center justify-center border border-gray-200 dark:border-gray-600">
                                            <img src={qrUrl} alt="QR Code Thanh Toán" className="w-full h-full object-contain" />
                                        </div>
                                        <p className="text-xs text-slate-500">Mã QR tự động cập nhật số tiền</p>
                                    </div>
                                    <div className="flex-1 space-y-5">
                                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500 dark:text-gray-400">Ngân hàng:</span>
                                                <span className="font-bold text-slate-900 dark:text-white">{PAYMENT_INFO.bankName}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500 dark:text-gray-400">Chủ tài khoản:</span>
                                                <span className="font-bold text-slate-900 dark:text-white uppercase text-right">{PAYMENT_INFO.accountName}</span>
                                            </div>
                                            <div className="flex justify-between text-sm items-center">
                                                <span className="text-slate-500 dark:text-gray-400">Nội dung:</span>
                                                <div className="flex gap-2 items-center">
                                                    <code className="bg-gray-100 px-2 py-1 rounded text-primary font-mono font-bold dark:bg-gray-700">GSVN {Math.floor(Math.random()*10000)}</code>
                                                    <button className="text-primary hover:bg-blue-50 p-1 rounded transition-colors" title="Sao chép">
                                                        <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm mb-2 text-slate-900 dark:text-white">Hướng dẫn:</h4>
                                            <ol className="list-decimal list-inside text-sm space-y-2 text-slate-500 dark:text-gray-400">
                                                <li>Mở ứng dụng ngân hàng hoặc ví điện tử.</li>
                                                <li>Quét mã QR và xác nhận thanh toán.</li>
                                                {isBookingOnly && <li>Đơn đặt lịch sẽ được xác nhận ngay sau khi thanh toán.</li>}
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </label>
                </div>
            </section>

            <div className="flex items-start gap-3 rounded-lg bg-green-50 p-4 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800/30">
                <span className="material-symbols-outlined shrink-0">verified_user</span>
                <p className="text-sm leading-relaxed">Thông tin thanh toán của bạn được mã hóa an toàn 256-bit SSL. Chúng tôi cam kết bảo mật tuyệt đối thông tin khách hàng.</p>
            </div>
          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-24 rounded-xl border border-gray-200 bg-white shadow-lg dark:bg-[#1a2632] dark:border-gray-700 overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Đơn hàng của bạn ({items.length})</h3>
                </div>
                <div className="p-6 flex flex-col gap-6">
                    <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {items.map((item, idx) => (
                            <div key={`${item.productId}-${idx}`} className="flex gap-3">
                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100 dark:border-gray-600">
                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex flex-1 flex-col justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">{item.name}</p>
                                        {item.type === 'SERVICE' ? (
                                            <p className="text-xs text-primary dark:text-primary-light mt-1 font-semibold">
                                                {item.bookingDate} | {item.bookingTime} ({item.bookingDuration}h)
                                            </p>
                                        ) : item.selectedColor && (
                                            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Màu: {item.selectedColor}</p>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <p className="text-xs text-slate-500 dark:text-gray-400">
                                            {item.type === 'SERVICE' ? 'Thời gian:' : 'Số lượng:'} <span className="font-bold">{item.quantity}</span>
                                        </p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{(item.price * item.quantity).toLocaleString()}đ</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>
                    
                    <div className="flex flex-col gap-2 text-sm">
                        <div className="flex justify-between text-slate-500 dark:text-gray-400">
                            <span>Tạm tính</span>
                            <span>{subTotal.toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between text-slate-500 dark:text-gray-400">
                            <span>Phí vận chuyển</span>
                            <span>{shippingFee === 0 ? 'Miễn phí' : shippingFee.toLocaleString() + 'đ'}</span>
                        </div>
                        {discountAmount > 0 && (
                            <div className="flex justify-between text-primary font-medium">
                                <span>Giảm giá</span>
                                <span>-{discountAmount.toLocaleString()}đ</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>
                    
                    <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-slate-900 dark:text-white">Tổng cộng</span>
                        <div className="text-right">
                            <span className="block text-2xl font-black text-primary tracking-tight">{totalAmount.toLocaleString()}đ</span>
                            <span className="text-xs text-slate-500 dark:text-gray-400">(Đã bao gồm VAT)</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <input className="flex-1 rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-gray-600 dark:text-white" placeholder="Mã giảm giá" type="text"/>
                        <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">Áp dụng</button>
                    </div>

                    <button 
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="w-full rounded-lg bg-primary py-4 text-base font-bold text-white shadow-md hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : 'Hoàn tất đơn hàng'}
                    </button>
                    
                    <p className="text-center text-xs text-slate-500 dark:text-gray-400 px-4">
                        Bằng việc đặt hàng, bạn đồng ý với <a className="underline hover:text-primary" href="#">Điều khoản dịch vụ</a> và <a className="underline hover:text-primary" href="#">Chính sách bảo mật</a> của GameStoreVN.
                    </p>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;