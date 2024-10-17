<template>
    <div class="update-branch-form">
        <h2>{{ branch._id ? 'Cập nhật thông tin chuỗi cửa hàng' : 'Tạo chuỗi cửa hàng mới' }}</h2>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="name">Tên chuỗi cửa hàng:</label>
                <input type="text" id="name" v-model="branch.name" class="form-control" />
                <span v-if="errors.name">{{ errors.name }}</span>
            </div>
            <div class="form-group">
                <label for="birthday">Ngày thành lập:</label>
                <input type="date" id="birthday" v-model="branch.birthday" class="form-control" />
                <span v-if="errors.birthday">{{ errors.birthday }}</span>
            </div>
            <div class="form-group">
                <label for="address">Địa chỉ:</label>
                <input type="text" id="address" v-model="branch.address" class="form-control" />
                <span v-if="errors.address">{{ errors.address }}</span>
            </div>
            <div class="form-group">
                <label for="phonenumber">Số điện thoại:</label>
                <input type="text" id="phonenumber" v-model="branch.phonenumber" class="form-control" />
                <span v-if="errors.phonenumber">{{ errors.phonenumber }}</span>
            </div>
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="branch.email" class="form-control" />
                <span v-if="errors.email">{{ errors.email }}</span>
            </div>
            <div class="form-group">
                <label for="description">Mô tả:</label>
                <textarea id="description" v-model="branch.description" class="form-control"></textarea>
                <span v-if="errors.description">{{ errors.description }}</span>
            </div>
            <div class="form-group">
                <label for="userid">User ID:</label>
                <input type="text" id="userid" v-model="branch.userid" class="form-control" readonly />
                <span v-if="errors.userid">{{ errors.userid }}</span>
            </div>
            <div class="form-group">
                <label for="storecount">Số lượng cửa hàng:</label>
                <input type="number" id="storecount" v-model="branch.storecount" class="form-control"
                    :disabled="!branch._id" />
                <span v-if="errors.storecount">{{ errors.storecount }}</span>
            </div>
            <div class=" container">
                <div class="row justify-content-evenly">
                    <div class=" col-4">
                        <button type="submit" class="btn btn-primary">{{ branch._id ? 'Cập nhật' : 'Tạo mới' }}</button>
                    </div>
                    <div class=" col-4">
                        <button type="button" class="btn btn-secondary bg-danger" @click="handleCancel">Hủy</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import LocalStorageHelper from '@/services/local.service';

export default {
    props: {
        branch: Object,
    },
    data() {
        return {
            errors: {},
        };
    },
    mounted() {
        this.branch.userid = LocalStorageHelper.getItem("id");
    },
    methods: {
        validateForm() {
            this.errors = {};
            if (!this.branch.name) this.errors.name = 'Tên chi nhánh là bắt buộc.';
            if (!this.branch.birthday) this.errors.birthday = 'Ngày sinh là bắt buộc.';
            if (!this.branch.address) this.errors.address = 'Địa chỉ là bắt buộc.';
            if (!this.branch.phonenumber) this.errors.phonenumber = 'Số điện thoại là bắt buộc.';
            if (!this.branch.email) this.errors.email = 'Email là bắt buộc.';
            if (!this.branch.description) this.errors.description = 'Mô tả là bắt buộc.';
            if (!this.branch.userid) this.errors.userid = 'User ID là bắt buộc.';
            if (!this.branch.storecount || this.branch.storecount < 1) this.errors.storecount = 'Số lượng cửa hàng phải lớn hơn hoặc bằng 1.';
            return Object.keys(this.errors).length === 0;
        },
        async handleSubmit() {
            if (this.validateForm()) {
                try {
                    if (this.branch._id) {
                        await this.$emit('update-branch', this.branch);
                    } else {
                        this.branch.state = "unaccept";
                        await this.$emit('create-branch', this.branch);
                    }
                } catch (error) {
                    console.error('Error updating branch:', error);
                    alert('Có lỗi xảy ra khi cập nhật thông tin.');
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
.update-branch-form {
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