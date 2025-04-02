document.addEventListener('DOMContentLoaded', function () {
    // Khởi tạo các biến
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const movieCards = document.querySelectorAll('.movie-card');
    const showtimeButtons = document.querySelectorAll('.showtime-btn');
    const userMenu = document.querySelector('.user-menu');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    // Lấy các phần tử lọc và tìm kiếm
    const searchInput = document.getElementById('movie-search');
    const genreFilter = document.getElementById('genre-filter');
    const durationFilter = document.getElementById('duration-filter');

    // Xử lý tìm kiếm và lọc phim
    function filterMovies() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedGenre = genreFilter.value;
        const selectedDuration = durationFilter.value;

        movieCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const genre = card.dataset.genre;
            const duration = card.dataset.duration;

            const matchesSearch = title.includes(searchTerm);
            const matchesGenre = !selectedGenre || genre.includes(selectedGenre);
            const matchesDuration = !selectedDuration || duration === selectedDuration;

            if (matchesSearch && matchesGenre && matchesDuration) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Thêm sự kiện cho tìm kiếm và lọc
    searchInput.addEventListener('input', filterMovies);
    genreFilter.addEventListener('change', filterMovies);
    durationFilter.addEventListener('change', filterMovies);

    // Xử lý cuộn trang
    let lastScroll = 0;
    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        // Ẩn/hiện thanh điều hướng khi cuộn
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        // Thay đổi màu nền thanh điều hướng khi cuộn
        if (currentScroll > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'var(--white)';
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // Xử lý điều hướng mượt mà
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Xử lý hiệu ứng cho thẻ phim
    movieCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // Xử lý chọn suất chiếu
    showtimeButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Xóa trạng thái active của các nút khác
            showtimeButtons.forEach(btn => btn.classList.remove('active'));

            // Thêm trạng thái active cho nút được chọn
            this.classList.add('active');

            // Chuyển hướng đến trang đặt vé
            window.location.href = 'booking.html';
        });
    });

    // Thêm hiệu ứng fade-in cho các phần tử khi cuộn
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Quan sát các phần tử cần thêm hiệu ứng
    document.querySelectorAll('.movie-card, .schedule-card').forEach(el => {
        observer.observe(el);
    });

    // Xử lý menu người dùng trên mobile
    if (window.innerWidth <= 768) {
        userMenu.addEventListener('click', function (e) {
            e.stopPropagation();
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', function () {
            dropdownMenu.style.display = 'none';
        });
    }
});