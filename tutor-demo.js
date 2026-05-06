document.addEventListener('DOMContentLoaded', () => {
    const data = window.tutorDemoData;
    if (!data) return;

    const params = new URLSearchParams(location.search);
    const page = document.body.dataset.page || 'home';

    const money = (value) => new Intl.NumberFormat('vi-VN').format(Number(value || 0)) + 'đ';

    const courses = [
        { name: 'Toán cao cấp', level: 'Giải tích • Phương trình vi phân', description: 'Học theo bài mẫu, phù hợp ôn thi và chữa bài nhanh.', color: 'mth' },
        { name: 'Lập trình Web', level: 'HTML • CSS • JavaScript', description: 'Đi từ cơ bản tới làm bài tập thực tế trong từng buổi ngắn.', color: 'cs' },
        { name: 'Điện - Điện tử', level: 'Mạch xoay chiều • DBMS', description: 'Dành cho người cần hiểu công thức, sơ đồ và cách giải đề nhanh.', color: 'eg' }
    ];

    const renderTutorCard = (tutor) => `
        <article class="tutor-card">
            <div class="tutor-card-head">
                <img src="${tutor.avatar}" alt="${tutor.name}">
                <div>
                    <h3>${tutor.name}</h3>
                    <p>${tutor.subject}</p>
                </div>
            </div>
            <div class="tutor-tags">
                ${tutor.online ? '<span class="tag live">Học ngay</span>' : ''}
                ${tutor.verified ? '<span class="tag verified">Xác minh</span>' : ''}
                <span class="tag">${tutor.response} phản hồi</span>
            </div>
            <p>${tutor.bio}</p>
            <div class="tutor-meta">
                <span>⭐ ${tutor.rating} (${tutor.reviewsCount})</span>
                <span>${money(tutor.price30)}/30p</span>
            </div>
            <div class="tutor-actions">
                <a class="btn-link" href="tutor.html?id=${tutor.id}">Xem hồ sơ</a>
                <button class="btn-primary js-book-now" data-id="${tutor.id}">Đặt lịch nhanh</button>
            </div>
        </article>`;

    const saveBookingAndGo = (tutorId, duration) => {
        const tutor = data.tutors.find(t => String(t.id) === String(tutorId));
        if (!tutor) return;
        const price = duration === '45' ? tutor.price45 : tutor.price30;
        const wallet = walletStorage.spend(price, `Thanh toán ${tutor.name} (${duration}p)`);
        if (!wallet) {
            alert('Ví không đủ tiền. Vui lòng nạp thêm để đặt ca học.');
            return;
        }
        tutorStorage.addBooking({ id: Date.now(), tutorId: tutor.id, tutorName: tutor.name, subject: tutor.subject, duration, price, status: 'Pending', date: new Date().toLocaleString('vi-VN') });
        renderWalletAndBookings();
        if (page !== 'home') location.href = 'bookings.html';
    };

    const bindBookingButtons = () => {
        document.querySelectorAll('.js-book-now').forEach(btn => btn.addEventListener('click', () => saveBookingAndGo(btn.dataset.id, '30')));
    };

    const renderWalletAndBookings = () => {
        const wallet = walletStorage.getWallet();
        const bookings = tutorStorage.getBookings();
        const upcomingList = bookings.filter(b => ['Pending', 'Confirmed', 'In-Progress'].includes(b.status));
        const historyList = bookings.filter(b => b.status === 'Completed');
        const renderBooking = (b) => `
            <article class="booking-card">
                <h3>${b.tutorName}</h3>
                <p>${b.subject}</p>
                <p>${b.duration} phút • ${money(b.price)}</p>
                <p>Trạng thái: <b>${b.status}</b></p>
                <small>${b.date}</small>
            </article>`;
        const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
        const setHTML = (id, value) => { const el = document.getElementById(id); if (el) el.innerHTML = value; };
        setText('wallet-balance', money(wallet.balance));
        setText('home-wallet-balance', money(wallet.balance));
        setHTML('upcoming-bookings', upcomingList.length ? upcomingList.map(renderBooking).join('') : '<p class="empty-state">Chưa có lịch hẹn.</p>');
        setHTML('history-bookings', historyList.length ? historyList.map(renderBooking).join('') : '<p class="empty-state">Chưa có lịch sử học tập.</p>');
        setHTML('home-upcoming-bookings', upcomingList.length ? upcomingList.map(renderBooking).join('') : '<p class="empty-state">Chưa có lịch hẹn.</p>');
        setHTML('home-booking-history', historyList.length ? historyList.map(renderBooking).join('') : '<p class="empty-state">Chưa có lịch sử học tập.</p>');
        const transactions = wallet.transactions || [];
        setHTML('wallet-transactions', transactions.length ? transactions.map(t => `
            <article class="booking-card">
                <h3>${t.type}</h3>
                <p>${t.note}</p>
                <p>${money(t.amount)}</p>
                <small>${t.date || ''}</small>
            </article>`).join('') : '<p class="empty-state">Chưa có giao dịch.</p>');
    };

    const bindWalletAction = (inputId, buttonId, action) => {
        const amountInput = document.getElementById(inputId);
        const actionBtn = document.getElementById(buttonId);
        if (!amountInput || !actionBtn) return;
        actionBtn.addEventListener('click', () => {
            const amount = Number(amountInput.value);
            if (!Number.isFinite(amount) || amount <= 0) {
                alert('Nhập số tiền hợp lệ.');
                return;
            }
            const result = action(amount);
            if (!result) {
                alert('Số dư không đủ để rút.');
                return;
            }
            amountInput.value = '';
            renderWalletAndBookings();
        });
    };

    const bindCourseCards = () => {
        const courseCards = document.getElementById('course-cards');
        const courseDetails = document.getElementById('course-details');
        if (!courseCards || !courseDetails) return;
        courseCards.innerHTML = courses.map((course, index) => `<button type="button" class="course-card ${course.color}" data-index="${index}"><span class="material-icons-sharp">school</span><h3>${course.name}</h3><p>${course.level}</p></button>`).join('');
        const showCourse = (course) => {
            courseDetails.classList.remove('hidden');
            courseDetails.innerHTML = `<h3>${course.name}</h3><p><b>Chủ đề:</b> ${course.level}</p><p>${course.description}</p><div class="tutor-actions" style="margin-top:1rem;"><a class="btn-link" href="search.html?q=${encodeURIComponent(course.name)}">Tìm gia sư</a><a class="btn-primary" href="tutor.html?id=1">Xem khóa liên quan</a></div>`;
        };
        courseCards.querySelectorAll('.course-card').forEach(btn => btn.addEventListener('click', () => showCourse(courses[Number(btn.dataset.index)])));
        showCourse(courses[0]);
    };

    if (page === 'home') {
        const searchInput = document.getElementById('quick-search');
        const subjectGrid = document.getElementById('featured-subjects');
        const tutorGrid = document.getElementById('featured-tutors');
        const categoriesLink = document.getElementById('go-search');
        const bookingsLink = document.getElementById('go-bookings');
        if (subjectGrid) subjectGrid.innerHTML = data.categories.map(cat => `<div class="subject-chip ${cat.colorClass}"><span class="material-icons-sharp">${cat.icon}</span><h3>${cat.name}</h3></div>`).join('');
        if (tutorGrid) { tutorGrid.innerHTML = data.tutors.slice(0, 3).map(renderTutorCard).join(''); bindBookingButtons(); }
        if (searchInput) searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') location.href = `search.html?q=${encodeURIComponent(searchInput.value.trim())}`; });
        if (categoriesLink) categoriesLink.addEventListener('click', (e) => { e.preventDefault(); location.href = 'search.html'; });
        if (bookingsLink) bookingsLink.addEventListener('click', (e) => { e.preventDefault(); location.href = 'bookings.html'; });
        bindCourseCards();
        renderWalletAndBookings();
    }

    if (page === 'search') {
        const keyword = document.getElementById('keyword');
        const subject = document.getElementById('subject');
        const price = document.getElementById('price');
        const slot = document.getElementById('slot');
        const flash = document.getElementById('flash');
        const results = document.getElementById('search-results');
        const initialQ = params.get('q') || '';
        if (keyword) keyword.value = initialQ;
        const matches = () => {
            const q = (keyword?.value || '').trim().toLowerCase();
            const selectedSubject = subject?.value || ''; const selectedPrice = price?.value || ''; const selectedSlot = slot?.value || ''; const flashOnly = flash?.checked || false;
            return data.tutors.filter(tutor => { const haystack = [tutor.name, tutor.subject, tutor.bio, ...tutor.topics].join(' ').toLowerCase(); const qOk = !q || haystack.includes(q); const subjectOk = !selectedSubject || tutor.subject.toLowerCase().includes(selectedSubject.toLowerCase()); const priceOk = !selectedPrice || (selectedPrice === 'low' ? tutor.price30 <= 70000 : selectedPrice === 'mid' ? tutor.price30 > 70000 && tutor.price30 <= 100000 : tutor.price30 > 100000); const slotOk = !selectedSlot || tutor.slots.some(s => selectedSlot === '30' ? true : selectedSlot === '45' ? true : false); const flashOk = !flashOnly || tutor.online; return qOk && subjectOk && priceOk && slotOk && flashOk; });
        };
        const render = () => { const list = matches(); if (!results) return; results.innerHTML = list.length ? list.map(renderTutorCard).join('') : '<p class="empty-state">Không tìm thấy gia sư phù hợp.</p>'; bindBookingButtons(); };
        [keyword, subject, price, slot, flash].forEach(el => el && el.addEventListener('input', render));
        render();
    }

    if (page === 'tutor') {
        const tutorId = params.get('id') || '1';
        const tutor = data.tutors.find(t => String(t.id) === String(tutorId)) || data.tutors[0];
        const root = document.getElementById('tutor-profile'); const slots = document.getElementById('tutor-slots'); const reviews = document.getElementById('tutor-reviews'); const book30 = document.getElementById('book-30'); const book45 = document.getElementById('book-45');
        if (root) root.innerHTML = `<div class="tutor-profile-hero"><img src="${tutor.avatar}" alt="${tutor.name}"><div><h1>${tutor.name}</h1><p>${tutor.subject}</p><p>${tutor.bio}</p><div class="tutor-tags">${tutor.online ? '<span class="tag live">Đang online</span>' : '<span class="tag">Offline</span>'}${tutor.verified ? '<span class="tag verified">Bằng cấp xác minh</span>' : ''}</div></div></div><div class="profile-stats"><div><strong>⭐ ${tutor.rating}</strong><span>${tutor.reviewsCount} đánh giá</span></div><div><strong>${money(tutor.price30)}</strong><span>/ 30 phút</span></div><div><strong>${money(tutor.price45)}</strong><span>/ 45 phút</span></div><div><strong>${tutor.response}</strong><span>phản hồi trung bình</span></div></div><div class="profile-sections"><section><h2>Thông tin chi tiết</h2><p><b>Học vấn:</b> ${tutor.education}</p><p><b>Trạng thái:</b> ${tutor.online ? 'Flash Study sẵn sàng trong 5 phút' : 'Đặt lịch trước'}</p><p><b>Kỹ năng:</b> ${tutor.topics.join(', ')}</p></section><section><h2>Khung giờ rảnh</h2><div class="slot-list" id="tutor-slots"></div></section><section class="full"><h2>Đánh giá từ người học</h2><div id="tutor-reviews" class="review-list"></div></section></div>`;
        if (slots) slots.innerHTML = tutor.slots.map(s => `<span class="slot-chip">${s}</span>`).join('');
        if (reviews) reviews.innerHTML = tutor.reviews.map(r => `<article class="review-card"><strong>${r.name}</strong><p>⭐ ${r.stars}</p><p>${r.text}</p></article>`).join('');
        if (book30) book30.addEventListener('click', () => saveBookingAndGo(tutor.id, '30'));
        if (book45) book45.addEventListener('click', () => saveBookingAndGo(tutor.id, '45'));
    }

    if (page === 'bookings') {
        bindWalletAction('topup-amount', 'topup-btn', (amount) => walletStorage.topUp(amount, 'Nạp tiền vào Study-Wallet'));
        bindWalletAction('withdraw-amount', 'withdraw-btn', (amount) => walletStorage.withdraw(amount, 'Rút tiền từ Study-Wallet'));
        renderWalletAndBookings();
    }
});
