import { Product, Category, NewsArticle, Banner, Feature, GameStationImage, Brand, Service, User, Order, Booking, ContactInput, Coupon, StoreLocation } from '../shared/types';

// NEW: User Database with expanded fields
export const USERS_DB: User[] = [
  {
    _id: "u1",
    name: "Game Thủ",
    email: "user@example.com",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxxz9qxHfI3QNFLxT9jQMV_n_0cNH-FJI1HM06Xr_eqczeS-RnFKsWbPQx0lA9rdccuU0GIL_UPQ8u1EGnoLNsUosd1Eq98EstrXgXGVN7Da86LWyGt4NwR1pmds5-6-PaOPn7pRfytD7jT4l8zUYal1q8n0Nw5IJtXFaJCdgZOmfelL74pg9tlToSCkFC5aDBvT853qI0aoh4-7b7uszc4iiCjaY7Eg8lNS1al8pgIlcs7vRIkI56gAKf6pRl__YeK5DiDw0rww",
    role: 'USER',
    password: 'password123',
    phone: '0901234567',
    address: '123 Đường Số 1, Quận 1',
    city: 'Hồ Chí Minh'
  }
];

// NEW: OTP Storage
export const OTP_STORE: Record<string, string> = {};

// NEW: Orders Database
export const ORDERS_DB: Order[] = [];

// NEW: Bookings Database
export const BOOKINGS_DB: Booking[] = [];

// NEW: Contact Messages DB
export const CONTACT_MESSAGES_DB: ContactInput[] = [];

// NEW: Coupons Database
export const COUPONS_DB: Coupon[] = [
  { code: 'GAME10', discount: 10, type: 'PERCENT', description: 'Giảm 10% tối đa 500k', minOrderValue: 500000 },
  { code: 'WELCOMES50', discount: 50000, type: 'FIXED', description: 'Giảm 50k cho đơn từ 1 triệu', minOrderValue: 1000000 },
  { code: 'FREESHIP', discount: 30000, type: 'FIXED', description: 'Miễn phí vận chuyển (tối đa 30k)', minOrderValue: 200000 }
];

// NEW: Stores Database
export const STORES_DB: StoreLocation[] = [
  {
    _id: "hcm-q1",
    name: "GameWorld Quận 1 Flagship",
    address: "123 Đường Nguyễn Huệ, Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    city: "hcm",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQGuc1Skpgc9RYN4sMHNTNsK7wGsENEHutC-F0Tz560Qbu7UGkJTAS7GlcQrwTTdbNXKxzGlgmJY0FLmiKKLPI4fd7RCIjLcVSM-fJdYEwe8rqrl2FK-TbyIhh-lO-ban-kgga3-BX5vd753wFJolxpiy6ahqv3bVaQS_CieAV_Qe5LiwQnKZsgOYx3t0PMPb4Qb8epDqr6U4yTIPHa3Vsa0mvjSISAHGTSgL1wOqjnFdYwPUIcWhXQEZ1RFB0Ps6UMHBTVS4lZg",
    images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDQGuc1Skpgc9RYN4sMHNTNsK7wGsENEHutC-F0Tz560Qbu7UGkJTAS7GlcQrwTTdbNXKxzGlgmJY0FLmiKKLPI4fd7RCIjLcVSM-fJdYEwe8rqrl2FK-TbyIhh-lO-ban-kgga3-BX5vd753wFJolxpiy6ahqv3bVaQS_CieAV_Qe5LiwQnKZsgOYx3t0PMPb4Qb8epDqr6U4yTIPHa3Vsa0mvjSISAHGTSgL1wOqjnFdYwPUIcWhXQEZ1RFB0Ps6UMHBTVS4lZg",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBxoV3kEbK337tSIIGQ29-5AsY-2u7FUa4TkbVAQm81xYcqrHl18ZD-K2YjsjkK46c4XBmFeYAu-wNmepoldxOBhmKpC9SZEh3Sy7kANGRP9bU6Pt2Lbezskndl3wABWHK3qotmxcsdR-M_DTlE77jso7As0CHrsmgM4w4o1T_rLj_XB7yMKcsMUH7y1bXMyASEyBc1vEP4vycgDI56AlXDT0M2J0nJqldvKuWV0rbN79iG__zzkGfSJnwD5MsN1lVAmkAT92pPfw",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBVoc9MQkhc0xlxGJeWWRaKuVx4rjT44fuoFD4UIXs5G43aKSMLZhFezDDjyLjX6waBXVSlRGWPf9oKoHTwH_G0yhNBs3fGIftBNVlpR3UD9S6Fs5xKEa2RBt8c4KJMniiyChZjDijGHOqZfJx_7BxhaISmsbzwF7P9I-3Aq7bRSoSr7AG31M0tm4XytFPjVLgMXAKQr1gXHV03pCV_rHS6DdLhuRZJvJd2Tt_ir9uVwHephOmlA619L1etyz9n5ScLTrHC9wbHdg"
    ],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4946681007846!2d106.70175551474896!3d10.773374292323565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a3b49e59%3A0xa2726315a8c176b9!2sHo%20Chi%20Minh%20City!5e0!3m2!1sen!2s!4v1625633652876!5m2!1sen!2s",
    phone: "1900 1234",
    hours: {
      weekday: "09:00 - 22:00",
      weekend: "08:00 - 23:00"
    },
    amenities: [
      { icon: "wifi", label: "Wi-Fi Tốc độ cao (WiFi 6)", colorClass: "text-green-600 bg-green-50" },
      { icon: "local_parking", label: "Chỗ đậu xe miễn phí", colorClass: "text-blue-600 bg-blue-50" },
      { icon: "fastfood", label: "Khu vực F&B & Snack", colorClass: "text-orange-600 bg-orange-50" },
      { icon: "ac_unit", label: "Máy lạnh 24/7", colorClass: "text-indigo-600 bg-indigo-50" },
      { icon: "storefront", label: "Shop bán thẻ & Figure", colorClass: "text-pink-600 bg-pink-50" },
      { icon: "wc", label: "WC sạch sẽ tiện nghi", colorClass: "text-yellow-600 bg-yellow-50" }
    ],
    equipment: [
      { icon: "sports_esports", name: "PS5 Pro", count: 10, colorClass: "text-primary" },
      { icon: "stadia_controller", name: "Switch OLED", count: 8, colorClass: "text-red-500" },
      { icon: "desktop_windows", name: "PC RTX 4090", count: 20, colorClass: "text-purple-600" },
      { icon: "joystick", name: "Xbox Series X", count: 4, colorClass: "text-green-600" }
    ]
  },
  {
    _id: "hcm-q7",
    name: "GameWorld Crescent Mall",
    address: "101 Tôn Dật Tiên, Tân Phú, Quận 7, TP.HCM",
    city: "hcm",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuASvtfge3PsR4i7Un-kAcEoyg0hruOU1f50La2O_JEQ-bDgnp29rrQ51lk-G8_S-rYqWdfJg5Ub3sRWjQFPiYxN17BtJHZnR4lciBLRQBGlu4k4sQVa_DS7-h8RiMO_8SamoYTWesmgtlctCLc4_kubB19_dNIPIUgbjKsXGUQ3xCHgX0dKh1aYX3n9f2fHQ_0usrh2PkQthHhFCNHuvRJ5xVOjZEJOVO-1FrEdz1GkXByCMl5oShzEwn9YY2ZotpMzYl9_KS6wfA",
    images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuASvtfge3PsR4i7Un-kAcEoyg0hruOU1f50La2O_JEQ-bDgnp29rrQ51lk-G8_S-rYqWdfJg5Ub3sRWjQFPiYxN17BtJHZnR4lciBLRQBGlu4k4sQVa_DS7-h8RiMO_8SamoYTWesmgtlctCLc4_kubB19_dNIPIUgbjKsXGUQ3xCHgX0dKh1aYX3n9f2fHQ_0usrh2PkQthHhFCNHuvRJ5xVOjZEJOVO-1FrEdz1GkXByCMl5oShzEwn9YY2ZotpMzYl9_KS6wfA",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC4_vB1t508LKMfaQlvsTjnYf_69vj7F5kNTZs2poV9Xhms_ZjdWRAtsVemHWYa3bgkFAsNfTt7LsRmBViZVg7Mte9xpJ0fmI15rwXiUnc0_vPalxYqS0nHTFiXFkYHbkpQKBEtTp3XQfJAD4hmAlXQgU8YXW52HnhWfJmvn-fxTQ3i2ynjJGMI_lxGTBwmbU5taJ7KtlGbFJQxDuJ2GIJdCIT3HsC3lIXCz13SCt8CK8Ubu5fSVTjQLojRxXc90aseFl2fmX1txw"
    ],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.669726937899!2d106.71638231474885!3d10.759917992332152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f9023a3a85d%3A0x9259bad475336d5c!2sCrescent%20Mall!5e0!3m2!1sen!2s!4v1625633652876!5m2!1sen!2s",
    phone: "1900 5678",
    hours: {
      weekday: "10:00 - 22:00",
      weekend: "09:00 - 23:00"
    },
    amenities: [
      { icon: "wifi", label: "Wi-Fi 6", colorClass: "text-green-600 bg-green-50" },
      { icon: "local_cafe", label: "Quầy Bar", colorClass: "text-orange-600 bg-orange-50" },
      { icon: "local_parking", label: "Hầm để xe TTTM", colorClass: "text-blue-600 bg-blue-50" }
    ],
    equipment: [
      { icon: "sports_esports", name: "PS5", count: 15, colorClass: "text-primary" },
      { icon: "desktop_windows", name: "PC Gaming", count: 10, colorClass: "text-purple-600" }
    ]
  },
  {
    _id: "hn-cg",
    name: "GameWorld Cầu Giấy",
    address: "241 Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy, Hà Nội",
    city: "hn",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDD5oFLKS7zzAUlmuwmm3MuXcJESRBgmbdWVmnrQQ5EkLfN8xqLHav_diAc0mBsNXV31b6uKFHT9TfCJTB7MoQm4dTLunyVdxVju7AXfWWoZ0QsZl6ZGUPcdEawqnQBgbSEyGNI43-lRsj8HNeobwfM5sjIiXr4jMEsJ40w2yxtOxoTfBftzGvEayGVV5G6aOaSvEwa578GvZwKsOHTJJGGZrNCbb34ixOd5pXkMj-k8sTwsuBLalMnYsrgXU2C2Vvo88xbaJ2H1w",
    images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDD5oFLKS7zzAUlmuwmm3MuXcJESRBgmbdWVmnrQQ5EkLfN8xqLHav_diAc0mBsNXV31b6uKFHT9TfCJTB7MoQm4dTLunyVdxVju7AXfWWoZ0QsZl6ZGUPcdEawqnQBgbSEyGNI43-lRsj8HNeobwfM5sjIiXr4jMEsJ40w2yxtOxoTfBftzGvEayGVV5G6aOaSvEwa578GvZwKsOHTJJGGZrNCbb34ixOd5pXkMj-k8sTwsuBLalMnYsrgXU2C2Vvo88xbaJ2H1w",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBxoV3kEbK337tSIIGQ29-5AsY-2u7FUa4TkbVAQm81xYcqrHl18ZD-K2YjsjkK46c4XBmFeYAu-wNmepoldxOBhmKpC9SZEh3Sy7kANGRP9bU6Pt2Lbezskndl3wABWHK3qotmxcsdR-M_DTlE77jso7As0CHrsmgM4w4o1T_rLj_XB7yMKcsMUH7y1bXMyASEyBc1vEP4vycgDI56AlXDT0M2J0nJqldvKuWV0rbN79iG__zzkGfSJnwD5MsN1lVAmkAT92pPfw"
    ],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.863980698379!2d105.7818383147634!3d21.038127985993215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab354920c233%3A0x5d0313a3bf853630!2zXuG6oW4gVGjhuqNvLCBD4bqndSBHaeG6pXksIEjDoCBO4buZaQ!5e0!3m2!1sen!2s!4v1625633652876!5m2!1sen!2s",
    phone: "024 3789 9999",
    hours: {
      weekday: "09:00 - 22:30",
      weekend: "08:00 - 23:00"
    },
    amenities: [
      { icon: "wifi", label: "Wi-Fi", colorClass: "text-green-600 bg-green-50" },
      { icon: "local_cafe", label: "Coffee", colorClass: "text-brown-600 bg-amber-50" }
    ],
    equipment: [
      { icon: "desktop_windows", name: "PC RTX 3080", count: 30, colorClass: "text-purple-600" },
      { icon: "sports_esports", name: "PS5", count: 5, colorClass: "text-primary" }
    ]
  },
  {
    _id: "dn-st",
    name: "GameWorld Sơn Trà",
    address: "45 Võ Văn Kiệt, Phước Mỹ, Sơn Trà, Đà Nẵng",
    city: "dn",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6spfHfqbUIu9sDrh08xH-W-CIx6hwXTpjUwKSaY4vz-Y8lbog6fuYEP0V3LhPP5W2R17tpegD7qGAQykkgru9EZT_c5vZyV-QacVDkLUhXYTM310XDY00TEOVUO8gbzzdEWiWbuEBt_H1Al9Q42BEYmjrG0DYwz8TnG4g1ZMEgfVBxThEvvIVhj1M5tDgWd7UQ1SU64qkKBuSIJ9CJ3lRou-QI8cqLNmafEgNelJqvjSwSeAikdInkgOsu-yOrqsnMcycFD1UyQ",
    images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA6spfHfqbUIu9sDrh08xH-W-CIx6hwXTpjUwKSaY4vz-Y8lbog6fuYEP0V3LhPP5W2R17tpegD7qGAQykkgru9EZT_c5vZyV-QacVDkLUhXYTM310XDY00TEOVUO8gbzzdEWiWbuEBt_H1Al9Q42BEYmjrG0DYwz8TnG4g1ZMEgfVBxThEvvIVhj1M5tDgWd7UQ1SU64qkKBuSIJ9CJ3lRou-QI8cqLNmafEgNelJqvjSwSeAikdInkgOsu-yOrqsnMcycFD1UyQ",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBVoc9MQkhc0xlxGJeWWRaKuVx4rjT44fuoFD4UIXs5G43aKSMLZhFezDDjyLjX6waBXVSlRGWPf9oKoHTwH_G0yhNBs3fGIftBNVlpR3UD9S6Fs5xKEa2RBt8c4KJMniiyChZjDijGHOqZfJx_7BxhaISmsbzwF7P9I-3Aq7bRSoSr7AG31M0tm4XytFPjVLgMXAKQr1gXHV03pCV_rHS6DdLhuRZJvJd2Tt_ir9uVwHephOmlA619L1etyz9n5ScLTrHC9wbHdg"
    ],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.823439498263!2d108.24343831470532!3d16.06906598888126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314217743d71239d%3A0x805908221626572!2sV%C3%B5%20V%C4%83n%20Ki%E1%BB%87t%2C%20S%C6%A1n%20Tr%C3%A0%2C%20%C4%90%C3%A0%20N%E1%BA%B5ng!5e0!3m2!1sen!2s!4v1625633652876!5m2!1sen!2s",
    phone: "0236 3123 456",
    hours: {
      weekday: "08:00 - 22:00",
      weekend: "08:00 - 23:00"
    },
    amenities: [
      { icon: "wifi", label: "Wi-Fi", colorClass: "text-green-600 bg-green-50" },
      { icon: "ac_unit", label: "Máy lạnh", colorClass: "text-blue-600 bg-blue-50" }
    ],
    equipment: [
      { icon: "desktop_windows", name: "PC Gaming", count: 40, colorClass: "text-purple-600" }
    ]
  }
];

export const BANNERS_DB: Banner[] = [
  {
    _id: "b1",
    badge: "Sản phẩm tiêu biểu",
    title: "PlayStation 5",
    highlightText: "Slim Edition",
    description: "Kích thước nhỏ gọn, sức mạnh không đổi. Trải nghiệm gaming đỉnh cao với thiết kế mới tinh tế hơn.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBboKbbC_aBHIBmwqitpDUi92wZPdBPhMo6aXYNcfvFiQuayZACEzP0a70HVIrqrmvd3WfIJXw1WRIMW1_kn6mPX_yUOoTk2jjByjgmtKNmcpOa10TJeAgj3zQ5enho7gBF7A0MjWoLs_ZXVWSt0JiNDJpo_Ou8XkZ86ngnVGmtAVxImaMTg1YPS1tZXdxzbXl3E5qGV2aqw1BbqAJlklxpoYQqTvBfhVcibJzY1COrnwHqyQd-ksQIXPTV3vnK13XolB-T9OD88w",
    primaryBtn: "Mua Ngay",
    secondaryBtn: "Xem Chi Tiết",
    stats: [
      { text: "4K", label: "", bg: "bg-blue-600 text-white font-bold" },
      { text: "120", label: "FPS", bg: "bg-indigo-500 text-white font-bold" },
      { text: "+1k", label: "Đã bán", bg: "bg-white text-slate-900 font-bold border border-gray-200" }
    ]
  },
  {
    _id: "b2",
    badge: "Mới ra mắt",
    title: "Nintendo Switch",
    highlightText: "OLED Model",
    description: "Màn hình OLED 7 inch rực rỡ, chân đế rộng có thể điều chỉnh, dock có cổng LAN và bộ nhớ trong 64GB.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAW-1iR9Nt_HIZFlN_18kus6czP58L7iGzmfYIZj8cPSTGbq_SoJlLl5UUfWKx9OlECs-IpDKfuI1PBZAJX46euO75j5IDv1-Uz6Lxt3FGxmxp_OkqhJRrZqO4aGTLw9yJuWil8RGnQINlmBDo38WJ7EvBbjQ7PN9oSR44EUv7TfuMHPoGnVOJ8PvuSD0sUrxzSOgbfbo77WF6ZvPFeMtfYLw9FsdEae0-4cxvCGtwfRp2BIiJXVe0Kdw1zuBaxDhXUqMRzpCmYg", 
    primaryBtn: "Khám Phá",
    secondaryBtn: "So Sánh",
    stats: [
      { text: "7\"", label: "OLED", bg: "bg-red-600 text-white font-bold" },
      { text: "64", label: "GB", bg: "bg-gray-800 text-white font-bold" },
      { text: "Hot", label: "Trend", bg: "bg-yellow-400 text-slate-900 font-bold" }
    ]
  },
  {
    _id: "b3",
    badge: "Limited Edition",
    title: "Gaming Gear",
    highlightText: "Bộ Sưu Tập ROG",
    description: "Nâng tầm trải nghiệm với trọn bộ Gaming Gear cao cấp từ ASUS ROG. Bàn phím cơ, chuột siêu nhẹ và tai nghe 7.1.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4_vB1t508LKMfaQlvsTjnYf_69vj7F5kNTZs2poV9Xhms_ZjdWRAtsVemHWYa3bgkFAsNfTt7LsRmBViZVg7Mte9xpJ0fmI15rwXiUnc0_vPalxYqS0nHTFiXFkYHbkpQKBEtTp3XQfJAD4hmAlXQgU8YXW52HnhWfJmvn-fxTQ3i2ynjJGMI_lxGTBwmbU5taJ7KtlGbFJQxDuJ2GIJdCIT3HsC3lIXCz13SCt8CK8Ubu5fSVTjQLojRxXc90aseFl2fmX1txw",
    primaryBtn: "Mua Ngay",
    secondaryBtn: "Xem Review",
    stats: [
      { text: "RGB", label: "Aura", bg: "bg-purple-600 text-white font-bold" },
      { text: "-20%", label: "Sale", bg: "bg-red-500 text-white font-bold" },
      { text: "Free", label: "Ship", bg: "bg-green-500 text-white font-bold" }
    ]
  }
];

export const GAME_STATION_IMAGES_DB: GameStationImage[] = [
  {
    _id: "img1",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxoV3kEbK337tSIIGQ29-5AsY-2u7FUa4TkbVAQm81xYcqrHl18ZD-K2YjsjkK46c4XBmFeYAu-wNmepoldxOBhmKpC9SZEh3Sy7kANGRP9bU6Pt2Lbezskndl3wABWHK3qotmxcsdR-M_DTlE77jso7As0CHrsmgM4w4o1T_rLj_XB7yMKcsMUH7y1bXMyASEyBc1vEP4vycgDI56AlXDT0M2J0nJqldvKuWV0rbN79iG__zzkGfSJnwD5MsN1lVAmkAT92pPfw",
    alt: "Phòng VIP 1"
  },
  {
    _id: "img2",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVoc9MQkhc0xlxGJeWWRaKuVx4rjT44fuoFD4UIXs5G43aKSMLZhFezDDjyLjX6waBXVSlRGWPf9oKoHTwH_G0yhNBs3fGIftBNVlpR3UD9S6Fs5xKEa2RBt8c4KJMniiyChZjDijGHOqZfJx_7BxhaISmsbzwF7P9I-3Aq7bRSoSr7AG31M0tm4XytFPjVLgMXAKQr1gXHV03pCV_rHS6DdLhuRZJvJd2Tt_ir9uVwHephOmlA619L1etyz9n5ScLTrHC9wbHdg",
    alt: "Khu vực PS5"
  },
  {
    _id: "img3",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4_vB1t508LKMfaQlvsTjnYf_69vj7F5kNTZs2poV9Xhms_ZjdWRAtsVemHWYa3bgkFAsNfTt7LsRmBViZVg7Mte9xpJ0fmI15rwXiUnc0_vPalxYqS0nHTFiXFkYHbkpQKBEtTp3XQfJAD4hmAlXQgU8YXW52HnhWfJmvn-fxTQ3i2ynjJGMI_lxGTBwmbU5taJ7KtlGbFJQxDuJ2GIJdCIT3HsC3lIXCz13SCt8CK8Ubu5fSVTjQLojRxXc90aseFl2fmX1txw",
    alt: "Phòng Stream"
  }
];

export const FEATURES_DB: Feature[] = [
  {
    _id: "f1",
    icon: "verified_user",
    color: "text-blue-600 bg-blue-50",
    title: "Bảo Hành Chính Hãng",
    description: "Cam kết 100% sản phẩm chính hãng, bảo hành 12-24 tháng theo tiêu chuẩn nhà sản xuất."
  },
  {
    _id: "f2",
    icon: "rocket_launch",
    color: "text-green-600 bg-green-50",
    title: "Giao Hàng Hỏa Tốc",
    description: "Nhận hàng trong 2H nội thành HCM & HN. Đóng gói chống sốc chuyên nghiệp."
  },
  {
    _id: "f3",
    icon: "loyalty",
    color: "text-purple-600 bg-purple-50",
    title: "Ưu Đãi Hội Viên",
    description: "Tích điểm đổi quà, giảm giá sinh nhật và ưu đãi đặc quyền cho khách hàng thân thiết."
  }
];

export const BRANDS_DB: Brand[] = [
  { _id: "br1", name: "Sony", slug: "sony" },
  { _id: "br2", name: "Nintendo", slug: "nintendo" },
  { _id: "br3", name: "Konami", slug: "konami" },
  { _id: "br4", name: "Bandai", slug: "bandai" },
  { _id: "br5", name: "Logitech", slug: "logitech" },
  { _id: "br6", name: "Razer", slug: "razer" },
  { _id: "br7", name: "Microsoft", slug: "microsoft" }
];

export const SERVICES_DB: Service[] = [
  {
    _id: "sv1",
    name: "Phòng Máy PS5 Standard",
    description: "Trải nghiệm PS5 trên màn hình 4K 65 inch, âm thanh soundbar sống động. Ghế sofa thoải mái cho 2 người.",
    pricePerHour: 40000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVoc9MQkhc0xlxGJeWWRaKuVx4rjT44fuoFD4UIXs5G43aKSMLZhFezDDjyLjX6waBXVSlRGWPf9oKoHTwH_G0yhNBs3fGIftBNVlpR3UD9S6Fs5xKEa2RBt8c4KJMniiyChZjDijGHOqZfJx_7BxhaISmsbzwF7P9I-3Aq7bRSoSr7AG31M0tm4XytFPjVLgMXAKQr1gXHV03pCV_rHS6DdLhuRZJvJd2Tt_ir9uVwHephOmlA619L1etyz9n5ScLTrHC9wbHdg",
    amenities: ["Màn hình 65\" 4K", "2 Tay cầm", "Nước uống Free", "Máy lạnh"]
  },
  {
    _id: "sv2",
    name: "PC Gaming Room VIP",
    description: "Dàn PC cấu hình khủng RTX 4090, màn hình 360Hz. Gear xịn full Razer/Logitech. Không gian riêng tư cách âm.",
    pricePerHour: 30000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxoV3kEbK337tSIIGQ29-5AsY-2u7FUa4TkbVAQm81xYcqrHl18ZD-K2YjsjkK46c4XBmFeYAu-wNmepoldxOBhmKpC9SZEh3Sy7kANGRP9bU6Pt2Lbezskndl3wABWHK3qotmxcsdR-M_DTlE77jso7As0CHrsmgM4w4o1T_rLj_XB7yMKcsMUH7y1bXMyASEyBc1vEP4vycgDI56AlXDT0M2J0nJqldvKuWV0rbN79iG__zzkGfSJnwD5MsN1lVAmkAT92pPfw",
    amenities: ["RTX 4090", "Màn 360Hz", "Ghế Gaming", "Đồ ăn phục vụ"]
  }
];

export const CATEGORIES_DB: Category[] = [
  {
    _id: "c1",
    name: "PlayStation",
    subtitle: "Console & Games",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBboKbbC_aBHIBmwqitpDUi92wZPdBPhMo6aXYNcfvFiQuayZACEzP0a70HVIrqrmvd3WfIJXw1WRIMW1_kn6mPX_yUOoTk2jjByjgmtKNmcpOa10TJeAgj3zQ5enho7gBF7A0MjWoLs_ZXVWSt0JiNDJpo_Ou8XkZ86ngnVGmtAVxImaMTg1YPS1tZXdxzbXl3E5qGV2aqw1BbqAJlklxpoYQqTvBfhVcibJzY1COrnwHqyQd-ksQIXPTV3vnK13XolB-T9OD88w",
    icon: "stadia_controller",
    slug: "playstation",
    code: "PLAYSTATION"
  },
  {
    _id: "c2",
    name: "Nintendo",
    subtitle: "Switch & Accessories",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAW-1iR9Nt_HIZFlN_18kus6czP58L7iGzmfYIZj8cPSTGbq_SoJlLl5UUfWKx9OlECs-IpDKfuI1PBZAJX46euO75j5IDv1-Uz6Lxt3FGxmxp_OkqhJRrZqO4aGTLw9yJuWil8RGnQINlmBDo38WJ7EvBbjQ7PN9oSR44EUv7TfuMHPoGnVOJ8PvuSD0sUrxzSOgbfbo77WF6ZvPFeMtfYLw9FsdEae0-4cxvCGtwfRp2BIiJXVe0Kdw1zuBaxDhXUqMRzpCmYg",
    icon: "videogame_asset",
    slug: "nintendo",
    code: "NINTENDO"
  },
  {
    _id: "c3",
    name: "Xbox",
    subtitle: "Console & GamePass",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEjKtTrMb_Ru1KabqxAbwfbf7HDxun7XCXfwQuZMs5QUYtBAzTmXTYzYJC9QA-YKz6d804i9AV3XXfPPhUvQWI_1ryQwiRcgNRwJpAlvW-X31ak2MlQ00c84ENIsIltkzIA5Fd7E3JbWNLovArpNGhxgQ1h4Hpd_YjYV5YFhjOFZWSFsBYeHmBhmayOQHdUmu5AxTEVI8qeZhHCnkEQfFNtMtRGsr7Yi3c8pH5EG8uCXJPuCT8ORbaU9PLa3maCinjf53Ez6GJug",
    icon: "toys",
    slug: "xbox",
    code: "XBOX"
  },
  {
    _id: "c4",
    name: "Phụ Kiện",
    subtitle: "Gaming Gear",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4_vB1t508LKMfaQlvsTjnYf_69vj7F5kNTZs2poV9Xhms_ZjdWRAtsVemHWYa3bgkFAsNfTt7LsRmBViZVg7Mte9xpJ0fmI15rwXiUnc0_vPalxYqS0nHTFiXFkYHbkpQKBEtTp3XQfJAD4hmAlXQgU8YXW52HnhWfJmvn-fxTQ3i2ynjJGMI_lxGTBwmbU5taJ7KtlGbFJQxDuJ2GIJdCIT3HsC3lIXCz13SCt8CK8Ubu5fSVTjQLojRxXc90aseFl2fmX1txw",
    icon: "headphones",
    slug: "accessories",
    code: "ACCESSORIES"
  }
];

export const ARTICLES_DB: NewsArticle[] = [
  {
    _id: "n1",
    title: "Sony chính thức công bố PS5 Pro với hiệu năng tăng 45%",
    excerpt: "Phiên bản nâng cấp giữa vòng đời của PlayStation 5 hứa hẹn mang lại trải nghiệm 4K 60fps ổn định cho mọi tựa game AAA.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4gp_7FG2yU6PEHg4dMrv1sH2WP-g2uooiD8yztRruCFmB4Y4Au9KFYJog_88xjl4_fcj-BddbZv0UuFw1i-VQghoofNN6qqxmfmAF9YR2JfX9CSiD-4-CtC9NsaE_hpNvqMolB2MSXcDTvZXfoIfW7w3KDsfPJRa6FJRPlCKgg9zC6pui6tDSStd0BrRk9yGmGKCw8gBP9pJW5di_5fqEF6q7ARlm5bLwF3YWcoomV8c09XvRYw1qgh5RfudSUCWOZ3-Sq5NpMQ",
    category: "CÔNG NGHỆ",
    categoryColor: "text-blue-600 bg-blue-50",
    date: "12/03/2024",
    readTime: "5 phút đọc"
  },
  {
    _id: "n2",
    title: "Top 10 game hay nhất trên Nintendo Switch năm 2024",
    excerpt: "Tổng hợp những tựa game không thể bỏ qua cho các fan của Nintendo trong năm nay, từ Mario đến Zelda.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAW-1iR9Nt_HIZFlN_18kus6czP58L7iGzmfYIZj8cPSTGbq_SoJlLl5UUfWKx9OlECs-IpDKfuI1PBZAJX46euO75j5IDv1-Uz6Lxt3FGxmxp_OkqhJRrZqO4aGTLw9yJuWil8RGnQINlmBDo38WJ7EvBbjQ7PN9oSR44EUv7TfuMHPoGnVOJ8PvuSD0sUrxzSOgbfbo77WF6ZvPFeMtfYLw9FsdEae0-4cxvCGtwfRp2BIiJXVe0Kdw1zuBaxDhXUqMRzpCmYg",
    category: "GAME",
    categoryColor: "text-red-600 bg-red-50",
    date: "10/03/2024",
    readTime: "8 phút đọc"
  },
  {
    _id: "n3",
    title: "Giải đấu Pokemon TCG: Road to World Championship 2024",
    excerpt: "Thông tin chi tiết về giải đấu thẻ bài Pokemon lớn nhất năm tại Việt Nam. Cơ hội giành vé đi Hawaii.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfMMUm8DhB21rNEC9PHm47iZnqEzDeiduejhRPidBuFKt3RJieG4rEyPeNFsEyepi6A9AVeQJtrz9mvDpAhHhIog0mCxrG4oCCGy6L2_TUWM_gkgFjjm0d5Gqk9RAn-PLLaEU47-pdmV2oH2nDZDHdAE3ULm7gE14ZTUPl-Lcwo2t_o_S7kpyBT8MPUmZHSz8fNbwzV4PLp0aM3UlJMospkdOOhlRFWQ41Y57vFoOnc5N3aHPltsWqY77CbW3GruoEBQTAwFgWYg",
    category: "SỰ KIỆN",
    categoryColor: "text-purple-600 bg-purple-50",
    date: "08/03/2024",
    readTime: "3 phút đọc"
  }
];

// Base Products - Renamed to PRODUCTS_DB for export
export const PRODUCTS_DB: Product[] = [
  {
    _id: "p1",
    name: "Sony PlayStation 5 Standard Edition",
    category: "PLAYSTATION",
    price: 12990000,
    originalPrice: 14500000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4gp_7FG2yU6PEHg4dMrv1sH2WP-g2uooiD8yztRruCFmB4Y4Au9KFYJog_88xjl4_fcj-BddbZv0UuFw1i-VQghoofNN6qqxmfmAF9YR2JfX9CSiD-4-CtC9NsaE_hpNvqMolB2MSXcDTvZXfoIfW7w3KDsfPJRa6FJRPlCKgg9zC6pui6tDSStd0BrRk9yGmGKCw8gBP9pJW5di_5fqEF6q7ARlm5bLwF3YWcoomV8c09XvRYw1qgh5RfudSUCWOZ3-Sq5NpMQ",
    tags: ["HOT"],
    rating: 4.9,
    reviewCount: 128,
    brand: "Sony",
    slug: "ps5-standard",
    stock: 50,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD4gp_7FG2yU6PEHg4dMrv1sH2WP-g2uooiD8yztRruCFmB4Y4Au9KFYJog_88xjl4_fcj-BddbZv0UuFw1i-VQghoofNN6qqxmfmAF9YR2JfX9CSiD-4-CtC9NsaE_hpNvqMolB2MSXcDTvZXfoIfW7w3KDsfPJRa6FJRPlCKgg9zC6pui6tDSStd0BrRk9yGmGKCw8gBP9pJW5di_5fqEF6q7ARlm5bLwF3YWcoomV8c09XvRYw1qgh5RfudSUCWOZ3-Sq5NpMQ",
    ]
  },
  {
    _id: "p2",
    name: "Hộp Thẻ Bài Pokemon: Scarlet & Violet Elite Trainer Box",
    category: "TCG",
    price: 1250000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfMMUm8DhB21rNEC9PHm47iZnqEzDeiduejhRPidBuFKt3RJieG4rEyPeNFsEyepi6A9AVeQJtrz9mvDpAhHhIog0mCxrG4oCCGy6L2_TUWM_gkgFjjm0d5Gqk9RAn-PLLaEU47-pdmV2oH2nDZDHdAE3ULm7gE14ZTUPl-Lcwo2t_o_S7kpyBT8MPUmZHSz8fNbwzV4PLp0aM3UlJMospkdOOhlRFWQ41Y57vFoOnc5N3aHPltsWqY77CbW3GruoEBQTAwFgWYg",
    rating: 4.8,
    reviewCount: 85,
    brand: "Nintendo",
    slug: "pokemon-tcg-box",
    stock: 100
  },
  {
    _id: "p3",
    name: "Nintendo Switch OLED Model - White Joy-Con",
    category: "NINTENDO",
    price: 8290000,
    originalPrice: 9500000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2S-gJE6h1iuL6Ps0U3HJ90-oqrWw70SI7gZxrUVCK6whv8l9fvNG04dqB65Eh7o46aGEAZ8RxalvMMtKyr3Sc-pS-Bdk_psOZxCaBbu6_bqQwNS5v4qHZC2U17p8La40fDvRkqSMzjCfNV9aGCkFDYP8C5iHLy2DkDCHRpCI_7_QDI6k0dxEZHR0bHLoQgKLbYlbNOUcmcHEjJTfqffiwKMKaWDbiLOLi8I3O2UEP6xl4jcrqD79_7bGHUQ8auVak3KbzLTZu2A",
    rating: 4.8,
    reviewCount: 128,
    brand: "Nintendo",
    slug: "switch-oled-white",
    stock: 25,
    colors: [
      { name: "Trắng", hex: "#ffffff" },
      { name: "Neon", hex: "#ef4444" },
      { name: "Đen", hex: "#111827" }
    ],
    description: "Nintendo Switch OLED Model là phiên bản nâng cấp mới nhất với màn hình OLED 7 inch rực rỡ, mang lại màu sắc sống động và độ tương phản sắc nét khi chơi ở chế độ cầm tay. Chân đế rộng có thể điều chỉnh giúp bạn thoải mái chơi ở chế độ để bàn với góc nhìn tùy thích.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDDO5iD3HYKw_n0GTvYboLYrg7cSK5zPRxGHUcxLm1ay5tyyvjeCfEz00Troc8yd7RwAuyxM45Dh2NfiHD2viORnoj6FPJx4Orf4jkziNqsBH5MO5FOGwtZaD6KyMQXVCqpvuBufoTjIkuLHZpPC98ce2Ub-HGSndFOIpimRtU5ZRW1PqNu_G8BGdlo1D0CfdS1vD7ymySg4SRGeMT-UgIawjrgYbiQ4sYCtLIRO7IpqFoazb4DdTXiX5BbL9jsyB9eG72G-ZQ7Jg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD8bq-NAytyXeduiciBytrXQr3sl5BmiTKt9wVZbXUG_PBesazvxm0GsEr5Km5UrtOI4GmSGtrJei1vnbypxkyDUjQl0LPm8mQOtcqhFwqJhCKoxneBZaaJpMKIvBbWnmm5HOOkDyCc79Zau9E3Xeze-4UkdVx5ZpRnf_JiGboDShilpN6crMVfNswwMxd6VvfhYHAJstC6hCVQhtt3yL-oOvgPHp6FomSx3QurdVZ_AJEURe2dz_DOo_-wNgnEr22YdhJfTWSAZg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDNVJ9IdIyuJWKoSVW5_RrmNv9YYN8uTTrOTvT43Jm91dKtQOkXIuJ8KQXSHl-zUChahHXm3sJScYrfHbrJaDliSGpmIxtv6fn-glcf30S1qSGswb0PKuU1RvwnUv5l6_VPFq65Yybmyg-uYRczbDfYOkraUqGjtAPYrg6ggkxWlZqvgQe4bMKf6YQbNvJB_RXaNc_fKAykzNihsa5xbquLmCek3pLT_0CJ2-yEHt6kxcQ1miChWX7qvhz1KXwz1IyTVHRQP9dWzg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCon-zzOC70HSyuQ2Lm-_bmFmWcgeJyePIyBkBbLLdKvV3rqgSsnQJsrn2tp2pQ1h-3RMwZri9NRlZ6NOVFPQmBGp7GKfbvMPfVgv3-qL3eRKuxxhBxrnopuUstbuxw7jXx5S6yvV_lcFw2BlVi5y1MUmZQdfsoFgsTR9Y0ZO9dU85KFy0QYnyAB7pmcqOn32BxbzVsbtZn_LyzqdtUMa5isFiK9YJnJjvgTyPezf3khxO1u342ZIphgpzRVu2Nu6FaheCUGqPWqQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCEiDGdOKVrahTsE75_ceRWU6A9Zb8kTioo2O6EeD-Zf1Su46RwgS6KWd3I6Gn5nB3m6Vw50I2w298jdy49KUSpYBwLr0tJ-piam8u1L5k8O-NnPuMjTdVf-oNZeDCYgf3qXfQpPjkHqrV_JOR277hOUiuLKK8KKYELedHZKDIZEpekRrIfjolyIaaefQBZHv-jVAlcvXS5aLFLJCAN2CQ_0EafOty65NFt2OsoBSXWivv4YjBf6WVPM7652PT32TdpkJ-dK6f65w"
    ]
  },
  // NEW PRODUCTS FOR CART CROSS-SELL
  {
    _id: "p7",
    name: "Bọc bài thẻ game trong suốt (100 cái)",
    category: "ACCESSORIES",
    price: 50000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCekYI_b7A0BXtSYwaOUFVsjB17koaBh_sNfVhWg759L7JORum_OF-8d4D5_JpdFm2w_xrRamT4cUCO0Ew2pN2I5-yxsGo2xuFAshtnYQGchUbAusrB1tHTYj-ykJh7pjp-SBuObY3DNwcM2elMw9SfVrwzon2WkAi3aQyPRxCVVNsFoadZN2lDC8bUj-YlBPrOhNc2rF4JAHTCddeVh4KhvpYVAZ03QZu6upg4Wvlwc531zBpU6wHvEfUBgwv4YNO8bDvhWbDeew",
    rating: 4.5,
    reviewCount: 200,
    brand: "OEM",
    slug: "card-sleeves",
    stock: 500
  },
  {
    _id: "p8",
    name: "Pin AA Energizer (Vỉ 4 viên)",
    category: "ACCESSORIES",
    price: 45000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-ijGF_dbJxDWuyJuVDCba4J3K0By0orLwrnuN1sjuLSyoulO8zPxxG1NTD_hQAW7Y5EeRtcBmYqS58Pe6tJ-1-m3e5afWbx-WIhKdPfODzN8t98MhURedbZ9it1Uc-wNKbA7iUNvu5B9sZZ_iENvu_Ps61EG60JvvmDoIbxYKKa-mgINPh6JQS7O7eVycpdcoSajBtzNWHOkJAWH8Wz3OjW2ruJZeqymDXP4amBaSOFxHnE8hGiWCCdslwB0p213MH7QIFOeEFQ",
    rating: 4.8,
    reviewCount: 150,
    brand: "Energizer",
    slug: "aa-batteries",
    stock: 1000
  }
];