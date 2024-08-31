<template>
    <div class="update-account-form">
        <h2>Cập nhật thông tin tài khoản</h2>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="username">Tên người dùng:</label>
                <input type="text" id="username" v-model="account.username" class="form-control" />
                <span v-if="errors.username">{{ errors.username }}</span>
            </div>
            <div class="form-group">
                <label for="name">Họ tên:</label>
                <input type="text" id="name" v-model="account.name" class="form-control" />
                <span v-if="errors.name">{{ errors.name }}</span>
            </div>
            <div class="form-group">
                <label for="birthday">Ngày sinh:</label>
                <input type="date" id="birthday" v-model="account.birthday" class="form-control" />
                <span v-if="errors.birthday">{{ errors.birthday }}</span>
            </div>
            <div class="form-group">
                <label for="gender">Giới tính:</label>
                <select id="gender" v-model="account.gender" class="form-control">
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                </select>
                <span v-if="errors.gender">{{ errors.gender }}</span>
            </div>
            <div class="form-group">
                <label for="address">Địa chỉ:</label>
                <input type="text" id="address" v-model="account.address" class="form-control" />
                <span v-if="errors.address">{{ errors.address }}</span>
            </div>
            <div class="form-group">
                <label for="phonenumber">Số điện thoại:</label>
                <input type="text" id="phonenumber" v-model="account.phonenumber" class="form-control" />
                <span v-if="errors.phonenumber">{{ errors.phonenumber }}</span>
            </div>
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="account.email" class="form-control" />
                <span v-if="errors.email">{{ errors.email }}</span>
            </div>
            <div class="form-group">
                <label for="role">Vai trò:</label>
                <input type="text" id="role" v-model="account.role" class="form-control" />
                <span v-if="errors.role">{{ errors.role }}</span>
            </div>
            <div class="form-group">
                <label for="picture">Ảnh đại diện:</label>
                <input type="file" id="picture" @change="handleFileChange" class="form-control" />
            </div>
            <div class=" container">
                <div class="row justify-content-evenly">
                    <div class=" col-4">
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
export default {
    props: {
        account: Object,
    },
    data() {
        return {
            selectedFile: null,
            errors: {},
        };
    },
    methods: {
        handleFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.convertToBase64String(file).then(base64String => {
                    this.account.picture = base64String;
                });
            }
        },
        convertToBase64String(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    resolve(e.target.result.split(',')[1]);
                };
                reader.onerror = (error) => {
                    reject(error);
                };
                reader.readAsDataURL(file);
            });
        },
        validateForm() {
            this.errors = {};
            if (!this.account.username) this.errors.username = 'Tên người dùng là bắt buộc.';
            if (!this.account.name) this.errors.name = 'Họ tên là bắt buộc.';
            if (!this.account.birthday) this.errors.birthday = 'Ngày sinh là bắt buộc.';
            if (!this.account.gender) this.errors.gender = 'Giới tính là bắt buộc.';
            if (!this.account.address) this.errors.address = 'Địa chỉ là bắt buộc.';
            if (!this.account.phonenumber) this.errors.phonenumber = 'Số điện thoại là bắt buộc.';
            if (!this.account.email) this.errors.email = 'Email là bắt buộc.';
            if (!this.account.role) this.errors.role = 'Vai trò là bắt buộc.';
            return Object.keys(this.errors).length === 0;
        },
        async handleSubmit() {
            if (this.validateForm()) {
                try {
                    // Gọi API để cập nhật thông tin tài khoản
                    await this.$emit('update-account', this.account);
                    alert('Cập nhật thông tin thành công!');
                } catch (error) {
                    console.error('Error updating account:', error);
                    if (error.response && error.response.data) {
                        alert(`Có lỗi xảy ra: ${error.response.data.message}`);
                    } else {
                        alert('Có lỗi xảy ra khi cập nhật thông tin.');
                    }
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
.update-account-form {
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
