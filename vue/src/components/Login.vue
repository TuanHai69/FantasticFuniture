<template>
    <div class="container login-container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h3 class="card-title text-center">Đăng nhập</h3>
                        <form @submit.prevent="handleLogin">
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" v-model="email" class="form-control" id="email" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Mật khẩu</label>
                                <input type="password" v-model="password" class="form-control" id="password" required>
                            </div>
                            <div class="d-flex justify-content-center m-3">
                                <button type="submit" class="btn btn-primary btn-block">Đăng nhập</button>
                            </div>
                        </form>
                        <div class="text-center mt-3">
                            <a href="#">Quên mật khẩu?</a>
                        </div>
                        <div class="text-center mt-3">
                            <a href="#">Đăng ký tài khoản mới</a>
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
            email: '',
            password: ''
        };
    },
    methods: {
        handleLogin() {
            // Xử lý đăng nhập ở đây
            console.log('Email:', this.email);
            console.log('Password:', this.password);
        }
    }
};
</script>

<style scoped>
.login-container {
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