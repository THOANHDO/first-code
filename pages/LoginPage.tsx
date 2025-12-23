import React, { useState } from 'react';
import { AuthService } from '../backend/api';
import { User, AuthResponse } from '../shared/types';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onNavigateHome: () => void;
  onNavigateForgotPassword: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateHome, onNavigateForgotPassword }) => {
  const [email, setEmail] = useState('user@example.com'); 
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const handleQuickLogin = (type: 'ADMIN' | 'USER') => {
    if (type === 'ADMIN') {
        setEmail('admin@gamestore.vn');
        setPassword('admin123');
    } else {
        setEmail('user@example.com');
        setPassword('password123');
    }
    setActiveTab('login');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response: AuthResponse;

      if (activeTab === 'login') {
        response = await AuthService.login(email, password);
      } else {
        if (!fullName.trim()) {
            setError("Vui lòng nhập tên tài khoản.");
            setLoading(false);
            return;
        }
        if (!email.trim()) {
            setError("Vui lòng nhập email.");
            setLoading(false);
            return;
        }
        if (!password) {
            setError("Vui lòng nhập mật khẩu.");
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            setLoading(false);
            return;
        }
        response = await AuthService.register(email, fullName, password);
      }
      
      if (response.success && response.user) {
        onLoginSuccess(response.user);
      } else {
        setError(response.message || 'Thao tác thất bại');
      }
    } catch (err) {
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-[#101922] z-50 flex flex-col font-sans">
      <header className="absolute top-0 left-0 w-full z-20 px-6 py-4 flex justify-between items-center lg:px-10">
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onNavigateHome(); }}
          className="flex items-center gap-3 text-slate-900 dark:text-white hover:opacity-80 transition-opacity"
        >
          <div className="size-8 text-primary">
            <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" fill="currentColor" fillRule="evenodd"></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold tracking-tight hidden sm:block">GameStore VN</h2>
        </a>
        <button 
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors bg-white/80 dark:bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Trở về trang chủ
        </button>
      </header>

      <main className="flex w-full h-full">
        <div className="hidden lg:flex w-1/2 h-full relative bg-gray-900 items-center justify-center overflow-hidden group">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCXL7jV33yoLPKvvhBaV5vXvsCuVicRXP85JxBjp8t_fMXCJHR2YVj3HLsVCk-2pmoNf-E4bZWy6NzNj3QC5rHr_153y79nPNVwPdDfnTV7tNjja3Looyh0xsQLLELg36ygHwFPUtKPLv7SColrrtEKuSX0E4njRNqrUfJERU6E9u3uW85nydVbxN4zYO6ivwMemUviD__5RaP3ShlOyN5qoPXIAzoV-v80WTJfKpNWPsv9OBYu16let6PC2cQYaDfhgp13cpfqIw')" }}
          >
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#101922]/90 via-[#101922]/40 to-transparent"></div>
          
          <div className="relative z-10 max-w-lg px-12 text-white">
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Cộng đồng Game thủ số 1
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-6">
              Nâng tầm trải nghiệm chơi game của bạn.
            </h1>
            <p className="text-lg text-gray-200 font-medium leading-relaxed mb-8">
              Đặt lịch chơi tại cửa hàng, mua sắm thiết bị và kết nối cùng đồng đội.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 h-full bg-white dark:bg-[#101922] flex flex-col overflow-y-auto">
          <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-12 py-20 lg:py-10">
            <div className="w-full max-w-[440px] space-y-8">
              
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {activeTab === 'login' ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}
                </h1>
                <p className="text-slate-500 dark:text-gray-400 text-sm">
                  {activeTab === 'login' ? 'Nhập thông tin hoặc sử dụng Đăng nhập nhanh.' : 'Điền thông tin bên dưới để tham gia.'}
                </p>
              </div>

              {/* Quick Login Shortcuts */}
              {activeTab === 'login' && (
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <button 
                        onClick={() => handleQuickLogin('ADMIN')}
                        className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-primary/30 bg-primary/5 text-primary text-xs font-bold hover:bg-primary/10 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                        Thử Admin
                    </button>
                    <button 
                        onClick={() => handleQuickLogin('USER')}
                        className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-slate-600 dark:text-gray-300 text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">person</span>
                        Thử User
                    </button>
                  </div>
              )}

              <div className="w-full border-b border-gray-200 dark:border-gray-700">
                <div className="flex w-full gap-8">
                  <button 
                    onClick={() => setActiveTab('login')}
                    className={`flex-1 pb-4 text-center text-sm font-bold border-b-2 transition-colors ${activeTab === 'login' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-gray-500'}`}
                  >
                    Đăng nhập
                  </button>
                  <button 
                    onClick={() => setActiveTab('register')}
                    className={`flex-1 pb-4 text-center text-sm font-bold border-b-2 transition-colors ${activeTab === 'register' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-gray-500'}`}
                  >
                    Đăng ký
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2 border border-red-100 dark:border-red-900/30">
                   <span className="material-symbols-outlined text-[18px]">error</span>
                   {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                {activeTab === 'register' && (
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-900 dark:text-gray-200">Tên tài khoản</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <span className="material-symbols-outlined text-[20px]">person</span>
                      </div>
                      <input 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-lg bg-gray-50 dark:bg-[#1a2632] border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium outline-none" 
                        placeholder="Nhập tên tài khoản" 
                        type="text" 
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-900 dark:text-gray-200">Email hoặc số điện thoại</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <span className="material-symbols-outlined text-[20px]">mail</span>
                    </div>
                    <input 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-lg bg-gray-50 dark:bg-[#1a2632] border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium outline-none" 
                      placeholder="admin@gamestore.vn" 
                      type="text" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-slate-900 dark:text-gray-200">Mật khẩu</label>
                    {activeTab === 'login' && (
                        <button 
                            type="button"
                            onClick={onNavigateForgotPassword}
                            className="text-sm font-semibold text-primary hover:text-primary/80"
                        >
                            Quên mật khẩu?
                        </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <span className="material-symbols-outlined text-[20px]">lock</span>
                    </div>
                    <input 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 pl-10 pr-12 rounded-lg bg-gray-50 dark:bg-[#1a2632] border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium outline-none" 
                      placeholder="Nhập mật khẩu"
                      type={showPassword ? "text" : "password"} 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-800 dark:hover:text-gray-300 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {activeTab === 'register' && (
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-900 dark:text-gray-200">Xác nhận mật khẩu</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                      </div>
                      <input 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-11 pl-10 pr-12 rounded-lg bg-gray-50 dark:bg-[#1a2632] border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium outline-none" 
                        placeholder="Nhập lại mật khẩu" 
                        type={showConfirmPassword ? "text" : "password"} 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-800 dark:hover:text-gray-300 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showConfirmPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                <button 
                  disabled={loading}
                  className="w-full h-12 mt-2 flex items-center justify-center rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-bold tracking-wide transition-all shadow-md hover:shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                  ) : (
                    activeTab === 'login' ? 'Đăng nhập ngay' : 'Đăng ký ngay'
                  )}
                </button>
              </form>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                <span className="flex-shrink-0 mx-4 text-xs font-medium text-slate-500 uppercase">
                    Hoặc đăng nhập với
                </span>
                <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 h-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <svg className="size-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                  </svg>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">Google</span>
                </button>
                <button className="flex items-center justify-center gap-3 h-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <svg className="size-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                  </svg>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">Facebook</span>
                </button>
              </div>

              <div className="text-center pt-2 pb-4">
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                   Bằng cách {activeTab === 'login' ? 'đăng nhập' : 'đăng ký'}, bạn đồng ý với các Điều khoản & Chính sách của chúng tôi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;