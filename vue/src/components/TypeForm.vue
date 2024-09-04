<template>
    <div class="update-type-form">
        <h2>{{ type._id ? 'Cập nhật thông tin loại' : 'Tạo loại mới' }}</h2>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="name">Tên loại:</label>
                <input type="text" id="name" v-model="type.name" class="form-control" />
                <span v-if="errors.name">{{ errors.name }}</span>
            </div>
            <div class="form-group">
                <label for="description">Mô tả:</label>
                <textarea id="description" v-model="type.description" class="form-control"></textarea>
                <span v-if="errors.description">{{ errors.description }}</span>
            </div>
            <div class="form-group">
                <label for="userid">User ID:</label>
                <input type="text" id="userid" v-model="type.userid" class="form-control" readonly />
                <span v-if="errors.userid">{{ errors.userid }}</span>
            </div>
            <div class="form-group">
                <label for="state">Trạng thái:</label>
                <select id="state" v-model="type.state" class="form-control">
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Ẩn">Ẩn</option>
                </select>
                <span v-if="errors.state">{{ errors.state }}</span>
            </div>
            <div class="container">
                <div class="row justify-content-evenly">
                    <div class="col-4">
                        <button type="submit" class="btn btn-primary">{{ type._id ? 'Cập nhật' : 'Tạo mới' }}</button>
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
import LocalStorageHelper from '@/services/local.service';

export default {
    props: {
        type: Object,
    },
    data() {
        return {
            errors: {},
        };
    },
    mounted() {
        this.type.userid = LocalStorageHelper.getItem("id");
    },
    methods: {
        validateForm() {
            this.errors = {};
            if (!this.type.name) this.errors.name = 'Tên loại là bắt buộc.';
            if (!this.type.description) this.errors.description = 'Mô tả là bắt buộc.';
            if (!this.type.userid) this.errors.userid = 'User ID là bắt buộc.';
            if (!this.type.state) this.errors.state = 'Trạng thái là bắt buộc.';
            return Object.keys(this.errors).length === 0;
        },
        async handleSubmit() {
            if (this.validateForm()) {
                try {
                    if (this.type._id) {
                        await this.$emit('update-type', this.type);
                    } else {
                        await this.$emit('create-type', this.type);
                    }
                } catch (error) {
                    console.error('Error updating type:', error);
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
.update-type-form {
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
