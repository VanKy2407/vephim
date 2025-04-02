document.addEventListener('DOMContentLoaded', function () {
    // Khởi tạo các biến
    let currentStep = 1;
    let selectedMovie = null;
    let selectedDate = null;
    let selectedTime = null;
    let selectedSeats = [];
    const totalSteps = 4;

    // Lấy các phần tử DOM
    const steps = document.querySelectorAll('.step');
    const bookingSteps = document.querySelectorAll('.booking-step');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    const confirmBtn = document.querySelector('.nav-btn.confirm');

    // Xử lý chọn phim
    const movieButtons = document.querySelectorAll('.select-movie');
    movieButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Cập nhật trạng thái chọn phim
            movieButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Lưu thông tin phim đã chọn
            selectedMovie = {
                title: this.closest('.movie-info').querySelector('h3').textContent,
                duration: this.closest('.movie-info').querySelector('p').textContent,
                genre: this.closest('.movie-info').querySelectorAll('p')[1].textContent
            };

            // Cập nhật tổng kết
            document.getElementById('summary-movie').textContent = selectedMovie.title;

            // Cập nhật trạng thái nút tiếp tục
            updateNavigation();
        });
    });

    // Xử lý chọn ngày
    const dateCards = document.querySelectorAll('.date-card');
    dateCards.forEach(card => {
        card.addEventListener('click', function () {
            // Cập nhật trạng thái chọn ngày
            dateCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            // Lưu ngày đã chọn
            selectedDate = {
                date: this.querySelector('.date').textContent,
                day: this.querySelector('.day').textContent
            };

            // Cập nhật tổng kết
            document.getElementById('summary-date').textContent = selectedDate.date + '/2024';

            // Cập nhật trạng thái nút tiếp tục
            updateNavigation();
        });
    });

    // Xử lý chọn suất chiếu
    const showtimeButtons = document.querySelectorAll('.showtime-btn');
    showtimeButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Cập nhật trạng thái chọn suất
            showtimeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Lưu suất đã chọn
            selectedTime = this.textContent;

            // Cập nhật tổng kết
            document.getElementById('summary-time').textContent = selectedTime;

            // Cập nhật trạng thái nút tiếp tục
            updateNavigation();
        });
    });

    // Xử lý chọn ghế
    const seats = document.querySelectorAll('.seat');
    seats.forEach(seat => {
        seat.addEventListener('click', function () {
            if (this.classList.contains('occupied')) return;

            // Chuyển đổi trạng thái ghế
            this.classList.toggle('selected');

            // Cập nhật danh sách ghế đã chọn
            if (this.classList.contains('selected')) {
                selectedSeats.push(this.dataset.seat);
            } else {
                selectedSeats = selectedSeats.filter(seat => seat !== this.dataset.seat);
            }

            // Cập nhật tổng kết
            document.getElementById('summary-seats').textContent = selectedSeats.join(', ');

            // Cập nhật tổng tiền
            const totalPrice = selectedSeats.length * 100000; // Giá vé 100.000đ
            document.getElementById('summary-total').textContent = totalPrice.toLocaleString('vi-VN') + 'đ';

            // Cập nhật trạng thái nút tiếp tục
            updateNavigation();
        });
    });

    // Xử lý nút điều hướng
    function updateNavigation() {
        // Cập nhật trạng thái nút Quay lại
        prevBtn.disabled = currentStep === 1;

        // Cập nhật nút Tiếp tục/Đặt vé
        if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            confirmBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            confirmBtn.style.display = 'none';
        }

        // Kiểm tra điều kiện chuyển bước
        nextBtn.disabled = !canProceed();
    }

    function canProceed() {
        switch (currentStep) {
            case 1:
                return selectedMovie !== null;
            case 2:
                return selectedDate !== null && selectedTime !== null;
            case 3:
                return selectedSeats.length > 0;
            default:
                return true;
        }
    }

    function goToStep(step) {
        // Cập nhật trạng thái bước
        steps.forEach(s => s.classList.remove('active'));
        steps[step - 1].classList.add('active');

        // Cập nhật nội dung
        bookingSteps.forEach(s => s.classList.remove('active'));
        document.getElementById(`step${step}`).classList.add('active');

        // Cập nhật điều hướng
        currentStep = step;
        updateNavigation();
    }

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            goToStep(currentStep - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps && canProceed()) {
            goToStep(currentStep + 1);
        }
    });

    // Xử lý xác nhận đặt vé
    const paymentForm = document.querySelector('.payment-form');
    paymentForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const paymentMethod = document.getElementById('payment-method').value;

        // Tạo dữ liệu đặt vé
        const bookingData = {
            id: Date.now(), // Tạo ID duy nhất cho vé
            movie: selectedMovie,
            date: selectedDate,
            time: selectedTime,
            seats: selectedSeats,
            totalPrice: selectedSeats.length * 100000,
            paymentMethod: paymentMethod,
            status: 'Đã đặt', // Trạng thái vé
            bookingDate: new Date().toLocaleString('vi-VN') // Thời gian đặt vé
        };

        // Lấy thông tin người dùng đăng nhập
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('Vui lòng đăng nhập để đặt vé!');
            window.location.href = 'login.html';
            return;
        }

        // Lấy danh sách vé đã đặt từ localStorage
        let bookedTickets = JSON.parse(localStorage.getItem('bookedTickets') || '[]');

        // Thêm vé mới vào danh sách
        bookedTickets.push(bookingData);

        // Lưu lại vào localStorage
        localStorage.setItem('bookedTickets', JSON.stringify(bookedTickets));

        // Tạo nội dung email
        const emailContent = `
            <h2>Xác nhận đặt vé thành công!</h2>
            <p>Kính gửi ${currentUser.name},</p>
            <p>Cảm ơn bạn đã đặt vé tại MovieTicket. Dưới đây là thông tin chi tiết vé của bạn:</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3>Thông tin vé</h3>
                <p><strong>Mã vé:</strong> ${bookingData.id}</p>
                <p><strong>Phim:</strong> ${bookingData.movie.title}</p>
                <p><strong>Ngày:</strong> ${bookingData.date.date}/${bookingData.date.day}</p>
                <p><strong>Suất:</strong> ${bookingData.time}</p>
                <p><strong>Ghế:</strong> ${bookingData.seats.join(', ')}</p>
                <p><strong>Tổng tiền:</strong> ${bookingData.totalPrice.toLocaleString('vi-VN')}đ</p>
                <p><strong>Phương thức thanh toán:</strong> ${getPaymentMethodName(bookingData.paymentMethod)}</p>
            </div>

            <p>Vui lòng đến rạp sớm 15 phút trước giờ chiếu và mang theo mã vé này.</p>
            <p>Chúc bạn xem phim vui vẻ!</p>
            
            <p>Trân trọng,<br>MovieTicket Team</p>
        `;

        // Gửi email (giả lập)
        sendEmail(currentUser.email, 'Xác nhận đặt vé MovieTicket', emailContent);

        // Hiển thị thông báo thành công
        alert('Đặt vé thành công! Vui lòng kiểm tra email của bạn.');

        // Chuyển hướng về trang chủ
        window.location.href = 'index.html';
    });

    // Hàm lấy tên phương thức thanh toán
    function getPaymentMethodName(method) {
        const methods = {
            'credit': 'Thẻ tín dụng',
            'debit': 'Thẻ ghi nợ',
            'bank': 'Chuyển khoản ngân hàng',
            'e-wallet': 'Ví điện tử'
        };
        return methods[method] || method;
    }

    // Hàm giả lập gửi email
    function sendEmail(to, subject, content) {
        // Trong thực tế, bạn sẽ sử dụng một service gửi email như SendGrid, Mailgun, etc.
        console.log('Gửi email đến:', to);
        console.log('Tiêu đề:', subject);
        console.log('Nội dung:', content);

        // Lưu email vào localStorage để demo
        let emails = JSON.parse(localStorage.getItem('sentEmails') || '[]');
        emails.push({
            to: to,
            subject: subject,
            content: content,
            sentAt: new Date().toLocaleString('vi-VN')
        });
        localStorage.setItem('sentEmails', JSON.stringify(emails));
    }

    // Khởi tạo trạng thái ban đầu
    updateNavigation();
});