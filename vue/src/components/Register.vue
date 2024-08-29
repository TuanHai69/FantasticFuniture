<template>
    <div class="container register-container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h3 class="card-title text-center">Đăng ký tài khoản</h3>
                        <form @submit.prevent="handleRegister">
                            <div class="form-group">
                                <label for="username">Tên đăng nhập</label>
                                <input type="text" v-model="username" class="form-control" id="username" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" v-model="email" class="form-control" id="email" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Mật khẩu</label>
                                <input type="password" v-model="password" class="form-control" id="password" required>
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">Xác nhận mật khẩu</label>
                                <input type="password" v-model="confirmPassword" class="form-control"
                                    id="confirmPassword" required>
                            </div>
                            <div class="d-flex justify-content-center m-3">
                                <button type="submit" class="btn btn-primary btn-block">Đăng ký</button>
                            </div>
                        </form>
                        <div class="text-center mt-3">
                            <a href="#">Đã có tài khoản? Đăng nhập</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AccountsService from '@/services/accounts.service'; // Đường dẫn tới file 
import bcrypt from 'bcryptjs';
export default {
    data() {
        return {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        };
    },
    methods: {
        async handleRegister() {
            if (this.password !== this.confirmPassword) {
                // Xử lý thông báo lỗi khi mật khẩu không khớp
                return;
            }

            try {
                // Hash mật khẩu
                const saltRounds = 10;
                const hashedPassword = bcrypt.hashSync(this.password, saltRounds);

                // Tạo tài khoản
                const newAccount = {
                    username: this.username,
                    email: this.email,
                    password: hashedPassword,
                    role: "client",
                };

                // Gọi phương thức tạo tài khoản từ AccountsService
                const createdAccount = await AccountsService.create(newAccount);

                // Xử lý thành công (chuyển hướng, hiển thị thông báo, v.v.)
                console.log('Tạo tài khoản thành công:', createdAccount);
                // Sau khi đăng ký thành công
                alert('Đăng ký thành công! Nhấn OK để tiếp tục.');
                // Hoặc sử dụng Vue Router để chuyển hướng
                this.$router.push('/login');

            } catch (error) {
                // Xử lý lỗi (hiển thị thông báo lỗi, ghi log, v.v.)
                console.error('Lỗi khi tạo tài khoản:', error);
            }
        },

    }
};
</script>

<style scoped>
.register-container {
    margin-top: 50px;
}

.card {
    padding: 20px;
}

.btn-primary {
    background-color: #ff5722;
    border-color: #ff5722;
}
</style>