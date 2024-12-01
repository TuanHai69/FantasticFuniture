<template>
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>Về chúng tôi</h4>
                    <p>Tôi là Trần Tuấn Hải MSSV B2014566 Người làm ra Website này</p>
                </div>
                <div class="footer-section">
                    <h4>Liên hệ tôi</h4>
                    <p>Email: haib2014566@student.ctu.edu.vn</p>
                    <p>Phone: xxxxxxxxxxx</p>
                </div>
                <div class="footer-section">
                    <h4>Follow Us</h4>
                    <div class="social-icons">
                        <a href="#"><i class="fab fa-facebook-f"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
            </div>
            <hr />
            <div class="footer-bottom">
                <p>© 2024 F-f. Đã đăng ký Bản quyền.</p>
                <nav>
                    <a href="#">Chính sách bảo mật</a>
                    |
                    <a href="#">Điều khoản dịch vụ</a>
                </nav>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer',
};
</script>

<style scoped>
.footer {
    background-color: #333;
    color: #fff;
    padding: 20px 0;
    text-align: center;
    position: relative;
    width: 100%;
    bottom: 0;
    left: 0;
}

.footer .container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    width: 80%;
    /* Giảm độ rộng từ 90% xuống 80% */
    margin-bottom: 20px;
}

.footer-section {
    flex: 1;
    margin: 0 10px;
    /* Giảm margin */
}

.footer-section h4 {
    margin-bottom: 10px;
}

.footer-section p {
    margin: 5px 0;
}

.social-icons {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.social-icons a {
    color: #fff;
    font-size: 1.5rem;
    transition: color 0.3s;
}

.social-icons a:hover {
    color: #ff9800;
}

.footer-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80%;
    /* Giảm độ rộng từ 90% xuống 80% */
    max-width: 80%;
    /* Giảm độ rộng tối đa từ 95% xuống 80% */
}

.footer-bottom p {
    margin: 10px 0;
}

.footer-bottom nav {
    margin-top: 10px;
}

.footer-bottom nav a {
    color: #007bff;
    text-decoration: none;
    margin: 0 5px;
    transition: color 0.3s;
}

.footer-bottom nav a:hover {
    color: #ff9800;
}
</style>
