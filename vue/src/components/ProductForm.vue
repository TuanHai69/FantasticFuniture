<template>
    <div class="update-store-form">
        <h2>{{ product._id ? 'Cập nhật thông tin sản phẩm' : 'Tạo sản phẩm mới' }}</h2>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="name">Tên sản phẩm:</label>
                <input type="text" id="name" v-model="product.name" class="form-control" />
                <span v-if="errors.name">{{ errors.name }}</span>
            </div>
            <div class="form-group">
                <label for="cost">Giá:</label>
                <input type="number" id="cost" v-model="product.cost" class="form-control" />
                <span v-if="errors.cost">{{ errors.cost }}</span>
            </div>
            <div class="form-group">
                <label for="picture">Ảnh đại diện:</label>
                <input type="file" id="picture" @change="handleFileChange" class="form-control" />
                <span v-if="errors.picture">{{ errors.picture }}</span>
            </div>
            <div class="form-group">
                <label for="material">Chất liệu:</label>
                <input type="text" id="material" v-model="product.material" class="form-control" />
                <span v-if="errors.material">{{ errors.material }}</span>
            </div>
            <div class="form-group">
                <label for="size">Kích thước:</label>
                <input type="text" id="size" v-model="product.size" class="form-control" />
                <span v-if="errors.size">{{ errors.size }}</span>
            </div>
            <div class="form-group">
                <label for="description">Mô tả:</label>
                <textarea id="description" v-model="product.description" class="form-control"></textarea>
                <span v-if="errors.description">{{ errors.description }}</span>
            </div>
            <div class="form-group">
                <label for="warranty">Bảo hành:</label>
                <input type="text" id="warranty" v-model="product.warranty" class="form-control" />
                <span v-if="errors.warranty">{{ errors.warranty }}</span>
            </div>
            <div class="form-group">
                <label for="delivery">Giao hàng:</label>
                <input type="text" id="delivery" v-model="product.delivery" class="form-control" />
                <span v-if="errors.delivery">{{ errors.delivery }}</span>
            </div>
            <div class="form-group">
                <label for="discount">Giảm giá:</label>
                <input type="number" id="discount" v-model="product.discount" class="form-control" />
                <span v-if="errors.discount">{{ errors.discount }}</span>
            </div>
            <div class="form-group">
                <label for="storeid">Store ID:</label>
                <input type="text" id="storeid" v-model="this.product.storeid" class="form-control" readonly />
                <span v-if="errors.storeid">{{ errors.storeid }}</span>
            </div>
            <div class="form-group">
                <label for="state">Trạng thái:</label>
                <select id="state" v-model="product.state" class="form-control">
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Ẩn đi">Ẩn đi</option>
                </select>
                <span v-if="errors.state">{{ errors.state }}</span>
            </div>
            <div class="container">
                <div class="row justify-content-evenly">
                    <div class="col-4">
                        <button type="submit" class="btn btn-primary">{{ product._id ? 'Cập nhật' : 'Tạo mới'
                            }}</button>
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
        product: {
            type: Object,
            default: () => ({
                name: '',
                cost: '',
                picture: '',
                material: '',
                size: '',
                description: '',
                warranty: '',
                delivery: '',
                discount: '',
                storeid: '',
                state: 'Hoạt động',
            }),
        },
        storeid: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            errors: {},
            isLoading: false,
        };
    },
    mounted() {
        
        this.product.storeid = this.storeid;
    },
    methods: {
        validateForm() {
            this.errors = {};
            if (!this.product.name) this.errors.name = 'Tên sản phẩm là bắt buộc.';
            if (!this.product.cost) this.errors.cost = 'Giá là bắt buộc.';
            if (!this.product.picture) this.errors.picture = 'Hình ảnh là bắt buộc.';
            if (!this.product.material) this.errors.material = 'Chất liệu là bắt buộc.';
            if (!this.product.size) this.errors.size = 'Kích thước là bắt buộc.';
            if (!this.product.description) this.errors.description = 'Mô tả là bắt buộc.';
            if (!this.product.warranty) this.errors.warranty = 'Bảo hành là bắt buộc.';
            if (!this.product.delivery) this.errors.delivery = 'Giao hàng là bắt buộc.';
            if (!this.product.discount) this.errors.discount = 'Giảm giá là bắt buộc.';
            if (!this.product.storeid) this.errors.storeid = 'Store ID là bắt buộc.';
            if (!this.product.state) this.errors.state = 'Trạng thái là bắt buộc.';
            return Object.keys(this.errors).length === 0;
        },
        async handleSubmit() {
            if (this.validateForm()) {
                this.isLoading = true;
                try {
                    if (this.product._id) {
                        await this.$emit('update-product', this.product);
                    } else {
                        // console.log(this.product);
                        await this.$emit('create-product', this.product);
                    }
                } catch (error) {
                    console.error('Error updating product:', error);
                    alert('Có lỗi xảy ra khi cập nhật thông tin.');
                } finally {
                    this.isLoading = false;
                }
            }
        },
        handleCancel() {
            this.$emit('cancel');
        },
        handleFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.convertToBase64String(file).then(base64String => {
                    this.product.picture = base64String;
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
        resetForm() {
            this.product = {
                name: '',
                cost: '',
                picture: '',
                material: '',
                size: '',
                description: '',
                warranty: '',
                delivery: '',
                discount: '',
                storeid: this.storeid,
                state: 'Hoạt động',
            };
        },
    },
};
</script>

<style scoped>
.update-store-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    font-weight: bold;
}

.form-group input,
.form-group textarea,
.form-group select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.form-group span {
    color: red;
    font-size: 0.9em;
}

.btn {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border-radius: 4px;
}

.btn-primary {
    background-color: #007bff;
    border-color: #007bff;
}

.btn-secondary {
    background-color: #6c757d;
    border-color: #6c757d;
}

.btn-secondary.bg-danger {
    background-color: #dc3545;
    border-color: #dc3545;
}

.container {
    margin-top: 20px;
}

.row {
    display: flex;
    justify-content: space-between;
}

.col-4 {
    flex: 0 0 30%;
    max-width: 30%;
}
</style>