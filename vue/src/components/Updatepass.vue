<template>
    <div class="update-pass-form">
        <h2>Cập nhật mật khẩu</h2>
        <form @submit.prevent="handleUpdatePassword">
            <div class="form-group">
                <label for="currentPassword">Mật khẩu hiện tại:</label>
                <input type="password" v-model="currentPassword" class="form-control" id="currentPassword" required>
                <span v-if="errors.currentPassword">{{ errors.currentPassword }}</span>
            </div>
            <div class="form-group">
                <label for="newPassword">Mật khẩu mới:</label>
                <input type="password" v-model="newPassword" class="form-control" id="newPassword" required>
                <span v-if="errors.newPassword">{{ errors.newPassword }}</span>
            </div>
            <div class="form-group">
                <label for="confirmNewPassword">Xác nhận mật khẩu mới:</label>
                <input type="password" v-model="confirmNewPassword" class="form-control" id="confirmNewPassword"
                    required>
                <span v-if="errors.confirmNewPassword">{{ errors.confirmNewPassword }}</span>
            </div>
            <div class="container">
                <div class="row justify-content-evenly">
                    <div class="col-4">
                        <button type="submit" class="btn btn-primary">Cập nhật</button>
                    </div>
                    <div class="col-4">
                        <button type="button" class="btn btn-secondary bg-danger" @click="handleCancel">Hủy</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import bcrypt from 'bcryptjs';
import AccountsService from '@/services/accounts.service'; // Đường dẫn tới file

export default {
    props: {
        account: Object,
    },
    data() {
        return {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            errors: {},
        };
    },
    methods: {
        validateForm() {
            this.errors = {};
            if (!bcrypt.compareSync(this.currentPassword, this.account.password)) {
                this.errors.currentPassword = 'Mật khẩu hiện tại không đúng.';
            }
            if (this.newPassword !== this.confirmNewPassword) {
                this.errors.confirmNewPassword = 'Mật khẩu mới và xác nhận mật khẩu mới không trùng khớp.';
            }
            return Object.keys(this.errors).length === 0;
        },
        async handleUpdatePassword() {
            if (this.validateForm()) {
                try {
                    // Hash mật khẩu mới
                    const saltRounds = 10;
                    const hashedPassword = bcrypt.hashSync(this.newPassword, saltRounds);

                    // Cập nhật mật khẩu
                    const updatedAccount = {
                        ...this.account,
                        password: hashedPassword,
                    };

                    await AccountsService.update(this.account._id, updatedAccount);
                    alert('Cập nhật mật khẩu thành công!');
                    this.$emit('update-account', updatedAccount);
                } catch (error) {
                    console.error('Error updating password:', error);
                    alert('Có lỗi xảy ra khi cập nhật mật khẩu.');
                }
            }
        },
        handleCancel() {
            this.$emit('cancel');
        },
    },
};
</script>
<style scoped>
.update-pass-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 15px;
}

.form-control {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.btn {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.btn:hover {
    background-color: #0056b3;
}
</style>
