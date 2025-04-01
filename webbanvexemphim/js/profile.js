// Chuyển đổi giữa các tab
document.addEventListener('DOMContentLoaded', function () {
    // Lấy tất cả các liên kết trong menu
    const menuLinks = document.querySelectorAll('.profile-menu a');
    const sections = document.querySelectorAll('.content-section');

    // Xử lý sự kiện click cho mỗi liên kết
    menuLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Lấy ID của section cần hiển thị
            const targetId = this.getAttribute('href').substring(1);

            // Cập nhật trạng thái active cho menu
            menuLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Hiển thị section tương ứng
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Xử lý form cập nhật thông tin
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Lấy dữ liệu từ form
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            // Gửi dữ liệu lên server (giả lập)
            console.log('Cập nhật thông tin:', data);

            // Hiển thị thông báo thành công
            alert('Cập nhật thông tin thành công!');
        });
    }

    // Xử lý form cài đặt
    const settingsForm = document.querySelector('.settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Lấy dữ liệu từ form
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            // Gửi dữ liệu lên server (giả lập)
            console.log('Cập nhật cài đặt:', data);

            // Hiển thị thông báo thành công
            alert('Cập nhật cài đặt thành công!');
        });
    }

    // Hiển thị lịch sử đặt vé
    function displayBookingHistory() {
        const bookingHistory = document.querySelector('.booking-history');
        if (!bookingHistory) return;

        // Lấy danh sách vé đã đặt từ localStorage
        const bookedTickets = JSON.parse(localStorage.getItem('bookedTickets') || '[]');

        // Tạo HTML cho danh sách vé
        const ticketsHTML = bookedTickets.map(ticket => `
            <div class="booking-card">
                <div class="booking-info">
                    <h3>${ticket.movie.title}</h3>
                    <p>Ngày: ${ticket.date.date}/${ticket.date.day}</p>
                    <p>Suất: ${ticket.time}</p>
                    <p>Ghế: ${ticket.seats.join(', ')}</p>
                    <p>Tổng tiền: ${ticket.totalPrice.toLocaleString('vi-VN')}đ</p>
                    <p>Trạng thái: ${ticket.status}</p>
                    <p>Thời gian đặt: ${ticket.bookingDate}</p>
                </div>
                <div class="booking-actions">
                    <button class="view-ticket" data-ticket-id="${ticket.id}">Xem vé</button>
                </div>
            </div>
        `).join('');

        // Cập nhật nội dung
        bookingHistory.innerHTML = ticketsHTML;

        // Thêm sự kiện cho nút xem vé
        const viewButtons = bookingHistory.querySelectorAll('.view-ticket');
        viewButtons.forEach(button => {
            button.addEventListener('click', function () {
                const ticketId = this.dataset.ticketId;
                const ticket = bookedTickets.find(t => t.id === parseInt(ticketId));
                if (ticket) {
                    showTicketModal(ticket);
                }
            });
        });
    }

    // Hiển thị modal vé
    function showTicketModal(ticket) {
        const modal = document.createElement('div');
        modal.className = 'ticket-modal';
        modal.innerHTML = `
            <div class="ticket-content">
                <h2>Vé xem phim</h2>
                <div class="ticket-details">
                    <p><strong>Phim:</strong> ${ticket.movie.title}</p>
                    <p><strong>Ngày:</strong> ${ticket.date.date}/${ticket.date.day}</p>
                    <p><strong>Suất:</strong> ${ticket.time}</p>
                    <p><strong>Ghế:</strong> ${ticket.seats.join(', ')}</p>
                    <p><strong>Tổng tiền:</strong> ${ticket.totalPrice.toLocaleString('vi-VN')}đ</p>
                    <p><strong>Trạng thái:</strong> ${ticket.status}</p>
                </div>
                <div class="ticket-actions">
                    <button class="print-ticket">In vé</button>
                    <button class="close-modal">Đóng</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Xử lý sự kiện đóng modal
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        // Xử lý sự kiện in vé
        const printBtn = modal.querySelector('.print-ticket');
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // Gọi hàm hiển thị lịch sử đặt vé
    displayBookingHistory();
});

// Thêm CSS cho modal vé
const style = document.createElement('style');
style.textContent = `
    .ticket-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .ticket-content {
        background: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 400px;
        width: 90%;
        text-align: center;
    }
    
    .ticket-content h2 {
        color: var(--primary-color);
        margin-bottom: 20px;
    }
    
    .ticket-details {
        text-align: left;
        margin-bottom: 20px;
    }
    
    .ticket-details p {
        margin: 10px 0;
    }
    
    .print-ticket {
        background: var(--primary-color);
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s ease;
    }
    
    .print-ticket:hover {
        background: var(--secondary-color);
    }
    
    @media print {
        .ticket-modal {
            position: static;
            background: none;
        }
        
        .ticket-content {
            box-shadow: none;
        }
        
        .print-ticket {
            display: none;
        }
    }
`;
document.head.appendChild(style); 