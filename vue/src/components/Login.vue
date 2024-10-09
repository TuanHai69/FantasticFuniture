<template>
    <div class="container login-container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h3 class="card-title text-center">Đăng nhập</h3>
                        <form @submit.prevent="handleLogin">
                            <div class="form-group">
                                <label for="username">Username or email</label>
                                <input type="text" v-model="username" class="form-control" id="username" required>
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
import AccountsService from '@/services/accounts.service'; // Đường dẫn tới file 
import bcrypt from 'bcryptjs';
import LocalStorageHelper from '@/services/local.service';

export default {
    data() {
        return {
            username: '',
            password: ''
        };
    },
    methods: {
        async handleLogin() {
            try {
                const response = await AccountsService.login({
                    username: this.username,
                });

                if (response) {
                    const isMatch = bcrypt.compareSync(this.password, response.password);
                    if (isMatch) {
                        // Successful login
                        LocalStorageHelper.setItem('id', response._id);
                        LocalStorageHelper.setItem('role', response.role);

                        alert("Login successful! Press OK to continue.");
                        this.$router.push('/home'); // Redirect to the dashboard or desired page
                    } else {
                        alert("Incorrect password. Please try again.");
                    }
                } else {
                    alert("User not found. Please check your username.");
                }
            } catch (error) {
                console.error("Login error:", error);
                alert("An error occurred during login. Please try again later.");
            }
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