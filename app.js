document.addEventListener('DOMContentLoaded', () => {
    const sideMenu = document.querySelector("aside");
    const profileBtn = document.querySelector("#profile-btn");
    const themeToggler = document.querySelector(".theme-toggler");
    const nextDay = document.getElementById('nextDay');
    const prevDay = document.getElementById('prevDay');
    const logoutLink = document.getElementById('logout-link');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const profileModal = document.getElementById('profile-modal');
    const closeProfileModal = document.getElementById('close-profile-modal');
    const cancelProfileEdit = document.getElementById('cancel-profile-edit');
    const profileForm = document.getElementById('profile-form');

    const profileFields = {
        avatar: document.getElementById('profile-avatar'),
        name: document.getElementById('profile-name'),
        studentId: document.getElementById('profile-student-id'),
        course: document.getElementById('profile-course'),
        dob: document.getElementById('profile-dob'),
        contact: document.getElementById('profile-contact'),
        email: document.getElementById('profile-email'),
        address: document.getElementById('profile-address')
    };

    const editFields = {
        avatar: document.getElementById('edit-avatar'),
        name: document.getElementById('edit-name'),
        studentId: document.getElementById('edit-student-id'),
        course: document.getElementById('edit-course'),
        dob: document.getElementById('edit-dob'),
        contact: document.getElementById('edit-contact'),
        email: document.getElementById('edit-email'),
        address: document.getElementById('edit-address')
    };

    const profileError = document.createElement('p');
    profileError.className = 'profile-error';
    profileError.textContent = 'Please fill in name, student ID, course, and email correctly.';
    if (profileForm && !profileForm.querySelector('.profile-error')) {
        profileForm.insertBefore(profileError, profileForm.firstChild);
    }

    const defaultProfile = {
        avatar: './images/profile-1.jpg',
        name: 'Alex',
        studentId: '12102030',
        course: 'BTech. Computer Science & Engineering',
        dob: '29-Feb-2020',
        contact: '1234567890',
        email: 'unknown@gmail.com',
        address: 'Ghost town Road, New York, America'
    };

    const loadProfile = () => {
        const saved = JSON.parse(localStorage.getItem('studentProfile') || 'null');
        const profile = { ...defaultProfile, ...(saved || {}) };

        if (profileFields.avatar) profileFields.avatar.src = profile.avatar;
        if (profileFields.name) profileFields.name.textContent = profile.name;
        if (profileFields.studentId) profileFields.studentId.textContent = profile.studentId;
        if (profileFields.course) profileFields.course.textContent = profile.course;
        if (profileFields.dob) profileFields.dob.textContent = profile.dob;
        if (profileFields.contact) profileFields.contact.textContent = profile.contact;
        if (profileFields.email) profileFields.email.textContent = profile.email;
        if (profileFields.address) profileFields.address.textContent = profile.address;

        if (editFields.avatar) editFields.avatar.value = profile.avatar;
        if (editFields.name) editFields.name.value = profile.name;
        if (editFields.studentId) editFields.studentId.value = profile.studentId;
        if (editFields.course) editFields.course.value = profile.course;
        if (editFields.dob) editFields.dob.value = profile.dob;
        if (editFields.contact) editFields.contact.value = profile.contact;
        if (editFields.email) editFields.email.value = profile.email;
        if (editFields.address) editFields.address.value = profile.address;
    };

    const openProfileModal = () => {
        if (!profileModal) return;
        loadProfile();
        profileModal.classList.add('active');
        profileModal.setAttribute('aria-hidden', 'false');
        if (profileError) {
            profileError.style.display = 'none';
            profileError.classList.remove('visible');
        }
    };

    const closeModal = () => {
        if (!profileModal) return;
        profileModal.classList.remove('active');
        profileModal.setAttribute('aria-hidden', 'true');
    };

    const validateProfile = (profile) => {
        const emailOk = /^\S+@\S+\.\S+$/.test(profile.email);
        return profile.name && profile.studentId && profile.course && emailOk;
    };

    if (profileBtn && sideMenu) {
        profileBtn.onclick = function() {
            sideMenu.classList.toggle('active');
        };
    }

    window.onscroll = () => {
        if (sideMenu) sideMenu.classList.remove('active');
        const header = document.querySelector('header');
        if (header) {
            if(window.scrollY > 0) header.classList.add('active');
            else header.classList.remove('active');
        }
    };

    const applySavedTheme = () => {
        if (!themeToggler) return;
        const isDarkMode = localStorage.getItem('dark-theme') === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark-theme');
            themeToggler.querySelector('span:nth-child(1)').classList.add('active');
            themeToggler.querySelector('span:nth-child(2)').classList.remove('active');
        } else {
            document.body.classList.remove('dark-theme');
            themeToggler.querySelector('span:nth-child(1)').classList.remove('active');
            themeToggler.querySelector('span:nth-child(2)').classList.add('active');
        }
    };

    applySavedTheme();

    if (themeToggler) {
        themeToggler.onclick = function() {
            document.body.classList.toggle('dark-theme');
            themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
            themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
            localStorage.setItem('dark-theme', document.body.classList.contains('dark-theme'));
        };
    }

    let setData = (day) => {
        const tableBody = document.querySelector('table tbody');
        const timetableHeading = document.querySelector('.timetable div h2');
        if (!tableBody || !timetableHeading) return;
        tableBody.innerHTML = '';
        let daylist = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        timetableHeading.innerHTML = daylist[day];
        let daySchedule = [];
        switch(day) {
            case 0: daySchedule = Sunday; break;
            case 1: daySchedule = Monday; break;
            case 2: daySchedule = Tuesday; break;
            case 3: daySchedule = Wednesday; break;
            case 4: daySchedule = Thursday; break;
            case 5: daySchedule = Friday; break;
            case 6: daySchedule = Saturday; break;
        }
        daySchedule.forEach(sub => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${sub.time}</td>
                <td>${sub.roomNumber}</td>
                <td>${sub.subject}</td>
                <td>${sub.type}</td>
            `;
            tableBody.appendChild(tr);
        });
    };

    let now = new Date();
    let today = now.getDay();
    let day = today;

    window.timeTableAll = function() {
        const timetable = document.getElementById('timetable');
        if (!timetable) return;
        timetable.classList.toggle('active');
        setData(today);
        const heading = document.querySelector('.timetable div h2');
        if (heading) heading.innerHTML = "Today's Timetable";
    };

    if (nextDay) {
        nextDay.onclick = function() {
            day <= 5 ? day++ : day = 0;
            setData(day);
        };
    }

    if (prevDay) {
        prevDay.onclick = function() {
            day >= 1 ? day-- : day = 6;
            setData(day);
        };
    }

    if (editProfileBtn) editProfileBtn.addEventListener('click', openProfileModal);
    if (closeProfileModal) closeProfileModal.addEventListener('click', closeModal);
    if (cancelProfileEdit) cancelProfileEdit.addEventListener('click', closeModal);
    if (profileModal) {
        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) closeModal();
        });
    }

    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const updatedProfile = {
                avatar: editFields.avatar.value.trim() || defaultProfile.avatar,
                name: editFields.name.value.trim(),
                studentId: editFields.studentId.value.trim(),
                course: editFields.course.value.trim(),
                dob: editFields.dob.value.trim(),
                contact: editFields.contact.value.trim(),
                email: editFields.email.value.trim(),
                address: editFields.address.value.trim()
            };

            const invalidInputs = [editFields.name, editFields.studentId, editFields.course, editFields.email].filter(Boolean);
            invalidInputs.forEach(input => input.classList.remove('invalid'));

            if (!validateProfile(updatedProfile)) {
                if (profileError) profileError.style.display = 'block';
                if (!updatedProfile.name && editFields.name) editFields.name.classList.add('invalid');
                if (!updatedProfile.studentId && editFields.studentId) editFields.studentId.classList.add('invalid');
                if (!updatedProfile.course && editFields.course) editFields.course.classList.add('invalid');
                if (!/^\S+@\S+\.\S+$/.test(updatedProfile.email) && editFields.email) editFields.email.classList.add('invalid');
                return;
            }

            if (profileError) profileError.style.display = 'none';
            localStorage.setItem('studentProfile', JSON.stringify(updatedProfile));
            loadProfile();
            closeModal();
        });
    }

    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('username');
            window.location.href = 'login.html';
        });
    }

    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuth && !location.pathname.endsWith('login.html')) {
        window.location.href = 'login.html';
        return;
    }

    loadProfile();
    setData(day);
    const timetableHeading = document.querySelector('.timetable div h2');
    if (timetableHeading) timetableHeading.innerHTML = "Today's Timetable";
});
