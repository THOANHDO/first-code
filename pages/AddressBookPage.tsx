import React, { useState } from 'react';
import { User, UserAddress } from '../shared/types';
import { AuthService } from '../backend/api';
import ProfileSidebar from '../components/profile/ProfileSidebar';

interface AddressBookPageProps {
  user: User;
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateOrders: () => void;
  onNavigateBookings: () => void;
  onNavigateWishlist: () => void;
  onUserUpdate: (user: User) => void;
  onLogout: () => void;
}

const AddressBookPage: React.FC<AddressBookPageProps> = ({ 
    user, 
    onNavigateHome, 
    onNavigateProfile, 
    onNavigateOrders, 
    onNavigateBookings,
    onNavigateWishlist,
    onUserUpdate,
    onLogout 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null); // For loading state per card
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<UserAddress>({
    id: '',
    name: '',
    phone: '',
    street: '',
    city: 'HN',
    type: 'HOME',
    isDefault: false
  });

  const handleSidebarNavigate = (page: string) => {
    if (page === 'profile') onNavigateProfile();
    if (page === 'orders') onNavigateOrders();
    if (page === 'bookings') onNavigateBookings();
    if (page === 'wishlist') onNavigateWishlist();
  };

  const resetForm = () => {
    setFormData({
        id: '',
        name: '',
        phone: '',
        street: '',
        city: 'HN',
        type: 'HOME',
        isDefault: false
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (addr: UserAddress) => {
      setFormData(addr);
      setEditingId(addr.id);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async () => {
      if (!formData.name || !formData.phone || !formData.street) {
          alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
          return;
      }

      setLoading(true);
      try {
          let res;
          if (editingId) {
              res = await AuthService.updateAddress(user._id, formData);
          } else {
              res = await AuthService.addAddress(user._id, formData);
          }

          if (res.success && res.user) {
              onUserUpdate(res.user);
              resetForm();
          } else {
              alert(res.message);
          }
      } catch (error) {
          alert("Có lỗi xảy ra khi lưu địa chỉ.");
      } finally {
          setLoading(false);
      }
  };

  const handleDelete = async (id: string) => {
      if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;
      
      setActionLoadingId(id);
      try {
          const res = await AuthService.removeAddress(user._id, id);
          if (res.success && res.user) {
              onUserUpdate(res.user);
          } else {
              alert(res.message || "Không thể xóa địa chỉ.");
          }
      } catch (error) {
          alert("Có lỗi xảy ra khi xóa.");
      } finally {
          setActionLoadingId(null);
      }
  };

  const handleSetDefault = async (id: string) => {
      setActionLoadingId(id);
      try {
          const res = await AuthService.setDefaultAddress(user._id, id);
          if (res.success && res.user) {
              onUserUpdate(res.user);
          } else {
              alert(res.message || "Không thể đặt mặc định.");
          }
      } catch (error) {
          alert("Có lỗi xảy ra.");
      } finally {
          setActionLoadingId(null);
      }
  };

  const getIconByType = (type: string) => {
      if (type === 'OFFICE') return 'work';
      if (type === 'HOME') return 'home';
      return 'cottage';
  };

  return (
    <div className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-10 py-6 lg:py-10 font-sans">
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        <ProfileSidebar 
            user={user} 
            activePage="address-book" 
            onNavigate={handleSidebarNavigate} 
            onLogout={onLogout} 
        />

        <main className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Breadcrumbs */}
            <nav className="flex flex-wrap gap-2 mb-2 text-sm">
                <button onClick={onNavigateHome} className="text-[#617589] hover:text-primary transition-colors">Trang chủ</button>
                <span className="text-[#617589]">/</span>
                <button onClick={onNavigateProfile} className="text-[#617589] hover:text-primary transition-colors">Tài khoản</button>
                <span className="text-[#617589]">/</span>
                <span className="text-[#111418] dark:text-white font-medium">Sổ địa chỉ</span>
            </nav>

            {/* Page Heading & Actions */}
            <div className="flex flex-wrap justify-between items-end gap-4 p-4 bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-700">
                <div className="flex flex-col gap-2">
                    <h1 className="text-[#111418] dark:text-white text-2xl font-bold leading-tight flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-3xl">map</span>
                        Sổ địa chỉ
                    </h1>
                    <p className="text-[#617589] dark:text-gray-400 text-sm font-normal leading-normal">Quản lý danh sách địa chỉ nhận hàng để thanh toán nhanh chóng hơn.</p>
                </div>
                {!showForm && (
                    <button 
                        onClick={() => setShowForm(true)}
                        className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary hover:bg-primary-dark transition-colors text-white text-sm font-bold leading-normal shadow-md shadow-blue-500/20"
                    >
                        <span className="material-symbols-outlined text-lg mr-2">add</span>
                        <span className="truncate">Thêm địa chỉ mới</span>
                    </button>
                )}
            </div>

            {/* Address Form Section */}
            {showForm && (
                <section className="bg-white dark:bg-[#1a2632] p-6 rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-700 animate-fade-in-up">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[#111418] dark:text-white text-lg font-bold">{editingId ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}</h3>
                        <button onClick={resetForm} className="text-[#617589] hover:text-red-500 transition-colors text-sm font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-lg">close</span> Huỷ
                        </button>
                    </div>
                    <form className="flex flex-col gap-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <label className="flex flex-col gap-1.5">
                                <span className="text-[#111418] dark:text-gray-200 text-sm font-medium">Họ và tên</span>
                                <input 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full rounded-lg border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-11 px-4 text-sm placeholder:text-[#9ca3af] outline-none" 
                                    placeholder="Nhập họ và tên người nhận" 
                                    type="text"
                                />
                            </label>
                            <label className="flex flex-col gap-1.5">
                                <span className="text-[#111418] dark:text-gray-200 text-sm font-medium">Số điện thoại</span>
                                <input 
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full rounded-lg border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-11 px-4 text-sm placeholder:text-[#9ca3af] outline-none" 
                                    placeholder="Nhập số điện thoại" 
                                    type="tel"
                                />
                            </label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <label className="flex flex-col gap-1.5">
                                <span className="text-[#111418] dark:text-gray-200 text-sm font-medium">Tỉnh/Thành phố</span>
                                <div className="relative">
                                    <select 
                                        value={formData.city}
                                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                                        className="w-full rounded-lg border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-11 px-4 text-sm appearance-none outline-none"
                                    >
                                        <option value="HN">Hà Nội</option>
                                        <option value="HCM">Hồ Chí Minh</option>
                                        <option value="DN">Đà Nẵng</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#617589] pointer-events-none text-lg">expand_more</span>
                                </div>
                            </label>
                            <label className="flex flex-col gap-1.5">
                                <span className="text-[#111418] dark:text-gray-200 text-sm font-medium">Loại địa chỉ</span>
                                <div className="relative">
                                    <select 
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                                        className="w-full rounded-lg border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-11 px-4 text-sm appearance-none outline-none"
                                    >
                                        <option value="HOME">Nhà Riêng</option>
                                        <option value="OFFICE">Văn Phòng</option>
                                        <option value="OTHER">Khác</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#617589] pointer-events-none text-lg">expand_more</span>
                                </div>
                            </label>
                             {/* Placeholder for District/Ward as requested simplified logic */}
                             <label className="flex flex-col gap-1.5">
                                <span className="text-[#111418] dark:text-gray-200 text-sm font-medium">Quận/Huyện</span>
                                <div className="relative">
                                    <select className="w-full rounded-lg border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-11 px-4 text-sm appearance-none outline-none" disabled>
                                        <option>Mặc định (Demo)</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#617589] pointer-events-none text-lg">expand_more</span>
                                </div>
                            </label>
                        </div>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-[#111418] dark:text-gray-200 text-sm font-medium">Địa chỉ cụ thể</span>
                            <textarea 
                                value={formData.street}
                                onChange={(e) => setFormData({...formData, street: e.target.value})}
                                className="w-full rounded-lg border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary p-4 text-sm placeholder:text-[#9ca3af] resize-none outline-none" 
                                placeholder="Số nhà, tên đường, tòa nhà..." 
                                rows={3}
                            ></textarea>
                        </label>
                        <div className="flex items-center gap-3">
                            <input 
                                id="default-address" 
                                type="checkbox"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                                className="w-5 h-5 border border-[#dbe0e6] rounded text-primary focus:ring-primary focus:ring-offset-0 bg-white dark:bg-gray-800 cursor-pointer"
                            />
                            <label className="text-[#111418] dark:text-gray-200 text-sm font-medium select-none cursor-pointer" htmlFor="default-address">
                                Đặt làm địa chỉ mặc định
                            </label>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-[#f0f2f4] dark:border-gray-700 mt-2">
                            <button 
                                onClick={resetForm}
                                className="px-6 h-10 rounded-lg border border-[#dbe0e6] dark:border-gray-600 text-[#111418] dark:text-white text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" 
                                type="button"
                            >
                                Trở lại
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={loading}
                                className="px-6 h-10 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2" 
                                type="button"
                            >
                                {loading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                                {editingId ? 'Cập nhật' : 'Lưu địa chỉ'}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            {/* Address List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(!user.addresses || user.addresses.length === 0) && !showForm && (
                    <div className="md:col-span-2 flex flex-col items-center justify-center py-16 bg-white dark:bg-[#1a2632] rounded-xl border border-dashed border-[#e5e7eb] dark:border-gray-700">
                        <div className="size-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-3xl text-[#617589]">location_off</span>
                        </div>
                        <h3 className="text-lg font-bold text-[#111418] dark:text-white">Chưa có địa chỉ nào</h3>
                        <p className="text-[#617589] mt-2 mb-6 text-sm">Thêm địa chỉ để thanh toán nhanh hơn.</p>
                        <button onClick={() => setShowForm(true)} className="px-6 py-2.5 text-sm font-bold text-white bg-primary rounded-lg hover:bg-blue-600 transition">
                            Thêm ngay
                        </button>
                    </div> 
                )}

                {user.addresses?.map((addr) => (
                    <div key={addr.id} className={`relative flex flex-col p-5 bg-white dark:bg-[#1a2632] rounded-xl border shadow-sm group hover:shadow-md transition-all ${addr.isDefault ? 'border-primary dark:border-primary' : 'border-[#e5e7eb] dark:border-gray-700'}`}>
                        {addr.isDefault && (
                            <div className="absolute top-4 right-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                                    Mặc định
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-lg ${addr.isDefault ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-700 text-[#617589] dark:text-gray-300'}`}>
                                <span className="material-symbols-outlined">{getIconByType(addr.type)}</span>
                            </div>
                            <div>
                                <h4 className="text-[#111418] dark:text-white text-base font-bold">{addr.name}</h4>
                                <p className="text-[#617589] dark:text-gray-400 text-sm">{addr.phone}</p>
                            </div>
                        </div>
                        <div className="pl-[52px] mb-4 min-h-[40px]">
                            <p className="text-[#111418] dark:text-gray-200 text-sm leading-relaxed line-clamp-2">
                                {addr.street}<br/>
                                {addr.city === 'HN' ? 'Hà Nội' : addr.city === 'HCM' ? 'Hồ Chí Minh' : 'Đà Nẵng'}
                            </p>
                        </div>
                        <div className="pl-[52px] flex gap-4 mt-auto items-center">
                            <button 
                                onClick={() => handleEdit(addr)}
                                className="text-sm font-bold hover:underline text-primary"
                            >
                                Chỉnh sửa
                            </button>
                            
                            <button 
                                onClick={() => handleDelete(addr.id)}
                                disabled={actionLoadingId === addr.id}
                                className="text-[#617589] dark:text-gray-400 text-sm font-medium hover:text-red-500 transition-colors disabled:opacity-50"
                            >
                                {actionLoadingId === addr.id ? '...' : 'Xóa'}
                            </button>
                            
                            {!addr.isDefault && (
                                <button 
                                    onClick={() => handleSetDefault(addr.id)}
                                    disabled={actionLoadingId === addr.id}
                                    className="text-[#617589] dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors ml-auto disabled:opacity-50"
                                >
                                    {actionLoadingId === addr.id ? 'Đang xử lý...' : 'Thiết lập mặc định'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </main>
      </div>
    </div>
  );
};

export default AddressBookPage;