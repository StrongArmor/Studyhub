// Simple client-side login logic for demo purposes only
// This stores a mock "auth" flag in localStorage. In production use secure server-side auth.

document.addEventListener('DOMContentLoaded', () => {
    const tabSignIn = document.getElementById('tabSignIn');
    const tabSignUp = document.getElementById('tabSignUp');
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    const authTitle = document.getElementById('authTitle');
    const loginError = document.getElementById('loginError');
    const signupError = document.getElementById('signupError');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const newUsername = document.getElementById('newUsername');
    const newPassword = document.getElementById('newPassword');

    // Simple demo credentials
    const DEMO_USER = 'student';
    const DEMO_PASS = 'password123';

    const setError = (el, message) => {
        if (!el) return;
        el.textContent = message;
        el.style.display = message ? 'block' : 'none';
    };

    const setMode = (mode) => {
        const isSignIn = mode === 'signin';
        tabSignIn.classList.toggle('active', isSignIn);
        tabSignUp.classList.toggle('active', !isSignIn);
        signInForm.classList.toggle('hidden', !isSignIn);
        signUpForm.classList.toggle('hidden', isSignIn);
        authTitle.textContent = isSignIn ? 'Sign in' : 'Sign up';
        setError(loginError, '');
        setError(signupError, '');
    };

    tabSignIn.addEventListener('click', () => setMode('signin'));
    tabSignUp.addEventListener('click', () => setMode('signup'));

    signInForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = username.value.trim();
        const p = password.value;
        const savedAccounts = JSON.parse(localStorage.getItem('demoAccounts') || '[]');
        const isDemo = u === DEMO_USER && p === DEMO_PASS;
        const isSaved = savedAccounts.some(a => a.username === u && a.password === p);

        if (!u || !p) {
            setError(loginError, 'Vui lòng nhập username và password.');
            return;
        }

        if (isDemo || isSaved) {
            // Mark as authenticated
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('username', u);
            // Redirect to home
            window.location.href = 'index.html';
        } else {
            setError(loginError, 'Tên đăng nhập hoặc mật khẩu không đúng.');
        }
    });

    signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = newUsername.value.trim();
        const p = newPassword.value;
        const accounts = JSON.parse(localStorage.getItem('demoAccounts') || '[]');

        if (!u || !p) {
            setError(signupError, 'Vui lòng nhập username và password.');
            return;
        }
        if (accounts.some(a => a.username === u) || u === DEMO_USER) {
            setError(signupError, 'Username đã tồn tại.');
            return;
        }

        accounts.push({ username: u, password: p });
        localStorage.setItem('demoAccounts', JSON.stringify(accounts));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', u);
        window.location.href = 'index.html';
    });
});
