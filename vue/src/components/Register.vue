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
        handleRegister() {
            // Xử lý đăng ký ở đây
            console.log('Username:', this.username);
            console.log('Email:', this.email);
            console.log('Password:', this.password);
            console.log('Confirm Password:', this.confirmPassword);
        }
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