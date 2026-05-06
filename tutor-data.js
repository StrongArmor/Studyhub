const tutorDemoData = {
    tutors: [
        {
            id: 1,
            name: 'Nguyễn Minh Khoa',
            subject: 'Mạch xoay chiều',
            topics: ['mạch xoay chiều', 'điện xoay chiều', 'giải bài tập'],
            price30: 80000,
            price45: 110000,
            online: true,
            response: '2 phút',
            rating: 4.9,
            reviewsCount: 128,
            bio: 'Gia sư Điện - Điện tử, dạy dễ hiểu theo dạng bài tập thực tế.',
            education: 'Bách Khoa TP.HCM',
            verified: true,
            avatar: './images/profile-2.jpeg',
            slots: ['18:00', '18:15', '19:00'],
            reviews: [
                { name: 'Anh Tuấn', stars: 5, text: 'Giải thích rất nhanh và đúng trọng tâm.' },
                { name: 'Minh Thư', stars: 5, text: 'Học 30 phút mà hiểu được cả chương.' }
            ]
        },
        {
            id: 2,
            name: 'Trần Thu Hà',
            subject: 'Phương trình vi phân',
            topics: ['phương trình vi phân', 'toán cao cấp', 'giải tích'],
            price30: 60000,
            price45: 90000,
            online: false,
            response: '15 phút',
            rating: 4.8,
            reviewsCount: 94,
            bio: 'Chuyên Toán - dạy theo sơ đồ tư duy và bài mẫu ngắn gọn.',
            education: 'Đại học Sư phạm Hà Nội',
            verified: true,
            avatar: './images/profile-3.jpg',
            slots: ['08:00', '08:15', '20:00'],
            reviews: [
                { name: 'Khánh Vy', stars: 5, text: 'Cô rất kiên nhẫn và dễ hiểu.' },
                { name: 'Hoàng Long', stars: 4, text: 'Bài khó được chia nhỏ ra rất rõ.' }
            ]
        },
        {
            id: 3,
            name: 'Lê Quang Huy',
            subject: 'Database / SQL',
            topics: ['database', 'sql', 'dbms', 'query'],
            price30: 70000,
            price45: 100000,
            online: true,
            response: '4 phút',
            rating: 4.7,
            reviewsCount: 77,
            bio: 'Dạy SQL, thiết kế CSDL và chữa bài nhanh theo yêu cầu.',
            education: 'Đại học Công nghệ',
            verified: true,
            avatar: './images/profile-4.jpg',
            slots: ['16:00', '16:15', '21:00'],
            reviews: [
                { name: 'Bảo Ngọc', stars: 5, text: 'Chỉ 1 buổi là làm được đề.' },
                { name: 'Gia Hân', stars: 4, text: 'Nói chậm, rõ, rất dễ theo.' }
            ]
        },
        {
            id: 4,
            name: 'Phạm Gia Bảo',
            subject: 'Lập trình JavaScript',
            topics: ['javascript', 'frontend', 'html css js', 'web'],
            price30: 90000,
            price45: 130000,
            online: false,
            response: '20 phút',
            rating: 4.6,
            reviewsCount: 61,
            bio: 'Gia sư Web cơ bản đến nâng cao, phù hợp học nhanh 30/45 phút.',
            education: 'FPT University',
            verified: false,
            avatar: './images/profile-1.jpg',
            slots: ['10:00', '10:15', '14:00'],
            reviews: [
                { name: 'Duy Khánh', stars: 5, text: 'Mổ xẻ lỗi code rất nhanh.' },
                { name: 'Thảo My', stars: 4, text: 'Buổi học ngắn nhưng hiệu quả.' }
            ]
        }
    ],
    categories: [
        { name: 'Toán', icon: 'functions', colorClass: 'mth' },
        { name: 'Lập trình', icon: 'computer', colorClass: 'cs' },
        { name: 'Điện - Điện tử', icon: 'bolt', colorClass: 'eg' },
        { name: 'CSDL / SQL', icon: 'dns', colorClass: 'cg' },
        { name: 'Mạng', icon: 'router', colorClass: 'net' }
    ]
};

const tutorStorage = {
    getBookings() {
        return JSON.parse(localStorage.getItem('demoBookings') || '[]');
    },
    saveBookings(bookings) {
        localStorage.setItem('demoBookings', JSON.stringify(bookings));
    },
    addBooking(booking) {
        const bookings = tutorStorage.getBookings();
        bookings.unshift(booking);
        tutorStorage.saveBookings(bookings);
    }
};

const walletStorage = {
    getWallet() {
        const raw = localStorage.getItem('demoWallet');
        if (!raw) {
            const initial = { balance: 500000, transactions: [{ type: 'Top up', amount: 500000, note: 'Ví demo khởi tạo', date: new Date().toLocaleString('vi-VN') }] };
            localStorage.setItem('demoWallet', JSON.stringify(initial));
            return initial;
        }
        const wallet = JSON.parse(raw);
        wallet.balance = Number(wallet.balance || 0);
        wallet.transactions = Array.isArray(wallet.transactions) ? wallet.transactions : [];
        return wallet;
    },
    saveWallet(wallet) {
        localStorage.setItem('demoWallet', JSON.stringify(wallet));
    },
    topUp(amount, note = 'Nạp tiền') {
        const wallet = walletStorage.getWallet();
        wallet.balance += amount;
        wallet.transactions.unshift({ type: 'Top up', amount, note, date: new Date().toLocaleString('vi-VN') });
        walletStorage.saveWallet(wallet);
        return wallet;
    },
    withdraw(amount, note = 'Rút tiền') {
        const wallet = walletStorage.getWallet();
        if (wallet.balance < amount) return null;
        wallet.balance -= amount;
        wallet.transactions.unshift({ type: 'Withdraw', amount, note, date: new Date().toLocaleString('vi-VN') });
        walletStorage.saveWallet(wallet);
        return wallet;
    },
    spend(amount, note = 'Thanh toán ca học') {
        const wallet = walletStorage.getWallet();
        if (wallet.balance < amount) return null;
        wallet.balance -= amount;
        wallet.transactions.unshift({ type: 'Payment', amount, note, date: new Date().toLocaleString('vi-VN') });
        walletStorage.saveWallet(wallet);
        return wallet;
    }
};
