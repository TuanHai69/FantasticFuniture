<template>
    <div class="update-store-form">
        <h2>{{ storeId ? 'Cập nhật cửa hàng' : 'Tạo mới cửa hàng' }}</h2>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="name">Tên cửa hàng:</label>
                <input type="text" id="name" v-model="store.name" class="form-control" />
                <span v-if="errors.name">{{ errors.name }}</span>
            </div>
            <div class="form-group">
                <label for="birthday">Ngày thành lập:</label>
                <input type="date" id="birthday" v-model="store.birthday" class="form-control" />
                <span v-if="errors.birthday">{{ errors.birthday }}</span>
            </div>
            <div class="form-group">
                <label for="picture">Ảnh cửa hàng:</label>
                <input type="file" id="picture" @change="handleFileChange" class="form-control" />
            </div>
            <div class="form-group">
                <label for="address">Địa chỉ:</label>
                <input type="text" id="address" v-model="store.address" class="form-control" />
                <span v-if="errors.address">{{ errors.address }}</span>
            </div>
            <div class="form-group">
                <label for="phonenumber">Số điện thoại:</label>
                <input type="text" id="phonenumber" v-model="store.phonenumber" class="form-control" />
                <span v-if="errors.phonenumber">{{ errors.phonenumber }}</span>
            </div>
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="store.email" class="form-control" />
                <span v-if="errors.email">{{ errors.email }}</span>
            </div>
            <div class="form-group">
                <label for="description">Mô tả:</label>
                <textarea id="description" v-model="store.description" class="form-control"></textarea>
                <span v-if="errors.description">{{ errors.description }}</span>
            </div>
            <div class="form-group">
                <label for="opentime">Giờ mở cửa:</label>
                <input type="text" id="opentime" v-model="store.opentime" class="form-control" />
                <span v-if="errors.opentime">{{ errors.opentime }}</span>
            </div>
            <div class="form-group">
                <label for="userid">ID người dùng:</label>
                <input type="text" id="userid" v-model="store.userid" class="form-control" readonly />
                <span v-if="errors.userid">{{ errors.userid }}</span>
            </div>
            <div class="form-group">
                <label for="branchid">ID chi nhánh:</label>
                <input type="text" id="branchid" v-model="store.branchid" class="form-control" readonly />
                <span v-if="errors.branchid">{{ errors.branchid }}</span>
            </div>
            <div class="form-group">
                <label for="state">Trạng thái:</label>
                <input type="text" id="state" v-model="store.state" class="form-control" readonly />
                <span v-if="errors.state">{{ errors.state }}</span>
            </div>
            <div class="container">
                <div class="row justify-content-evenly">
                    <div class="col-4">
                        <button type="submit" class="btn btn-secondary">{{ storeId ? 'Cập nhật' : 'Tạo mới' }}</button>
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
import StoreService from '@/services/store.service';
export default {
    props: {
        branch: Object, // Nhận thông tin chi nhánh từ parent component
        storeId: {
            type: String,
            default: null,
        },
    },
    data() {
        return {
            store: {
                name: '',
                birthday: '',
                picture: null,
                address: '',
                phonenumber: '',
                email: '',
                description: '',
                opentime: '',
                userid: '',
                branchid: '',
                state: ''
            },
            errors: {}
        };
    },
    async mounted() {
        try {
            if (this.storeId) {
                await this.fetchStore();
            } else {
                this.store.userid = LocalStorageHelper.getItem('id');
                this.store.branchid = this.branch._id;
                this.store.state = 1;
            }
        } catch (error) {
            console.error("Error fetching account data:", error);
        }
    },
    methods: {
        async fetchStore() {
            try {
                const response = await StoreService.get(this.storeId);
                this.store = response;
            } catch (error) {
                console.error('Error fetching store:', error);
                alert('Có lỗi xảy ra khi lấy thông tin cửa hàng.');
            }
        },
        handleFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                if (this.validateFile(file)) {
                    this.convertToBase64String(file).then(base64String => {
                        this.store.picture = base64String;
                    });
                }
            }
        },
        validateFile(file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (!validTypes.includes(file.type)) {
                alert('Chỉ chấp nhận các định dạng ảnh JPEG, PNG, GIF.');
                return false;
            }
            if (file.size > maxSize) {
                alert('Kích thước ảnh không được vượt quá 2MB.');
                return false;
            }
            return true;
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
            if (!this.store.name) this.errors.name = 'Tên cửa hàng là bắt buộc.';
            if (!this.store.birthday) this.errors.birthday = 'Ngày thành lập là bắt buộc.';
            if (!this.store.address) this.errors.address = 'Địa chỉ là bắt buộc.';
            if (!this.store.phonenumber) this.errors.phonenumber = 'Số điện thoại là bắt buộc.';
            if (!this.store.email) this.errors.email = 'Email là bắt buộc.';
            if (!this.store.description) this.errors.description = 'Mô tả là bắt buộc.';
            if (!this.store.opentime) this.errors.opentime = 'Giờ mở cửa là bắt buộc.';
            if (!this.store.userid) this.errors.userid = 'ID người dùng là bắt buộc.';
            if (!this.store.branchid) this.errors.branchid = 'ID chi nhánh là bắt buộc.';
            if (!this.store.state) this.errors.state = 'Trạng thái là bắt buộc.';
            return Object.keys(this.errors).length === 0;
        },
        async handleSubmit() {
            if (this.validateForm()) {
                try {
                    if (this.storeId) {
                        // Gọi API để cập nhật thông tin cửa hàng
                        await StoreService.update(this.storeId, this.store);
                        alert('Cập nhật cửa hàng thành công!');
                        this.$emit('cancel');
                    } else {
                        // Gọi API để cập nhật thông tin cửa hàng
                        await this.$emit('create-store', this.store);
                        this.resetForm();
                    }

                } catch (error) {
                    console.error('Error updating store:', error);
                    if (error.response && error.response.data) {
                        alert(`Có lỗi xảy ra: ${error.response.data.message}`);
                    } else {
                        alert('Có lỗi xảy ra khi cập nhật thông tin.');
                    }
                }
            }
        },
        handleCancel() {
            this.resetForm();
            this.$emit('cancel');
        },
        resetForm() {
            this.store = {
                name: '',
                birthday: '',
                picture: null,
                address: '',
                phonenumber: '',
                email: '',
                description: '',
                opentime: '',
                userid: '',
                branchid: '',
                state: ''
            };
            this.errors = {};
        }
    },
};
</script>

<style scoped>
.update-store-form {
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

/* Responsive Design */
@media (max-width: 600px) {
    .update-store-form {
        padding: 10px;
    }

    .btn {
        width: 100%;
        margin-bottom: 10px;
    }
}
</style>
