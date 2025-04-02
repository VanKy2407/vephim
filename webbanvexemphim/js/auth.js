document.addEventListener('DOMContentLoaded', function () {
    // Lấy các phần tử DOM
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Xử lý chuyển đổi tab
    authTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Cập nhật trạng thái active cho tab
            authTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Hiển thị form tương ứng
            const targetForm = this.dataset.tab;
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${targetForm}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });

    // Xử lý đăng ký
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Lấy dữ liệu từ form
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const phone = document.getElementById('register-phone').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        // Kiểm tra mật khẩu
        if (password !== confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }

        // Kiểm tra email đã tồn tại
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(user => user.email === email)) {
            alert('Email đã được sử dụng!');
            return;
        }

        // Tạo tài khoản mới
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            phone: phone,
            password: password, // Trong thực tế nên mã hóa mật khẩu
            createdAt: new Date().toLocaleString('vi-VN')
        };

        // Lưu vào localStorage
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Hiển thị thông báo thành công
        alert('Đăng ký thành công! Vui lòng đăng nhập.');

        // Chuyển sang tab đăng nhập
        document.querySelector('[data-tab="login"]').click();

        // Xóa form đăng ký
        registerForm.reset();
    });

    // Xử lý đăng nhập
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Lấy dữ liệu từ form
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        // Kiểm tra thông tin đăng nhập
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Lưu thông tin người dùng đăng nhập
            const currentUser = {
                id: user.id,
                name: user.name,
                email: user.email
            };

            if (rememberMe) {
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            }

            // Hiển thị thông báo thành công
            alert('Đăng nhập thành công!');

            // Chuyển hướng về trang chủ
            window.location.href = 'index.html';
        } else {
            alert('Email hoặc mật khẩu không đúng!');
        }
    });

    // Kiểm tra người dùng đã đăng nhập
    function checkLoggedInUser() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || 'null');
        if (currentUser) {
            // Chuyển hướng về trang chủ nếu đã đăng nhập
            window.location.href = 'index.html';
        }
    }

    // Gọi hàm kiểm tra đăng nhập
    checkLoggedInUser();
}); 