import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[1440px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined">sports_esports</span>
              </div>
              <h2 className="text-slate-800 text-2xl font-black tracking-tight">GameStore</h2>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              Hệ thống cửa hàng game uy tín hàng đầu. Nơi cung cấp các sản phẩm giải trí chính hãng và dịch vụ phòng máy chất lượng cao dành cho cộng đồng game thủ Việt Nam.
            </p>
            <div className="flex gap-4">
              {['public', 'alternate_email', 'call'].map((icon, i) => (
                <a key={i} href="#" className="size-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all duration-300">
                  <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links 1 */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-slate-800 font-bold text-lg">Về Chúng Tôi</h3>
            <ul className="flex flex-col gap-3">
              {['Giới thiệu', 'Tuyển dụng', 'Điều khoản sử dụng', 'Chính sách bảo mật'].map(item => (
                <li key={item}><a href="#" className="text-slate-500 hover:text-primary text-sm transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Links 2 */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-slate-800 font-bold text-lg">Hỗ Trợ</h3>
            <ul className="flex flex-col gap-3">
              {['Hướng dẫn mua hàng', 'Chính sách đổi trả', 'Chính sách bảo hành', 'Tra cứu đơn hàng'].map(item => (
                <li key={item}><a href="#" className="text-slate-500 hover:text-primary text-sm transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h3 className="text-slate-800 font-bold text-lg">Đăng Ký Nhận Tin</h3>
            <p className="text-slate-500 text-sm">Nhận thông tin về sản phẩm mới, mã giảm giá và các chương trình khuyến mãi sớm nhất.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email của bạn" className="w-full bg-gray-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary text-slate-800 placeholder-gray-400" />
              <button className="bg-primary text-white rounded-xl px-6 py-3 font-bold text-sm hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">Gửi</button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© 2024 GameStore. All rights reserved. Designed with <span className="text-red-500">♥</span> for Gamers.</p>
          <div className="flex gap-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6p22cuk3ZMpVtvTKANpuGZOfUSzwmuZm1BIZTAH8CFgHAkQ5aSWg0POqDUykoNw2qB0uekZV6l_HsMwv25gbPVXOiHagfCZUbLhYIWVkryTU-VWMt-L9AL9IEAOP2nR3CHZgYynxAH6JeWnZr0vqC_PWwr1U4XliQz6AA3chzfZk1R8XlIw0ehJIXz8YI4B5ohYWBRfEVR2CVEWli_sgvhBlqKIyfyKwaYUYfQxuL0YjnVAzocMF2yd-GMJE_uyBpLo0bJn_6cA" alt="Visa" className="h-6" />
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsniOcPVmIrkdXHU6s0Ogcmo88ZlRa1H3kJttFKs-WDnhRBWIfT-wXu_Dd8tz4x0WYh_nLdP89GXo5NjN1iRDI3xOiFaGrxFzRMfJK7MYXAKFLka7U4EtQsuAnm3ijsjqibSVnt7weNBsflN3qYa6uZgayEU5UNgGYGynkojbkVNl9XpvZxz5fWIZ5HOwuG8SIaoN23spvrX0sGUsm0HOG0kqKyI9uLC3tOGvmU1YV0UP9FXvX1JEjw7Rld95XyeeAWAPyUt4Cvw" alt="Mastercard" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
