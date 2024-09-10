<template>
    <div class="container shop-head-card bg-white">
        <div class="row justify-content-evenly">
            <div class="col-5 image-container m-4">
                <img :src="productPicture(product.picture)" alt="Large Image"
                    class="img-fluid large-image limited-height" />
            </div>
            <div class="col-6 text-container m-4">
                <h3>Tên sản phẩm {{ product.name }}
                </h3>
                <p>Giá: {{ product.cost }}</p>
                <p>Vật liệu: {{ product.material }}</p>
                <p class="address">Kích thước: {{ product.size }}</p>
                <p class="review">
                    Đánh giá:
                    <span class="negative">Tiêu cực 2222</span> /
                    <span class="positive">Bình thường 2222</span> /
                    <span class="recommend">Tích cực 2222</span>
                </p>
                <p class="open">Danh mục
                    <span v-for="type in types" :key="type.id" class="type-button-container">
                        <button class="btn type-button">
                            {{ type.name }}
                            <span class="delete-button" @click.stop="deleteProductType(type.producttypeid)">x</span>
                        </button>
                    </span>
                    <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal"
                        data-bs-target="#productTypeModal">+</button>
                </p>
                <p class="phone">Số lượng: {{ product.count }}</p>
                <nav>
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab"
                            data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home"
                            aria-selected="true">Mô tả</button>
                        <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile"
                            type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Đánh giá</button>
                        <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact"
                            type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Bảo hành</button>
                        <button class="nav-link" id="nav-move-tab" data-bs-toggle="tab" data-bs-target="#nav-move"
                            type="button" role="tab" aria-controls="nav-move" aria-selected="false">Vận chuyển</button>
                    </div>
                </nav>
                <div class="tab-content" id="nav-tabContent">
                    <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                        {{ product.description }}</div>
                    <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">...
                    </div>
                    <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">{{
                        product.warranty }}</div>
                    <div class="tab-pane fade" id="nav-move" role="tabpanel" aria-labelledby="nav-move-tab">{{
                        product.delivery }}</div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="productTypeModal" tabindex="-1" aria-labelledby="productTypeModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="productTypeModalLabel">Tạo loại sản phẩm mới</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <ProductTypeForm :productId="id" @update="fetchProductTypes"/>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ProductService from "@/services/product.service";
import ProductTypeForm from "@/components/ProductTypeForm.vue";
import ProductTypeService from "@/services/producttype.service";
import TypeService from "@/services/type.service";

export default {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    components: {
        ProductTypeForm
    },
    data() {
        return {
            showForm: false,
            product: {
                name: '',
                cost: '',
                picture: '',
                material: '',
                size: '',
                description: '',
                warranty: '',
                delivery: '',
                discount: '',
                count: '',
                storeid: '',
                state: '',
            },
            error: {},
            types: []
        };
    },
    methods: {
        productPicture(picture) {
            if (picture) {
                return `data:image/jpeg;base64,${picture}`;
            }
            return 'https://donggia.vn/wp-content/uploads/2019/11/thiet-ke-noi-that-phong-khach-chung-cu-dep-2020-12.jpg';
        },
        async fetchProductTypes() {
            try {
                const productTypes = await ProductTypeService.findByProduct(this.id);
                // console.log(productTypes);

                // Lấy chi tiết từng loại sản phẩm
                const typePromises = productTypes.map(pt => TypeService.get(pt.typeid));
                const types = await Promise.all(typePromises);
                // console.log(types);

                // Kết hợp producttypeid từ productTypes vào types
                this.types = types.map((type, index) => ({
                    ...type,
                    producttypeid: productTypes[index]._id
                }));
                // console.log(this.types);
            } catch (error) {
                console.error("Error fetching product types:", error);
            }
        },
        async deleteProductType(id) {
            // console.log(id);
            try {
                await ProductTypeService.delete(id);
                this.types = this.types.filter(type => type.id !== id);
                await this.fetchProductTypes();
                alert("Product type remove successfully!");

            } catch (error) {
                console.error("Error deleting product type:", error);
            }
        },
    },
    async mounted() {
        try {
            const response = await ProductService.get(this.id);
            this.product = response;
            await this.fetchProductTypes();
        } catch (error) {
            console.error('Error fetching product:', error);
            this.error = error;
        }
    },


};
</script>

<style scoped>
.image-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.limited-height {
    max-height: 450px;
    object-fit: contain;
}

.text-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* Thêm các style tùy chỉnh ở đây */
.tab-pane {
    min-height: 7.5rem;
    /* Chiều cao cố định, mỗi dòng text khoảng 1.5rem */
    max-height: 7.5rem;
    overflow-y: auto;
    /* Thêm thanh cuộn nếu nội dung dài hơn */
    padding: 1rem;
    /* Thêm khoảng cách bên trong */
    border: 1px solid #ddd;
    /* Thêm viền để dễ nhìn */
    border-radius: 5px;
    /* Bo góc */
    background-color: #f9f9f9;
    /* Màu nền nhẹ */
}

.type-button-container {
    position: relative;
    display: inline-block;
    margin-right: 10px;
}

.type-button {
    background-color: #28a745;
    border-radius: 8px;
    color: white;
    border: none;
    position: relative;
    padding-right: 30px;
    /* Để chừa chỗ cho nút xóa */
}

.type-button:hover {
    background-color: #218838;
}

.delete-button {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1;
    /* Đảm bảo nút xóa nằm trên cùng */
}

.delete-button:hover {
    background-color: darkred;
}
</style>
