import { Product, Category, NewsArticle, Banner, Feature, GameStationImage, Brand, Station, User, Order, Booking, ContactInput, Coupon, StoreLocation, GameLibrary, FoodDrink } from '../shared/types';

export const USERS_DB: User[] = [
  {
    _id: "admin_01",
    name: "Quản trị viên",
    email: "admin@gamestore.vn",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRUSXdIL6ha_VAd4y9RotYT7WHSyA0nafpIrXt9Itnn0OYS07Yfws-fvH2jnOWMsa33ay8WbH0YQWFLZLf-0sqdmd72JhL47iJew1ae01llrD4OxkomXG_4IYrcT0MskneWWrcXfYmtGsJXJJmBEfbTWuAGAe0T_bFexgCjVjXuUaGdBQYtWqI8wnDsU7GfC-xpDv1MG-k7qXtO50pMXhq0rz2_EtOFBNqAFF5jTc7Jv5FcxGDtlyxJ2Pov3tUCEi_9TVzDxmdOw",
    role: 'ADMIN',
    password: 'admin123',
    phone: '0999888777',
    address: 'Trụ sở GameStore',
    city: 'Hồ Chí Minh',
    gamerTag: 'AdminGod',
    points: 9999,
    birthDate: '1995-01-01',
    gender: 'Nam',
    wishlist: [],
    addresses: []
  },
  {
    _id: "u1",
    name: "Nguyễn Văn A",
    email: "user@example.com",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFP0tlVEVnnQhPZx77BlJD80tqcnJjmrkPALbn9Pp90RwnNhviQC807TYiIo_Arn_1SxgjiP3si4M_FjIuIXRvMfK5SpvYYXbbfiojQxka47BbsnDA1D5O3YK5crgf59wsF33TW4G8i-LrUFPvA54AjLKbBc19fZmv4vCrvufch_vT3aRB7lR2rcYB9kCqM3QNVboXMzClV3bkqoDa5mHTH0akn3WKg_QqbtU4Q9wfcvQxPMLypovmwYAkz9SL8ejRKJKRH8o9Fw",
    role: 'USER',
    password: 'password123',
    phone: '0912 345 678',
    address: '123 Đường Số 1, Quận 1',
    city: 'Hồ Chí Minh',
    gamerTag: 'DragonSlayer99',
    points: 1250,
    birthDate: '1999-05-15',
    gender: 'Nam',
    wishlist: ['p2', 'p5'], // Initial favorite items
    addresses: [
      {
        id: "addr_1",
        name: "Nguyễn Văn A",
        phone: "0912345678",
        street: "123 Đường Số 1, Phường Bến Nghé, Quận 1",
        city: "Hồ Chí Minh",
        type: "HOME",
        isDefault: true
      },
      {
        id: "addr_2",
        name: "Nguyễn Văn A (Công ty)",
        phone: "0912345678",
        street: "Tòa nhà Bitexco, 2 Hải Triều, Quận 1",
        city: "Hồ Chí Minh",
        type: "OFFICE",
        isDefault: false
      }
    ]
  }
];

// Cấu hình thông tin thanh toán (Dùng cho VietQR và hiển thị)
export const PAYMENT_INFO = {
  bankName: "Techcombank",
  bankId: "TCB", // Bin code hoặc short name hỗ trợ VietQR
  accountNo: "19031234567890",
  accountName: "CONG TY TNHH GAMESTORE VN",
  template: "compact" // compact, compact2, qr_only, print
};

export const OTP_STORE: Record<string, string> = {};

// Sample Orders for Profile Page
export const ORDERS_DB: Order[] = [
    {
        _id: "ORD-2023-889",
        userId: "u1",
        items: [{
            productId: "p1",
            name: "PlayStation 5 Standard Edition (Slim)",
            price: 12990000,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4gp_7FG2yU6PEHg4dMrv1sH2WP-g2uooiD8yztRruCFmB4Y4Au9KFYJog_88xjl4_fcj-BddbZv0UuFw1i-VQghoofNN6qqxmfmAF9YR2JfX9CSiD-4-CtC9NsaE_hpNvqMolB2MSXcDTvZXfoIfW7w3KDsfPJRa6FJRPlCKgg9zC6pui6tDSStd0BrRk9yGmGKCw8gBP9pJW5di_5fqEF6q7ARlm5bLwF3YWcoomV8c09XvRYw1qgh5RfudSUCWOZ3-Sq5NpMQ",
            quantity: 1,
            maxStock: 50,
            type: "PRODUCT"
        }],
        totalAmount: 12990000,
        customerName: "Nguyễn Văn A",
        phone: "0912345678",
        email: "user@example.com",
        address: "123 Đường Số 1",
        city: "Hồ Chí Minh",
        paymentMethod: "COD",
        deliveryMethod: "SHIPPING",
        createdAt: "2023-10-24T14:30:00Z",
        status: "SHIPPING",
        paymentStatus: "PAID"
    },
    {
        _id: "ORD-2023-850",
        userId: "u1",
        items: [
            {
                productId: "p4",
                name: "Pokemon TCG: Scarlet & Violet Elite Trainer Box",
                price: 1250000,
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDH2xDgiPSo8BBaMHts0d4JqHElb8tmQlnLAvUFUXF0AQR4Nr6-ziUVxWenNOCzDLlAm9vfdudWrQT4SEOqy3dJwZsuk3662NcBCf0Xpo0qefaj7gHMspOpwjNVqwceNGrZiigvGdzmgsDGCUny2SPGVF2GGpWTdChrabcIOYixQSF8BKmhu46Nxvp73P-mGLRcUr-llJ0Qn8hbBIsTqqk5Qn_yLi-b3mJAdbLWnUc_ewQwpUMbl4uGEdZ-BB_EYsn8gT0CTREeKw",
                quantity: 2,
                maxStock: 15,
                type: "PRODUCT"
            },
            {
                productId: "p2",
                name: "Nintendo Switch OLED - White",
                price: 7890000,
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPh0beSxdgnG5lapS27tTe1_bdTqY1Kt1dDAQKA_6DKOC7V1DkxWxgBB9G_vtck3E0s-KJ1cs2D6NdpQn176Mo8Uf4v7mOG7oNnsRj5x3zE7gBCVqoBXUnCx-k67cYmeIOfCrtfMFH5iuCwgFuHsJqb-TThdduZJC97cp7buhsrwRcVnbSSVI76rXb5hOLnCWBZ7i6rH35F4xf_Sgh1Xv_TC4khum6U3DjyJX-vARKhmHRQVLqBZDKXnTSnxg5TRF63piBmFmBXw",
                quantity: 1,
                maxStock: 30,
                type: "PRODUCT"
            }
        ],
        totalAmount: 10390000,
        customerName: "Nguyễn Văn A",
        phone: "0912345678",
        email: "user@example.com",
        address: "123 Đường Số 1",
        city: "Hồ Chí Minh",
        paymentMethod: "BANK_TRANSFER",
        deliveryMethod: "SHIPPING",
        createdAt: "2023-10-20T09:15:00Z",
        status: "COMPLETED",
        paymentStatus: "PAID"
    }
];

export const BOOKINGS_DB: Booking[] = [
  {
    _id: "BKG-2023-001",
    userId: "u1",
    name: "Nguyễn Văn A",
    phone: "0912345678",
    email: "user@example.com",
    date: new Date().toISOString().split('T')[0], // Today
    time: "14:00",
    duration: 2,
    stationId: "st1",
    storeId: "hcm-q1",
    gameIds: ["g1", "g3"],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: "CONFIRMED",
    paymentStatus: "PAID",
    totalPrice: 100000,
    stationName: "PS5 Standard - Máy 01",
    endTime: "16:00"
  }
];

export const CONTACT_MESSAGES_DB: ContactInput[] = [];

// Enhanced STATIONS_DB with storeId
export const STATIONS_DB: (Station & { storeId: string })[] = [
  {
    _id: "st1",
    name: "PS5 Standard - Máy 01",
    type: "PS5",
    description: "Màn hình Sony 4K 55 inch, 2 tay cầm DualSense, Sofa đôi thoải mái.",
    pricePerHour: 50000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdUmYLTuUVnyHyrigwQMT9Eg9espSPKFoeVGH673f_oWVZ8fBDobW6TVyYA1vymSBT5ClyPEgNJ9b_o_JeKnt9XLqGk99XQQUCdY3ScrXCif8vmyCwF0ughnePW1gFZ74gL1keJpYJBr7GJszrSstCWGLF8RlROW51rZit8rfAuUs7X-mnbMUDYN53HWEa0eByPMxwHF3OE5sN3_YpBS9dYvUYokDUITQZ1XDXK5atAe9jORCYdodrIIW-pAKAD0y_xWO96EPi9Q",
    status: "AVAILABLE",
    zone: "Khu vực A",
    storeId: "hcm-q1"
  },
  {
    _id: "st2",
    name: "PS5 Pro - VIP Room",
    type: "PS5",
    description: "Phòng riêng cách âm, Ghế massage, Phục vụ đồ uống miễn phí.",
    pricePerHour: 100000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAE07-XNlCMLuTrZqtggoCIAO0X2sWe9xLD38J0Q1mhjD7At2cndHoF8yJM2InbY4mgeEiz6ZtCEzerlbhkcgv_r4U6vujyEW9UXkcNCq4gPQDXC1VhepxLhJJdpkxf85fGGQSQVirbrr4FKQNxR0XoyvNlIb1ARQgFh6VVQoWlaP43T80n6VhPFZX_7pHJHU7dPpR7TzzMhBMSpqDmqol5x9nynNaXnBENZfdqHPUzLTy07MHsD4AjWZwCOrYBOV_YKvzpmzWAqw",
    status: "AVAILABLE",
    zone: "Khu vực VIP",
    storeId: "hcm-q1"
  },
  {
    _id: "st3",
    name: "Nintendo Switch - Máy 01",
    type: "SWITCH",
    description: "Dock xuất TV 4K, 4 Joy-con, Đầy đủ game Mario, Pokemon.",
    pricePerHour: 40000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPh0beSxdgnG5lapS27tTe1_bdTqY1Kt1dDAQKA_6DKOC7V1DkxWxgBB9G_vtck3E0s-KJ1cs2D6NdpQn176Mo8Uf4v7mOG7oNnsRj5x3zE7gBCVqoBXUnCx-k67cYmeIOfCrtfMFH5iuCwgFuHsJqb-TThdduZJC97cp7buhsrwRcVnbSSVI76rXb5hOLnCWBZ7i6rH35F4xf_Sgh1Xv_TC4khum6U3DjyJX-vARKhmHRQVLqBZDKXnTSnxg5TRF63piBmFmBXw",
    status: "AVAILABLE",
    zone: "Khu vực C",
    storeId: "hcm-td"
  },
  {
    _id: "st4",
    name: "PC Ultra Gaming",
    type: "PC",
    description: "RTX 4090, Màn hình 240Hz, Phím cơ custom, Chuột Logitech Superlight.",
    pricePerHour: 80000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcFGsL8i3vxxlgnLNOds-6Y-LkQgbENtetJaTtODYH9Oju3JLbXzoHPG5sf-cmlkFousBHJvGBl-W5FjTDnr5-O67OSmbOKXDEllm8QgF9bPwOxkO9AIOJzA8YgnmceX-alYH4wYU55rxthxJ9qpdgn4qWdzmJYy7t4pLxvRKF_zDhnLlsClb7yZq2gBNVOKCZ0O55duztvJWquJcGmrFzP9zbKmULjdH4gIyaqvIfLqsOqAFPDQGOYMBa6dh2AFKG9D15C-M0SQ",
    status: "MAINTENANCE",
    zone: "Khu vực B",
    storeId: "hcm-q1"
  }
];

export const GAMES_LIBRARY_DB: GameLibrary[] = [
  { _id: "g1", title: "FC 24", isHot: true, platform: 'PS5', category: "Thể thao", players: "1-4 Players", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyVLnq7lT-Bqy7W4Yur_cSeRwbv0L0pkLRKIr86pZX-hQlS3woWPcDx3Z5DZntkNAkU6jlGwif2STEHDuXHWh1xJ7rbOF6iW87O8WjGpSCKcQO8MX5xRk3Cu1AqTZ2VaVaHJpt_n_fv6tpurmpGoZDRqVyTO4Gox-foQZlhFF5bm7PHnfwS66T2edoBtE3euL8U5KrYmJLxKCN9ZQmqWQCDxVKPhaj_CNauUYYC_xLhtP0ENjj3OXjyBeEqjsW3_Nnn25A1J7A_Q" },
  { _id: "g2", title: "God of War Ragnarok", isHot: true, platform: 'PS5', category: "Nhập vai", players: "1 Player", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjby-1MIeJTEFOPu6esxpHiBtCpEyK28jSFZZpitmjvHNkq3g6n0gT0lnrAUab42B2w2i1a4MF4jHGFkoLyGc2KBdxkCWbDqueyinvK6SEhH85wslRsWL0vh7cT_Lt2urrklHYjbFjFvWbJfrAO1DaSMVP5Jye704hHT2TWJjLOTYiArHO-iuuKy63ONhVPnofZp3f1AodaLmhUT52SiGpRgiC4a9IAoERRvkztNq8E93KO-2Hw_T0nJxQGY8V8W4j7bwN2RDjUw" },
  { _id: "g3", title: "Spider-Man 2", platform: 'PS5', category: "Hành động", players: "1 Player", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuADbS5MAbevZSWxunWc-2qV3JdxsQChgAm6SCDONfwN2fSFbKo0rWmGII3K2EmVQgjznV_vKkUFX6ZCVIYAS1cKUEvaT3bi315N2wed148GL8yBNMugJ-pgZMcR4qfT73phtk-lHRHehG8Q7Y_bgnab3ED0xamnu7Ny8suy6MLzX1DOj3atxQskTHS4BvLQAzmAFjls9H1IgNxeUGd0sCkn5oTfuy20x6f_HmUpFqsPeEFdBOLudNOE1Ym1B4c3NZIcDkPkJDNCVA" },
  { _id: "g4", title: "Gran Turismo 7", platform: 'PS5', category: "Đua xe", players: "1-2 Players", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDd5dR1nJZ9Lq29HHpwUbvJmwrsa23KQocKJMH_urEkpX3JoOvT7NmJjHou26D5SwP5GoPojbboTAZYHAVrOXefMfU3ocbQZcpmn90P7k6o3pgmKFSazJSm1A45-HDx3O9QTnBkThTjZJa_os9zMaNu-GezaFB7XN-x5QZG960w9DrllZvXnlYCtywSyHuCV8Wusuut7OwkF_E11fDlB_4VFpuvYyE4cBPKdNqXyWP4t1LzQ4riYnxF3eN-J1S_eTXzI2BGTXR4Gw" },
  { _id: "g5", title: "Black Myth: Wukong", isHot: true, platform: 'PS5', category: "Hành động", players: "1 Player", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAW-1iR9Nt_HIZFlN_18kus6czP58L7iGzmfYIZj8cPSTGbq_SoJlLl5UUfWKx9OlECs-IpDKfuI1PBZAJX46euO75j5IDv1-Uz6Lxt3FGxmxp_OkqhJRrZqO4aGTLw9yJuWil8RGnQINlmBDo38WJ7EvBbjQ7PN9oSR44EUv7TfuMHPoGnVOJ8PvuSD0sUrxzSOgbfbo77WF6ZvPFeMtfYLw9FsdEae0-4cxvCGtwfRp2BIiJXVe0Kdw1zuBaxDhXUqMRzpCmYg" },
  { _id: "g6", title: "Elden Ring", isHot: true, platform: 'PC', category: "RPG", players: "1 Player", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAW-1iR9Nt_HIZFlN_18kus6czP58L7iGzmfYIZj8cPSTGbq_SoJlLl5UUfWKx9OlECs-IpDKfuI1PBZAJX46euO75j5IDv1-Uz6Lxt3FGxmxp_OkqhJRrZqO4aGTLw9yJuWil8RGnQINlmBDo38WJ7EvBbjQ7PN9oSR44EUv7TfuMHPoGnVOJ8PvuSD0sUrxzSOgbfbo77WF6ZvPFeMtfYLw9FsdEae0-4cxvCGtwfRp2BIiJXVe0Kdw1zuBaxDhXUqMRzpCmYg" },
  { _id: "g7", title: "Tekken 8", platform: 'PS5', category: "Đối kháng", players: "2 Players", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTUJkk-ujrp_HGGMBE1pfEQwdtp4X9qEwywc1ww7qKFuTRBcWLHKvdm7omv0rENihMOFVTs--WRsxtGGuFZLKbpw-kGkcTfGAzXv3bl7uc59oGPXS_S6MkyoxZt1rTuLLeVa8ge66vae8UR7FVzAygvDLUhOcyaa9Cx3Uwgev5zxC201yUgQn7bmpdK-mTzArvxNaRT6CHxMLZxbYQ2AwqsS8UGkm_wyqrDKa-kkGjNquiRau_lmQf5vvAL1Yb6fYovWL4t6rw6g" },
  { _id: "g8", title: "Mario Kart 8 Deluxe", platform: 'SWITCH', category: "Đua xe", players: "1-4 Players", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPh0beSxdgnG5lapS27tTe1_bdTqY1Kt1dDAQKA_6DKOC7V1DkxWxgBB9G_vtck3E0s-KJ1cs2D6NdpQn176Mo8Uf4v7mOG7oNnsRj5x3zE7gBCVqoBXUnCx-k67cYmeIOfCrtfMFH5iuCwgFuHsJqb-TThdduZJC97cp7buhsrwRcVnbSSVI76rXb5hOLnCWBZ7i6rH35F4xf_Sgh1Xv_TC4khum6U3DjyJX-vARKhmHRQVLqBZDKXnTSnxg5TRF63piBmFmBXw" },
  { _id: "g9", title: "It Takes Two", isHot: true, platform: 'PS5', category: "Co-op", players: "2 Players", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC519XN4hu9kHLR-f1PZfVN_E3cPs_Wrr5D1eQ5kYT9ORlCGsVhwtHMG18z-GFjA6Hy3CykYYc86LSg3P3cX5ci51uVQ_SOw-TELnstrwb61YWQVjgszc2Q370-tvdDRibSvsQbi3LNVd1SmLweGStoAqJjq4U-utXw2Zrn7cPLrpVr6t_2w87j1YGhDgEZzA9yHRcbddB72fYEqsFnt8fjrDt-QCN3qV9DbbqOteQp_-uFg8DLs7cVaAJ54OjybkAX0vqXzRE-eg" },
  { _id: "g10", title: "Cyberpunk 2077", platform: 'PS5', category: "RPG", players: "1 Player", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDc4KDRQIeUp2NaSBG8ftMGBRUGk6QNVQhSLnQJsm-iLj5G6UeQe2uARtZ6qcynXVf8rw-E_yrHohN3wE5lA5i0rjk9uIoDtXc4Y_AcreMvomo20CMf19usHtUqHmvADfpheohP04oKFcVVRfRGUm0u6QyqIFRaZm_NQ859pewKP3R3dVwU21VucCS1C2PnxYvV8bpWR9Hh2s9QG8CjGg012_NbRO60VzaNLbEDdA1AS7m9AySevSgswLwh9FaMlDDWwm9yF42afg" }
];

export const FOOD_DRINK_DB: FoodDrink[] = [
  { _id: "fd1", name: "Sting Dâu (Lon)", price: 15000, category: "DRINK", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwkrkxv2nFeaOEGEBl8JiXnOlD-d2NiMxbSz6W3St6nbHQJcN6tjROKMn3NRUbxX75qDbO-R1osMzfsrFNzncP2MRrsSwJZSd0k9VJfV2Xuw88k9rag96wfRnXSpMlEO8KkfdMYeiXflc4ZvUaeksCApdysHSHGckzJu4nv0tCwf4Bq3WqpIEi0F2_ldJmxo2WVz1ZNfeBS0l9GH2F4Ddz1YYnCEf_GkIdDGX2OjEx_7N7S_NZO6DiLgtrhDV9jrTc_fzlBPdzcA", description: "Nước tăng lực hương dâu tây, giúp tỉnh táo tức thì." },
  { _id: "fd2", name: "Mì Trộn Xúc Xích", price: 25000, category: "NOODLE", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFUDKcfLGi0D_zPnIX9OE_mu0FietPhdExwmkwq-C4JGMNYDgtoocieWh4mFgHUDcQGdDuYK_Mz09zW_KFgBYjLQ19J1dV22vZYarW7c0qLUMIOifayj59CJHIX4BXiUnqoTDdJhIxpx-wc8XstxdFmsMFsHDAfHPbpLNHtSgYAfzEkmAAObggRgrdDnQOlszvlMOX1Ltac09X3_tSrhz0EcVA9akzmMUHt2Fayq9rnV1ZMQcaa-pV-k5JYhUnBXP8gvShMVuf1g", description: "Mì Indomie xào khô, xúc xích Đức nướng, rau cải ngọt." },
  { _id: "fd3", name: "Khoai Tây Chiên", price: 30000, category: "SNACK", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7tzk5i5EazeMgGsXZ3SD8QX0aJWWZUGknVYiE9P94cNt7ETbjK5H64rXSJG5GKEkVFjMvN7BnVIbCnBpaZy2HD2HiIgV2EvUdqI0lF9bd2Us9yG0qPmLNJICt_zKJEbMFhLDiMmxcuooDRaA17wnVet5xwFDMWDiSkykGTNIXY01oClvIZCsOGk4R6AcTYNpILoi2ik3Uz0Mqr-HeQbRCG6Fl0zRHF0N_IIt1DCmSMS2FqWGKzF0G8lLFA-Pz6FaBsefIKZZlLw", description: "Khoai tây chiên giòn rụm, lắc phô mai thơm ngon." },
  { _id: "fd4", name: "Cà Phê Sữa Đá", price: 20000, category: "COFFEE", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwkrkxv2nFeaOEGEBl8JiXnOlD-d2NiMxbSz6W3St6nbHQJcN6tjROKMn3NRUbxX75qDbO-R1osMzfsrFNzncP2MRrsSwJZSd0k9VJfV2Xuw88k9rag96wfRnXSpMlEO8KkfdMYeiXflc4ZvUaeksCApdysHSHGckzJu4nv0tCwf4Bq3WqpIEi0F2_ldJmxo2WVz1ZNfeBS0l9GH2F4Ddz1YYnCEf_GkIdDGX2OjEx_7N7S_NZO6DiLgtrhDV9jrTc_fzlBPdzcA", description: "Cà phê Robusta đậm đà, pha phin truyền thống." },
  { _id: "fd5", name: "Trà Đào Cam Sả", price: 30000, category: "TEA", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwkrkxv2nFeaOEGEBl8JiXnOlD-d2NiMxbSz6W3St6nbHQJcN6tjROKMn3NRUbxX75qDbO-R1osMzfsrFNzncP2MRrsSwJZSd0k9VJfV2Xuw88k9rag96wfRnXSpMlEO8KkfdMYeiXflc4ZvUaeksCApdysHSHGckzJu4nv0tCwf4Bq3WqpIEi0F2_ldJmxo2WVz1ZNfeBS0l9GH2F4Ddz1YYnCEf_GkIdDGX2OjEx_7N7S_NZO6DiLgtrhDV9jrTc_fzlBPdzcA", description: "Trà đào thanh mát, miếng đào giòn ngọt." }
];

export const PRODUCTS_DB: Product[] = [
  {
    _id: "p1",
    name: "PlayStation 5 Standard Edition (Slim)",
    category: "PLAYSTATION",
    price: 12990000,
    originalPrice: 14500000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4gp_7FG2yU6PEHg4dMrv1sH2WP-g2uooiD8yztRruCFmB4Y4Au9KFYJog_88xjl4_fcj-BddbZv0UuFw1i-VQghoofNN6qqxmfmAF9YR2JfX9CSiD-4-CtC9NsaE_hpNvqMolB2MSXcDTvZXfoIfW7w3KDsfPJRa6FJRPlCKgg9zC6pui6tDSStd0BrRk9yGmGKCw8gBP9pJW5di_5fqEF6q7ARlm5bLwF3YWcoomV8c09XvRYw1qgh5RfudSUCWOZ3-Sq5NpMQ",
    rating: 5,
    reviewCount: 128,
    brand: "Sony",
    tags: ["HOT", "SALE"],
    slug: "ps5-slim-standard",
    stock: 50,
    description: "Phiên bản PS5 Slim mới nhất với thiết kế nhỏ gọn hơn 30% và nhẹ hơn so với bản gốc. Ổ đĩa Blu-ray 4K Ultra HD tích hợp, dung lượng lưu trữ 1TB SSD tốc độ siêu nhanh. Trải nghiệm game 4K 120Hz mượt mà.",
    features: [
      "CPU: x86-64-AMD Ryzen™ “Zen 2”",
      "GPU: AMD Radeon™ RDNA 2-based graphics engine",
      "SSD: 1TB Custom SSD",
      "Audio: Tempest 3D AudioTech"
    ]
  },
  {
    _id: "p2",
    name: "Nintendo Switch OLED Model - White",
    category: "NINTENDO",
    price: 7890000,
    originalPrice: 8490000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPh0beSxdgnG5lapS27tTe1_bdTqY1Kt1dDAQKA_6DKOC7V1DkxWxgBB9G_vtck3E0s-KJ1cs2D6NdpQn176Mo8Uf4v7mOG7oNnsRj5x3zE7gBCVqoBXUnCx-k67cYmeIOfCrtfMFH5iuCwgFuHsJqb-TThdduZJC97cp7buhsrwRcVnbSSVI76rXb5hOLnCWBZ7i6rH35F4xf_Sgh1Xv_TC4khum6U3DjyJX-vARKhmHRQVLqBZDKXnTSnxg5TRF63piBmFmBXw",
    rating: 4.8,
    reviewCount: 342,
    brand: "Nintendo",
    tags: ["BESTSELLER"],
    slug: "nintendo-switch-oled-white",
    stock: 30,
    description: "Màn hình OLED 7-inch rực rỡ, chân đế rộng có thể điều chỉnh, dock mới có cổng LAN, bộ nhớ trong 64GB và âm thanh nâng cấp.",
    features: [
      "Màn hình: 7-inch OLED",
      "Bộ nhớ: 64GB",
      "Chế độ: TV Mode, Tabletop Mode, Handheld Mode",
      "Thời lượng pin: 4.5 - 9 tiếng"
    ]
  },
  {
    _id: "p3",
    name: "DualSense Wireless Controller - Cosmic Red",
    category: "ACCESSORIES",
    price: 1790000,
    originalPrice: 1990000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_Oa_Q3jW8qOQG4rL0v_L8h_R1tX5vK4mJ9oN7pQ3sW6uY2zI5aB8dC1eF4gH7jK0lM3nO6pQ9rS2tU5vW8xY1zJ4aB7cD0eF3gH6jK9lM2nO5pQ8rS1tU4vW7xY0zJ3aB6cD9eF2gH5jK8lM1nO4pQ7rS0tU3vW6xY9zJ2aB5cD8eF1gH4jK7lM0nO3pQ6rS9tU2vW5xY8zJ1aB4cD7eF0gH3jK6lM9nO2pQ5rS8tU1vW4xY7zJ0aB3cD6eF9gH2jK5lM8nO1pQ4rS7tU0vW3xY6",
    rating: 4.9,
    reviewCount: 85,
    brand: "Sony",
    tags: ["NEW"],
    slug: "dualsense-cosmic-red",
    stock: 100,
    colors: [
      { name: "Cosmic Red", hex: "#a1182e" },
      { name: "Midnight Black", hex: "#000000" },
      { name: "Starlight Blue", hex: "#3282b8" }
    ],
    description: "Tay cầm DualSense mang lại phản hồi xúc giác chân thực, cò bấm thích ứng (Adaptive Triggers) và micro tích hợp, tất cả trong một thiết kế mang tính biểu tượng.",
  },
  {
    _id: "p4",
    name: "Pokemon TCG: Scarlet & Violet Elite Trainer Box",
    category: "TCG",
    price: 1250000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDH2xDgiPSo8BBaMHts0d4JqHElb8tmQlnLAvUFUXF0AQR4Nr6-ziUVxWenNOCzDLlAm9vfdudWrQT4SEOqy3dJwZsuk3662NcBCf0Xpo0qefaj7gHMspOpwjNVqwceNGrZiigvGdzmgsDGCUny2SPGVF2GGpWTdChrabcIOYixQSF8BKmhu46Nxvp73P-mGLRcUr-llJ0Qn8hbBIsTqqk5Qn_yLi-b3mJAdbLWnUc_ewQwpUMbl4uGEdZ-BB_EYsn8gT0CTREeKw",
    rating: 5,
    reviewCount: 42,
    brand: "Pokemon Company",
    tags: ["TCG", "HOT"],
    slug: "pokemon-tcg-scarlet-violet-etb",
    stock: 15,
    description: "Bộ Elite Trainer Box bao gồm 9 gói booster packs, 1 thẻ promo full-art foil, 65 bọc bài, 45 thẻ năng lượng và hướng dẫn chơi.",
  },
  {
    _id: "p5",
    name: "Marvel's Spider-Man 2 - PS5",
    category: "GAMES",
    price: 1690000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuADbS5MAbevZSWxunWc-2qV3JdxsQChgAm6SCDONfwN2fSFbKo0rWmGII3K2EmVQgjznV_vKkUFX6ZCVIYAS1cKUEvaT3bi315N2wed148GL8yBNMugJ-pgZMcR4qfT73phtk-lHRHehG8Q7Y_bgnab3ED0xamnu7Ny8suy6MLzX1DOj3atxQskTHS4BvLQAzmAFjls9H1IgNxeUGd0sCkn5oTfuy20x6f_HmUpFqsPeEFdBOLudNOE1Ym1B4c3NZIcDkPkJDNCVA",
    rating: 4.9,
    reviewCount: 210,
    brand: "Sony",
    tags: ["HOT"],
    slug: "spiderman-2-ps5",
    stock: 50,
    description: "Siêu phẩm hành động phiêu lưu độc quyền trên PS5. Điều khiển cả Peter Parker và Miles Morales để đối đầu với Venom và Kraven.",
  },
  {
    _id: "p6",
    name: "The Legend of Zelda: Tears of the Kingdom",
    category: "GAMES",
    price: 1490000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPh0beSxdgnG5lapS27tTe1_bdTqY1Kt1dDAQKA_6DKOC7V1DkxWxgBB9G_vtck3E0s-KJ1cs2D6NdpQn176Mo8Uf4v7mOG7oNnsRj5x3zE7gBCVqoBXUnCx-k67cYmeIOfCrtfMFH5iuCwgFuHsJqb-TThdduZJC97cp7buhsrwRcVnbSSVI76rXb5hOLnCWBZ7i6rH35F4xf_Sgh1Xv_TC4khum6U3DjyJX-vARKhmHRQVLqBZDKXnTSnxg5TRF63piBmFmBXw",
    rating: 5,
    reviewCount: 500,
    brand: "Nintendo",
    tags: ["MUST-PLAY"],
    slug: "zelda-totk",
    stock: 40,
    description: "Cuộc phiêu lưu vĩ đại tiếp theo của Link trên bầu trời và mặt đất của Hyrule.",
  },
  {
    _id: "p7",
    name: "Logitech G Pro X Superlight 2",
    category: "ACCESSORIES",
    price: 3590000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcFGsL8i3vxxlgnLNOds-6Y-LkQgbENtetJaTtODYH9Oju3JLbXzoHPG5sf-cmlkFousBHJvGBl-W5FjTDnr5-O67OSmbOKXDEllm8QgF9bPwOxkO9AIOJzA8YgnmceX-alYH4wYU55rxthxJ9qpdgn4qWdzmJYy7t4pLxvRKF_zDhnLlsClb7yZq2gBNVOKCZ0O55duztvJWquJcGmrFzP9zbKmULjdH4gIyaqvIfLqsOqAFPDQGOYMBa6dh2AFKG9D15C-M0SQ",
    rating: 4.8,
    reviewCount: 65,
    brand: "Logitech",
    tags: ["ESPORTS"],
    slug: "logitech-g-pro-x-superlight-2",
    stock: 20,
    colors: [
        { name: "Black", hex: "#000000" },
        { name: "White", hex: "#ffffff" },
        { name: "Pink", hex: "#ffc0cb" }
    ],
    description: "Chuột gaming không dây siêu nhẹ thế hệ mới, switch lai quang-cơ LIGHTFORCE, cảm biến HERO 2 32K DPI.",
  }
];

export const CATEGORIES_DB: Category[] = [
  { _id: "c1", name: "PlayStation", subtitle: "Máy game & Phụ kiện Sony", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4gp_7FG2yU6PEHg4dMrv1sH2WP-g2uooiD8yztRruCFmB4Y4Au9KFYJog_88xjl4_fcj-BddbZv0UuFw1i-VQghoofNN6qqxmfmAF9YR2JfX9CSiD-4-CtC9NsaE_hpNvqMolB2MSXcDTvZXfoIfW7w3KDsfPJRa6FJRPlCKgg9zC6pui6tDSStd0BrRk9yGmGKCw8gBP9pJW5di_5fqEF6q7ARlm5bLwF3YWcoomV8c09XvRYw1qgh5RfudSUCWOZ3-Sq5NpMQ", icon: "sports_esports", slug: "playstation", code: "PLAYSTATION" },
  { _id: "c2", name: "Nintendo", subtitle: "Switch Console & Games", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPh0beSxdgnG5lapS27tTe1_bdTqY1Kt1dDAQKA_6DKOC7V1DkxWxgBB9G_vtck3E0s-KJ1cs2D6NdpQn176Mo8Uf4v7mOG7oNnsRj5x3zE7gBCVqoBXUnCx-k67cYmeIOfCrtfMFH5iuCwgFuHsJqb-TThdduZJC97cp7buhsrwRcVnbSSVI76rXb5hOLnCWBZ7i6rH35F4xf_Sgh1Xv_TC4khum6U3DjyJX-vARKhmHRQVLqBZDKXnTSnxg5TRF63piBmFmBXw", icon: "videogame_asset", slug: "nintendo", code: "NINTENDO" },
  { _id: "c3", name: "Thẻ Bài TCG", subtitle: "Pokemon, Yugioh, OnePiece", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDH2xDgiPSo8BBaMHts0d4JqHElb8tmQlnLAvUFUXF0AQR4Nr6-ziUVxWenNOCzDLlAm9vfdudWrQT4SEOqy3dJwZsuk3662NcBCf0Xpo0qefaj7gHMspOpwjNVqwceNGrZiigvGdzmgsDGCUny2SPGVF2GGpWTdChrabcIOYixQSF8BKmhu46Nxvp73P-mGLRcUr-llJ0Qn8hbBIsTqqk5Qn_yLi-b3mJAdbLWnUc_ewQwpUMbl4uGEdZ-BB_EYsn8gT0CTREeKw", icon: "style", slug: "tcg", code: "TCG" },
  { _id: "c4", name: "Phụ Kiện", subtitle: "Tay cầm, Tai nghe, Chuột", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_Oa_Q3jW8qOQG4rL0v_L8h_R1tX5vK4mJ9oN7pQ3sW6uY2zI5aB8dC1eF4gH7jK0lM3nO6pQ9rS2tU5vW8xY1zJ4aB7cD0eF3gH6jK9lM2nO5pQ8rS1tU4vW7xY0zJ3aB6cD9eF1gH4jK7lM0nO3pQ6rS9tU2vW5xY8zJ1aB4cD7eF0gH3jK6lM9nO2pQ5rS8tU1vW4xY7zJ0aB3cD6eF9gH2jK5lM8nO1pQ4rS7tU0vW3xY6", icon: "headphones", slug: "accessories", code: "ACCESSORIES" }
];

export const BRANDS_DB: Brand[] = [
  { _id: "b1", name: "Sony", slug: "sony" },
  { _id: "b2", name: "Nintendo", slug: "nintendo" },
  { _id: "b3", name: "Pokemon Company", slug: "pokemon" },
  { _id: "b4", name: "Logitech", slug: "logitech" },
  { _id: "b5", name: "Razer", slug: "razer" }
];

export const BANNERS_DB: Banner[] = [
  {
    _id: "b1",
    badge: "Limited Edition",
    title: "PlayStation 5",
    highlightText: "Marvel's Spider-Man 2 Bundle",
    description: "Sở hữu ngay phiên bản giới hạn với thiết kế Symbiote độc đáo. Tặng kèm game Spider-Man 2.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuADbS5MAbevZSWxunWc-2qV3JdxsQChgAm6SCDONfwN2fSFbKo0rWmGII3K2EmVQgjznV_vKkUFX6ZCVIYAS1cKUEvaT3bi315N2wed148GL8yBNMugJ-pgZMcR4qfT73phtk-lHRHehG8Q7Y_bgnab3ED0xamnu7Ny8suy6MLzX1DOj3atxQskTHS4BvLQAzmAFjls9H1IgNxeUGd0sCkn5oTfuy20x6f_HmUpFqsPeEFdBOLudNOE1Ym1B4c3NZIcDkPkJDNCVA",
    primaryBtn: "Mua Ngay",
    secondaryBtn: "Chi tiết",
    stats: [{ text: "4K", label: "Gaming", bg: "bg-white text-black" }, { text: "120", label: "FPS", bg: "bg-primary text-white" }]
  },
  {
    _id: "b2",
    badge: "New Arrival",
    title: "ROG Ally",
    highlightText: "Chơi Game Mọi Lúc",
    description: "Máy chơi game cầm tay mạnh mẽ nhất chạy Windows 11. Màn hình 120Hz mượt mà.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcFGsL8i3vxxlgnLNOds-6Y-LkQgbENtetJaTtODYH9Oju3JLbXzoHPG5sf-cmlkFousBHJvGBl-W5FjTDnr5-O67OSmbOKXDEllm8QgF9bPwOxkO9AIOJzA8YgnmceX-alYH4wYU55rxthxJ9qpdgn4qWdzmJYy7t4pLxvRKF_zDhnLlsClb7yZq2gBNVOKCZ0O55duztvJWquJcGmrFzP9zbKmULjdH4gIyaqvIfLqsOqAFPDQGOYMBa6dh2AFKG9D15C-M0SQ",
    primaryBtn: "Đặt Trước",
    secondaryBtn: "Xem Review",
    stats: [{ text: "Z1", label: "Extreme", bg: "bg-red-500 text-white" }]
  }
];

export const FEATURES_DB: Feature[] = [
  { _id: "f1", icon: "local_shipping", color: "bg-blue-50 text-blue-600", title: "Miễn phí vận chuyển", description: "Cho đơn hàng từ 2.000.000đ" },
  { _id: "f2", icon: "verified", color: "bg-green-50 text-green-600", title: "Bảo hành chính hãng", description: "100% sản phẩm Sony VN, Nintendo" },
  { _id: "f3", icon: "support_agent", color: "bg-purple-50 text-purple-600", title: "Hỗ trợ 24/7", description: "Tư vấn kỹ thuật trọn đời" }
];

export const GAME_STATION_IMAGES_DB: GameStationImage[] = [
  { _id: "img1", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0nkFuTU-jvFAPZaHyVgySzpizYjpTEjV1nZi6nFzWsseasyjHK0pY9VUQjLDKM-muROxrMfAcRpzkht8MrcywtkIYgFg6ICtFH8Z1Qt8vfBTX9SE0KSm4lje6BK83GPWy0TrJ67hZoNHugUCcR1IDUoJZEHTzpLEzF3-OPWYarqdX1yHDbLp9BB0H8AGEmCKMKPxGcPZDMkSORynjexjuO9yVwtBm8upNw2AtSCXLG2s-VvPd4ZuiBOKxsdCxUy_CS9qvJqsHOg", alt: "Khu vực PC High-End" },
  { _id: "img2", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDH2xDgiPSo8BBaMHts0d4JqHElb8tmQlnLAvUFUXF0AQR4Nr6-ziUVxWenNOCzDLlAm9vfdudWrQT4SEOqy3dJwZsuk3662NcBCf0Xpo0qefaj7gHMspOpwjNVqwceNGrZiigvGdzmgsDGCUny2SPGVF2GGpWTdChrabcIOYixQSF8BKmhu46Nxvp73P-mGLRcUr-llJ0Qn8hbBIsTqqk5Qn_yLi-b3mJAdbLWnUc_ewQwpUMbl4uGEdZ-BB_EYsn8gT0CTREeKw", alt: "Khu vực TCG Battle" },
  { _id: "img3", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBacKpUnhbR_OMy81ftGDiSapoHMRKNOpoioiIB8UQ9V8Ja0MjPZwvMRVTQUN8N829bm_H-Xr6B9MFXQSVUlA9gMPid5h5T42Q0Eg8cJXRYxSVbEJH9a8l5_8LumUVu7r8FMMWr-HjnQWdMlgcaxRNenrE0MWQ3yxjkjoq3WSnXGf7gB-rnP2YXBlzQaZhR9Wz3h7QzRwjU1Jz6XJcWBw66PJM2tVLaheG3SQFL83f01Ce4cRFcUoU4L4hQokfKn7Aotnyjr99XZA", alt: "PS5 Lounge VIP" }
];

export const ARTICLES_DB: NewsArticle[] = [
  {
    _id: "a1",
    title: "GTA VI chính thức công bố trailer đầu tiên",
    excerpt: "Rockstar Games đã tung ra trailer được mong chờ nhất thập kỷ, hé lộ bối cảnh Vice City tuyệt đẹp.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXL7jV33yoLPKvvhBaV5vXvsCuVicRXP85JxBjp8t_fMXCJHR2YVj3HLsVCk-2pmoNf-E4bZWy6NzNj3QC5rHr_153y79nPNVwPdDfnTV7tNjja3Looyh0xsQLLELg36ygHwFPUtKPLv7SColrrtEKuSX0E4njRNqrUfJERU6E9u3uW85nydVbxN4zYO6ivwMemUviD__5RaP3ShlOyN5qoPXIAzoV-v80WTJfKpNWPsv9OBYu16let6PC2cQYaDfhgp13cpfqIw",
    category: "Tin Game",
    categoryColor: "text-blue-600",
    date: "05/12/2023",
    readTime: "5 phút đọc"
  },
  {
    _id: "a2",
    title: "Giải đấu Pokemon TCG: Regional Championship",
    excerpt: "Đăng ký tham gia giải đấu lớn nhất năm tại GameStore để nhận giải thưởng lên tới 50 triệu đồng.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDH2xDgiPSo8BBaMHts0d4JqHElb8tmQlnLAvUFUXF0AQR4Nr6-ziUVxWenNOCzDLlAm9vfdudWrQT4SEOqy3dJwZsuk3662NcBCf0Xpo0qefaj7gHMspOpwjNVqwceNGrZiigvGdzmgsDGCUny2SPGVF2GGpWTdChrabcIOYixQSF8BKmhu46Nxvp73P-mGLRcUr-llJ0Qn8hbBIsTqqk5Qn_yLi-b3mJAdbLWnUc_ewQwpUMbl4uGEdZ-BB_EYsn8gT0CTREeKw",
    category: "Sự Kiện",
    categoryColor: "text-red-600",
    date: "10/12/2023",
    readTime: "3 phút đọc"
  },
  {
    _id: "a3",
    title: "Review PS5 Slim: Nhỏ hơn, Đẹp hơn?",
    excerpt: "Cùng trên tay và đánh giá chi tiết phiên bản làm mới của chiếc máy console bán chạy nhất hiện nay.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4gp_7FG2yU6PEHg4dMrv1sH2WP-g2uooiD8yztRruCFmB4Y4Au9KFYJog_88xjl4_fcj-BddbZv0UuFw1i-VQghoofNN6qqxmfmAF9YR2JfX9CSiD-4-CtC9NsaE_hpNvqMolB2MSXcDTvZXfoIfW7w3KDsfPJRa6FJRPlCKgg9zC6pui6tDSStd0BrRk9yGmGKCw8gBP9pJW5di_5fqEF6q7ARlm5bLwF3YWcoomV8c09XvRYw1qgh5RfudSUCWOZ3-Sq5NpMQ",
    category: "Review",
    categoryColor: "text-purple-600",
    date: "01/12/2023",
    readTime: "10 phút đọc"
  }
];

export const COUPONS_DB: Coupon[] = [
  { code: 'GAME10', discount: 10, type: 'PERCENT', description: 'Giảm 10% tối đa 500k', minOrderValue: 500000 },
  { code: 'WELCOMES50', discount: 50000, type: 'FIXED', description: 'Giảm 50k cho đơn từ 1 triệu', minOrderValue: 1000000 },
  { code: 'FREESHIP', discount: 30000, type: 'FIXED', description: 'Miễn phí vận chuyển (tối đa 30k)', minOrderValue: 200000 }
];

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
    hours: { weekday: "09:00 - 22:00", weekend: "08:00 - 23:00" },
    amenities: [
      { icon: "wifi", label: "Wi-Fi 6", colorClass: "text-green-600 bg-green-50" },
      { icon: "local_parking", label: "Gửi xe Free", colorClass: "text-blue-600 bg-blue-50" },
      { icon: "fastfood", label: "Đồ ăn nhẹ", colorClass: "text-orange-600 bg-orange-50" }
    ],
    equipment: [
      { icon: "sports_esports", name: "PS5 Pro", count: 10, colorClass: "text-primary" },
      { icon: "desktop_windows", name: "PC RTX 4090", count: 20, colorClass: "text-purple-600" }
    ]
  },
  {
    _id: "hcm-td",
    name: "GameWorld Thủ Đức",
    address: "234 Võ Văn Ngân, TP. Thủ Đức, TP. Hồ Chí Minh",
    city: "hcm",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxoV3kEbK337tSIIGQ29-5AsY-2u7FUa4TkbVAQm81xYcqrHl18ZD-K2YjsjkK46c4XBmFeYAu-wNmepoldxOBhmKpC9SZEh3Sy7kANGRP9bU6Pt2Lbezskndl3wABWHK3qotmxcsdR-M_DTlE77jso7As0CHrsmgM4w4o1T_rLj_XB7yMKcsMUH7y1bXMyASEyBc1vEP4vycgDI56AlXDT0M2J0nJqldvKuWV0rbN79iG__zzkGfSJnwD5MsN1lVAmkAT92pPfw",
    images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBxoV3kEbK337tSIIGQ29-5AsY-2u7FUa4TkbVAQm81xYcqrHl18ZD-K2YjsjkK46c4XBmFeYAu-wNmepoldxOBhmKpC9SZEh3Sy7kANGRP9bU6Pt2Lbezskndl3wABWHK3qotmxcsdR-M_DTlE77jso7As0CHrsmgM4w4o1T_rLj_XB7yMKcsMUH7y1bXMyASEyBc1vEP4vycgDI56AlXDT0M2J0nJqldvKuWV0rbN79iG__zzkGfSJnwD5MsN1lVAmkAT92pPfw"
    ],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4946681007846!2d106.76175551474896!3d10.853374292323565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175276398969f7b%3A0x9672b7dd9a76ccb8!2sVincom%20Plaza%20Thu%20Duc!5e0!3m2!1sen!2s!4v1625633652876!5m2!1sen!2s",
    phone: "1900 5678",
    hours: { weekday: "08:00 - 22:00", weekend: "08:00 - 23:00" },
    amenities: [
      { icon: "ac_unit", label: "Máy lạnh", colorClass: "text-blue-600 bg-blue-50" },
      { icon: "local_parking", label: "Gửi xe Free", colorClass: "text-blue-600 bg-blue-50" }
    ],
    equipment: [
      { icon: "sports_esports", name: "PS5 Standard", count: 15, colorClass: "text-primary" },
      { icon: "videogame_asset", name: "Nintendo Switch", count: 8, colorClass: "text-red-600" }
    ]
  }
];