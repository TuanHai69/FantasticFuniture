<template>
    <div class="update-type-form">
        <h2>Tạo loại sản phẩm mới</h2>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="type">Chọn loại sản phẩm:</label>
                <select v-model="producttype.typeid" id="type" class="form-control">
                    <option v-for="type in types" :key="type._id" :value="type._id">
                        {{ type.name }}
                    </option>
                </select>
                <span v-if="errors.typeid">{{ errors.typeid }}</span>
            </div>
            <div class="form-group">
                <label for="state">Trạng thái:</label>
                <select v-model="producttype.state" id="state" class="form-control">
                    <option value="hiển thị">Hiển thị</option>
                    <option value="ẩn">Ẩn</option>
                </select>
                <span v-if="errors.state">{{ errors.state }}</span>
            </div>
            <div class="container">
                <div class="row justify-content-evenly">
                    <div class="col-4">
                        <button type="submit" class="btn btn-primary">Thêm</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import ProductTypeService from "@/services/producttype.service";
import TypeService from "@/services/type.service";

export default {
    props: {
        productId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            producttype: {
                productid: this.productId,
                typeid: '',
                state: 'hiển thị'
            },
            types: [],
            errors: {}
        };
    },
    async mounted() {
        try {
            this.types = await TypeService.getAll();
        } catch (error) {
            console.error("Error fetching types:", error);
        }
    },
    methods: {
        validateForm() {
            this.errors = {};
            if (!this.producttype.typeid) this.errors.typeid = 'Loại sản phẩm là bắt buộc.';
            if (!this.producttype.state) this.errors.state = 'Trạng thái là bắt buộc.';
            return Object.keys(this.errors).length === 0;
        },
        async handleSubmit() {
            if (this.validateForm()) {
                try {
                    await ProductTypeService.create(this.producttype);
                    alert("Product type saved successfully!");
                } catch (error) {
                    console.error("Error saving product type:", error);
                }
            } else {
                console.error("Validation failed:", this.errors);
            }
        },
    }
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