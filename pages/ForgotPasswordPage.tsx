import React, { useState } from 'react';
import { AuthService } from '../backend/api';

interface ForgotPasswordPageProps {
  onNavigateLogin: () => void;
  onNavigateHome: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigateLogin, onNavigateHome }) => {
  // Step State: 1 = Email, 2 = OTP, 3 = New Password
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Form Data
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // Info messages (e.g. OTP sent)

  // Handlers
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Vui lòng nhập email."); return; }
    
    setLoading(true); setError(''); setMessage('');
    try {
      const res = await AuthService.forgotPassword(email);
      if (res.success) {
        setMessage(res.message); // Contains OTP for demo
        setStep(2);
      } else {
        setError(res.message);
      }
    } catch (err) { setError('Lỗi kết nối.'); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) { setError("Vui lòng nhập mã xác thực."); return; }
    
    setLoading(true); setError('');
    try {
      const res = await AuthService.verifyOtp(email, otp);
      if (res.success) {
        setStep(3);
        setMessage(''); // Clear previous OTP message
      } else {
        setError(res.message);
      }
    } catch (err) { setError('Lỗi kết nối.'); }
    finally { setLoading(false); }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) { setError("Vui lòng nhập mật khẩu mới."); return; }
    if (newPassword !== confirmNewPassword) { setError("Mật khẩu xác nhận không khớp."); return; }
    
    setLoading(true); setError('');
    try {
      // Pass OTP again for final verification
      const res = await AuthService.resetPassword(email, otp, newPassword);
      if (res.success) {
        setSuccess(true);
        setMessage(res.message);
      } else {
        setError(res.message);
      }
    } catch (err) { setError('Lỗi kết nối.'); }
    finally { setLoading(false); }
  };

  // Render Content based on Success or Step
  const renderContent = () => {
    if (success) {
        return (
            <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center space-y-6 animate-fade-in-up">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600">
                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-green-800">Thành công!</h3>
                    <p className="text-green-700 mt-2">{message}</p>
                </div>
                <button 
                    onClick={onNavigateLogin}
                    className="w-full h-12 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition-colors shadow-lg shadow-green-600/20"
                >
                    Đăng nhập ngay
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
             {/* Message Alert (For OTP display in demo) */}
             {message && !error && (
                <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-lg border border-blue-100 flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] mt-0.5">info</span>
                    <span>{message}</span>
                </div>
             )}

             {/* Error Alert */}
             {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                   <span className="material-symbols-outlined text-[18px]">error</span>
                   {error}
                </div>
             )}

             {/* Steps */}
             {step === 1 && (
                <form className="space-y-6 animate-fade-in-up" onSubmit={handleRequestOtp}>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-900 dark:text-gray-200">Email đã đăng ký</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                <span className="material-symbols-outlined text-[20px]">mail</span>
                            </div>
                            <input 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 pl-10 pr-4 rounded-lg bg-gray-50 dark:bg-[#1a2632] border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium outline-none" 
                                placeholder="nguyenvan@example.com" 
                                type="email"
                                autoFocus
                            />
                        </div>
                    </div>
                    <button 
                        disabled={loading}
                        className="w-full h-12 flex items-center justify-center rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-bold tracking-wide transition-all shadow-md hover:shadow-lg shadow-primary/20 disabled:opacity-70"
                    >
                        {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : 'Gửi mã xác nhận'}
                    </button>
                </form>
             )}

             {step === 2 && (
                <form className="space-y-6 animate-fade-in-up" onSubmit={handleVerifyOtp}>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="block text-sm font-medium text-slate-900 dark:text-gray-200">Nhập mã xác nhận (OTP)</label>
                            <button type="button" onClick={() => setStep(1)} className="text-xs text-primary font-bold hover:underline">Gửi lại?</button>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                <span className="material-symbols-outlined text-[20px]">lock_clock</span>
                            </div>
                            <input 
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full h-12 pl-10 pr-4 rounded-lg bg-gray-50 dark:bg-[#1a2632] border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium outline-none tracking-widest" 
                                placeholder="######" 
                                type="text"
                                maxLength={6}
                                autoFocus
                            />
                        </div>
                        <p className="text-xs text-slate-500">Mã đã được gửi tới <strong>{email}</strong></p>
                    </div>
                    <button 
                        disabled={loading}
                        className="w-full h-12 flex items-center justify-center rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-bold tracking-wide transition-all shadow-md hover:shadow-lg shadow-primary/20 disabled:opacity-70"
                    >
                        {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : 'Xác thực mã'}
                    </button>
                </form>
             )}

             {step === 3 && (
                <form className="space-y-4 animate-fade-in-up" onSubmit={handleResetPassword}>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-900 dark:text-gray-200">Mật khẩu mới</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                <span className="material-symbols-outlined text-[20px]">lock</span>
                            </div>
                            <input 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full h-12 pl-10 pr-12 rounded-lg bg-gray-50 dark:bg-[#1a2632] border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium outline-none" 
                                placeholder="Nhập mật khẩu mới" 
                                type={showPassword ? "text" : "password"} 
                                autoFocus
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

                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-900 dark:text-gray-200">Xác nhận mật khẩu mới</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                            </div>
                            <input 
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="w-full h-12 pl-10 pr-12 rounded-lg bg-gray-50 dark:bg-[#1a2632] border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium outline-none" 
                                placeholder="Nhập lại mật khẩu mới" 
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

                    <button 
                        disabled={loading}
                        className="w-full h-12 mt-2 flex items-center justify-center rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-bold tracking-wide transition-all shadow-md hover:shadow-lg shadow-primary/20 disabled:opacity-70"
                    >
                        {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : 'Đổi mật khẩu'}
                    </button>
                </form>
             )}
        </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-[#101922] z-50 flex flex-col font-sans">
      {/* Minimal Header */}
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

      {/* Main Layout */}
      <main className="flex w-full h-full">
        {/* Left Side: Hero Image */}
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
              Đặt lịch chơi tại cửa hàng, mua sắm thẻ game và cập nhật những thiết bị mới nhất. Tất cả chỉ trong một tài khoản duy nhất.
            </p>
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="w-full lg:w-1/2 h-full bg-white dark:bg-[#101922] flex flex-col overflow-y-auto">
          <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-12 py-20 lg:py-10">
            <div className="w-full max-w-[440px] space-y-8">
              
              {/* Dynamic Header */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-2">
                    <span className="material-symbols-outlined text-[32px]">
                        {success ? 'check_circle' : (step === 3 ? 'password' : 'lock_reset')}
                    </span>
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {step === 1 && "Quên mật khẩu?"}
                        {step === 2 && "Xác thực mã OTP"}
                        {step === 3 && "Đặt lại mật khẩu"}
                        {success && "Hoàn tất!"}
                    </h1>
                    {!success && (
                        <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                            {step === 1 && "Nhập địa chỉ email để nhận mã xác minh."}
                            {step === 2 && "Vui lòng kiểm tra email và nhập mã gồm 6 chữ số."}
                            {step === 3 && "Hãy chọn một mật khẩu mạnh để bảo vệ tài khoản."}
                        </p>
                    )}
                </div>
              </div>

              {/* Dynamic Content Body */}
              {renderContent()}

              {/* Back Link (Only show if not success) */}
              {!success && (
                  <div className="text-center pt-2">
                    <button 
                        onClick={step === 1 ? onNavigateLogin : () => setStep(prev => (prev - 1) as any)}
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors group"
                    >
                        <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">arrow_back</span>
                        {step === 1 ? 'Quay lại Đăng nhập' : 'Quay lại bước trước'}
                    </button>
                  </div>
              )}

              {/* Footer */}
              <div className="text-center pt-8 border-t border-gray-100 dark:border-gray-800 mt-8">
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                    Cần hỗ trợ? Gọi <span className="font-bold text-slate-900 dark:text-white">1900 1234</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;