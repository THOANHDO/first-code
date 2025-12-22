import React, { useState, useEffect } from 'react';
import { DataService } from '../backend/api';

interface ContactPageProps {
  onNavigateStores: () => void;
  onNavigateBooking: () => void;
}

const HERO_IMAGES = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC_JxUB-SABtozCOPh9XYcUvFFBveWWVX-qSrNvFaTWeCvL8hvWcPwWxdU2Edj5Y0Gtidul5LBzWa3lrs5lD9zCphP8ApqzrVG2LH4fmvO0dv1Qu6DUg2cjSy4YAD6_PykyNozPvFKcEDzAAJ7hJxElVDy30J2P05L7bDwFmOgTLkQAKV9VvhseDvmsLPXs2auRVn04dbFZpeENvmJOCfP5IaoPyhnA4tYuUHhEN4yYUI_wCWMhXEThN3i4Ky4cVNEKEtvxHTCrwg",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBxoV3kEbK337tSIIGQ29-5AsY-2u7FUa4TkbVAQm81xYcqrHl18ZD-K2YjsjkK46c4XBmFeYAu-wNmepoldxOBhmKpC9SZEh3Sy7kANGRP9bU6Pt2Lbezskndl3wABWHK3qotmxcsdR-M_DTlE77jso7As0CHrsmgM4w4o1T_rLj_XB7yMKcsMUH7y1bXMyASEyBc1vEP4vycgDI56AlXDT0M2J0nJqldvKuWV0rbN79iG__zzkGfSJnwD5MsN1lVAmkAT92pPfw",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBVoc9MQkhc0xlxGJeWWRaKuVx4rjT44fuoFD4UIXs5G43aKSMLZhFezDDjyLjX6waBXVSlRGWPf9oKoHTwH_G0yhNBs3fGIftBNVlpR3UD9S6Fs5xKEa2RBt8c4KJMniiyChZjDijGHOqZfJx_7BxhaISmsbzwF7P9I-3Aq7bRSoSr7AG31M0tm4XytFPjVLgMXAKQr1gXHV03pCV_rHS6DdLhuRZJvJd2Tt_ir9uVwHephOmlA619L1etyz9n5ScLTrHC9wbHdg"
];

const ContactPage: React.FC<ContactPageProps> = ({ onNavigateStores, onNavigateBooking }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Hỗ trợ sản phẩm',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Slideshow Logic
  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev === HERO_IMAGES.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');

    try {
        const response = await DataService.submitContact(formData);
        if (response.success) {
            setSuccessMessage(response.message);
            setFormData({ name: '', email: '', subject: 'Hỗ trợ sản phẩm', message: '' });
        }
    } catch (error) {
        alert('Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white dark:bg-[#101922] w-full font-sans">
      
      {/* Hero Section */}
      <div className="w-full py-10 px-4 md:px-10 lg:px-40 bg-white dark:bg-[#101922]">
        <div className="max-w-[1200px] w-full mx-auto">
          <div className="flex flex-col gap-8 md:flex-row md:items-center">
            <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-lg h-[300px] md:h-[400px] relative">
              {HERO_IMAGES.map((img, idx) => (
                  <div 
                    key={idx}
                    className={`absolute inset-0 w-full h-full bg-center bg-cover transition-opacity duration-1000 ease-in-out ${idx === currentHeroIndex ? 'opacity-100' : 'opacity-0'}`}
                    style={{backgroundImage: `url("${img}")`}}
                  ></div>
              ))}
            </div>
            <div className="flex flex-col gap-6 md:w-1/2 md:pl-10">
              <div className="flex flex-col gap-2">
                <span className="text-primary font-bold tracking-wider text-sm uppercase">Về chúng tôi</span>
                <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-[#111418] dark:text-white">
                  Hơn Cả Một <br/> Cửa Hàng Game
                </h1>
                <p className="text-[#617589] dark:text-gray-400 text-lg leading-relaxed mt-2">
                  Trải nghiệm trung tâm giải trí đỉnh cao. Mua sắm các máy chơi game mới nhất, thẻ bài hiếm và đồ chơi xu hướng, hoặc đặt chỗ để chơi cùng bạn bè trong không gian cao cấp của chúng tôi.
                </p>
              </div>
              <div className="flex gap-4">
                <button onClick={onNavigateStores} className="h-12 px-6 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">storefront</span>
                  Xem Cửa Hàng
                </button>
                <button onClick={onNavigateBooking} className="h-12 px-6 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-[#111418] dark:text-white font-bold rounded-lg transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                  Đặt Lịch Chơi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="w-full py-16 px-4 md:px-10 lg:px-40 bg-[#f8fafc] dark:bg-[#0d141c]">
        <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-10">
          <div className="text-center max-w-[800px] mx-auto">
            <h2 className="text-3xl font-bold leading-tight mb-4 text-slate-900 dark:text-white">Tầm Nhìn & Sứ Mệnh</h2>
            <p className="text-[#617589] dark:text-gray-400 text-lg">Xây dựng một cộng đồng game thủ lành mạnh, sôi động cho mọi lứa tuổi với sự cam kết về chất lượng và trải nghiệm.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-4 rounded-xl border border-[#e5e7eb] dark:border-gray-800 bg-white dark:bg-[#101922] p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[28px]">verified_user</span>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Sản Phẩm Chính Hãng</h3>
                <p className="text-[#617589] dark:text-gray-400 text-sm">Nhà bán lẻ ủy quyền cho các thương hiệu game lớn với 100% thiết bị và thẻ bài chính hãng.</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-[#e5e7eb] dark:border-gray-800 bg-white dark:bg-[#101922] p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[28px]">groups</span>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Cộng Đồng Gắn Kết</h3>
                <p className="text-[#617589] dark:text-gray-400 text-sm">Một không gian an toàn, hòa nhập để các game thủ kết nối, thi đấu và giải trí cùng nhau.</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-[#e5e7eb] dark:border-gray-800 bg-white dark:bg-[#101922] p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[28px]">sports_esports</span>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Trải Nghiệm Cao Cấp</h3>
                <p className="text-[#617589] dark:text-gray-400 text-sm">Các trạm chơi game cấu hình cao và chỗ ngồi thoải mái cho hàng giờ chơi không mệt mỏi.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery & Team */}
      <div className="w-full py-16 px-4 md:px-10 lg:px-40 bg-white dark:bg-[#101922]">
        <div className="max-w-[1200px] w-full mx-auto">
          <h2 className="text-3xl font-bold leading-tight mb-10 text-center text-slate-900 dark:text-white">Không Gian & Đội Ngũ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-3 group">
              <div className="w-full aspect-video bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden">
                <div className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-105" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD0nkFuTU-jvFAPZaHyVgySzpizYjpTEjV1nZi6nFzWsseasyjHK0pY9VUQjLDKM-muROxrMfAcRpzkht8MrcywtkIYgFg6ICtFH8Z1Qt8vfBTX9SE0KSm4lje6BK83GPWy0TrJ67hZoNHugUCcR1IDUoJZEHTzpLEzF3-OPWYarqdX1yHDbLp9BB0H8AGEmCKMKPxGcPZDMkSORynjexjuO9yVwtBm8upNw2AtSCXLG2s-VvPd4ZuiBOKxsdCxUy_CS9qvJqsHOg")'}}></div>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">Đấu Trường Gaming</p>
                <p className="text-[#617589] dark:text-gray-400 text-sm">Máy PC và Console cấu hình cao sẵn sàng phục vụ.</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 group">
              <div className="w-full aspect-video bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden">
                <div className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-105" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDH2xDgiPSo8BBaMHts0d4JqHElb8tmQlnLAvUFUXF0AQR4Nr6-ziUVxWenNOCzDLlAm9vfdudWrQT4SEOqy3dJwZsuk3662NcBCf0Xpo0qefaj7gHMspOpwjNVqwceNGrZiigvGdzmgsDGCUny2SPGVF2GGpWTdChrabcIOYixQSF8BKmhu46Nxvp73P-mGLRcUr-llJ0Qn8hbBIsTqqk5Qn_yLi-b3mJAdbLWnUc_ewQwpUMbl4uGEdZ-BB_EYsn8gT0CTREeKw")'}}></div>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">Khu Vực Thẻ Bài</p>
                <p className="text-[#617589] dark:text-gray-400 text-sm">Bàn chơi chuyên dụng cho các giải đấu TCG và giao lưu.</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 group">
              <div className="w-full aspect-video bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden">
                <div className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-105" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBacKpUnhbR_OMy81ftGDiSapoHMRKNOpoioiIB8UQ9V8Ja0MjPZwvMRVTQUN8N829bm_H-Xr6B9MFXQSVUlA9gMPid5h5T42Q0Eg8cJXRYxSVbEJH9a8l5_8LumUVu7r8FMMWr-HjnQWdMlgcaxRNenrE0MWQ3yxjkjoq3WSnXGf7gB-rnP2YXBlzQaZhR9Wz3h7QzRwjU1Jz6XJcWBw66PJM2tVLaheG3SQFL83f01Ce4cRFcUoU4L4hQokfKn7Aotnyjr99XZA")'}}></div>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">Nhân Viên Thân Thiện</p>
                <p className="text-[#617589] dark:text-gray-400 text-sm">Những game thủ chuyên nghiệp sẵn sàng hỗ trợ bạn.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="w-full py-16 px-4 md:px-10 lg:px-40 bg-[#f8fafc] dark:bg-[#0d141c]" id="contact">
        <div className="max-w-[1200px] w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white dark:bg-[#101922] rounded-2xl p-6 md:p-10 shadow-lg border border-[#e5e7eb] dark:border-gray-800">
            {/* Contact Info */}
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Liên Hệ Với Chúng Tôi</h2>
                <p className="text-[#617589] dark:text-gray-400">Bạn có câu hỏi về sản phẩm hay muốn đặt lịch chơi? Hãy liên hệ ngay!</p>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-lg bg-blue-50 dark:bg-gray-800 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">Địa Chỉ</h4>
                    <p className="text-[#617589] dark:text-gray-400 text-sm mt-1">123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-lg bg-blue-50 dark:bg-gray-800 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">Điện Thoại</h4>
                    <p className="text-[#617589] dark:text-gray-400 text-sm mt-1">+84 90 123 4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-lg bg-blue-50 dark:bg-gray-800 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">Email</h4>
                    <p className="text-[#617589] dark:text-gray-400 text-sm mt-1">support@gamestore.vn</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-[#f0f2f4] dark:border-gray-800 pt-6">
                <h4 className="font-bold text-base mb-3 flex items-center gap-2 text-slate-900 dark:text-white">
                  <span className="material-symbols-outlined text-primary">schedule</span>
                  Giờ Mở Cửa
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-[#617589] dark:text-gray-400">
                  <div>
                    <p className="font-medium text-[#111418] dark:text-white">Thứ 2 - Thứ 6</p>
                    <p>09:00 - 22:00</p>
                  </div>
                  <div>
                    <p className="font-medium text-[#111418] dark:text-white">Thứ 7 - Chủ Nhật</p>
                    <p>08:00 - 23:00</p>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <h4 className="font-bold text-base mb-4 text-slate-900 dark:text-white">Theo Dõi Chúng Tôi</h4>
                <div className="flex gap-3">
                  <a className="size-10 rounded-full bg-[#f0f2f4] dark:bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-[#111418] dark:text-white" href="#">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
                  </a>
                  <a className="size-10 rounded-full bg-[#f0f2f4] dark:bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-[#111418] dark:text-white" href="#">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"></path></svg>
                  </a>
                  <a className="size-10 rounded-full bg-[#f0f2f4] dark:bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-[#111418] dark:text-white" href="#">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="flex flex-col gap-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Gửi Tin Nhắn</h3>
              
              {successMessage ? (
                  <div className="flex flex-col items-center justify-center h-full py-10 animate-fade-in-up">
                      <div className="size-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                          <span className="material-symbols-outlined text-4xl">check_circle</span>
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Đã gửi thành công!</h4>
                      <p className="text-center text-slate-500 dark:text-gray-400">{successMessage}</p>
                      <button 
                          onClick={() => setSuccessMessage('')} 
                          className="mt-6 text-primary font-bold hover:underline"
                      >
                          Gửi tin nhắn khác
                      </button>
                  </div>
              ) : (
                  <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-slate-900 dark:text-gray-200">Họ tên</label>
                      <input 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="rounded-lg border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-white" 
                        placeholder="Nhập họ tên của bạn" 
                        type="text"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-slate-900 dark:text-gray-200">Email</label>
                      <input 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="rounded-lg border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-white" 
                        placeholder="example@email.com" 
                        type="email"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-slate-900 dark:text-gray-200">Chủ đề</label>
                      <select 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="rounded-lg border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-white"
                      >
                        <option>Hỗ trợ sản phẩm</option>
                        <option>Đặt lịch chơi</option>
                        <option>Phản ánh dịch vụ</option>
                        <option>Hợp tác kinh doanh</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-slate-900 dark:text-gray-200">Nội dung</label>
                      <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="rounded-lg border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none text-slate-900 dark:text-white" 
                        placeholder="Nhập nội dung tin nhắn..." 
                        rows={4}
                        required
                      ></textarea>
                    </div>
                    <button 
                        disabled={loading}
                        className="mt-2 flex w-full items-center justify-center rounded-lg bg-primary py-3 text-white font-bold hover:bg-blue-600 transition-colors disabled:opacity-70" 
                        type="submit"
                    >
                        {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : 'Gửi Ngay'}
                    </button>
                  </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="w-full h-[400px] bg-gray-200 dark:bg-gray-800 relative group">
        <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAxyC1dEybvNo6wqnmQte6TeipGImQderqhnShE87b3IKHaKkWJsn3XcccZCzXHRU4bR0lBybYW73dqkABPSE6SNhyWnUehW8LtXZ_h_0cCm6vc6I2LmHkuHQrkVGiZQTlJhXgzhZoOi_I_Uirnq9UNwwNk8eQjc9TJ-wJnkLX8GYsoYLJtkx4YjOPyyFbOgsUb03smWl1sKn18qmTo6ABIKrOC97J2Et_2SOQGFDomWrWulD13KEJCkFUIbytV-j6yYEO9P-a3WA")'}}>
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/10 transition-colors">
            <a className="bg-white text-black px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2 hover:scale-105 transition-transform" href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
              <span className="material-symbols-outlined text-primary">map</span>
              Xem trên Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;