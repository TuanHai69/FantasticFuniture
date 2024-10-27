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

                <p>Vật liệu: {{ product.material }}</p>
                <p class="address">Kích thước: {{ product.size }}</p>
                <p class="review"
                    v-if="positiveReviews != 'Chưa có đánh giá Tích cực' && negativeReviews != 'Chưa có đánh giá Tiêu cực' && neutralReviews != 'Chưa có đánh giá Bình thường'">
                    Đánh giá:
                <div>
                    <span class="recommend">{{ positiveReviews }}</span>
                    <span v-if="neutralReviews != 'Chưa có đánh giá Bình thường'" class="positive">/ {{ neutralReviews
                        }} /</span>
                </div>
                <div>
                    <span class="negative">{{ negativeReviews }}</span>
                </div>
                </p>
                <p class="review" v-else> Đánh giá:
                    Chưa có đánh giá nào
                </p>
                <p class="open">Danh mục
                    <span v-for="type in types" :key="type.id" class="type-button-container">
                        <button class="btn type-button" @click="navigateToProduct(type)">
                            {{ type.name }}
                            <span v-if="isStoreOwner" class="delete-button"
                                @click.stop="deleteProductType(type.producttypeid)">x</span>
                        </button>
                    </span>
                    <button v-if="isStoreOwner" type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal"
                        data-bs-target="#productTypeModal">+</button>
                </p>
                <p class="phone">Số lượng: {{ product.count }} || Giá: <span v-if="product.discount">
                        <s>{{ formatCurrency(product.cost) }}</s> -> {{ formatCurrency(product.cost - product.cost *
                            product.discount / 100) }}
                    </span>
                    <span v-else>
                        {{ formatCurrency(product.cost) }}
                    </span>
                </p>
                <p class="quantity-container">
                <div>
                    <label for="quantity">Số lượng: </label>
                    <input type="number" id="quantity" v-model.number="quantity" min="1" :max="product.count" />
                </div>
                <button class="btn btn-primary" @click="addToCart(product)">Thêm vào giỏ</button>
                </p>
                <nav>
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab"
                            data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home"
                            aria-selected="true">Mô tả</button>
                        <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact"
                            type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Bảo hành</button>
                        <button class="nav-link" id="nav-move-tab" data-bs-toggle="tab" data-bs-target="#nav-move"
                            type="button" role="tab" aria-controls="nav-move" aria-selected="false">Vận chuyển</button>
                        <button v-if="isStoreOwner" class="nav-link" id="nav-manager-tab" data-bs-toggle="tab"
                            data-bs-target="#nav-manager" type="button" role="tab" aria-controls="nav-manager"
                            aria-selected="false">quản lý</button>
                    </div>
                </nav>
                <div class="tab-content" id="nav-tabContent">
                    <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                        {{ product.description }}</div>
                    <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
                        {{ product.warranty }}
                    </div>
                    <div class="tab-pane fade" id="nav-move" role="tabpanel" aria-labelledby="nav-move-tab">
                        {{ product.delivery }}
                    </div>
                    <div v-if="isStoreOwner" class="tab-pane fade" id="nav-manager" role="tabpanel"
                        aria-labelledby="nav-manager-tab">
                        <button @click="updateState(product, 'show')" :disabled="product.state === 'show'"
                            class="btn btn-success">
                            Show
                        </button>
                        <button @click="updateState(product, 'hide')" :disabled="product.state === 'hide'"
                            class="btn btn-danger">
                            Hide
                        </button>
                        <button v-if="isStoreOwner && userRole != 'admin'" class="btn btn-secondary"
                            @click="editProduct(product._id)">
                            Chỉnh sửa
                        </button>
                    </div>
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
                        <ProductTypeForm :productId="id" @update="fetchProductTypes" />
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
import CartService from "@/services/cart.service";
import LocalStorageHelper from "@/services/local.service";
import StoreService from '@/services/store.service';
import CommentService from "@/services/comment.service";

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
    watch: {
        id: {
            handler(newId) {
                this.fetchProduct();
            },
            immediate: true
        }
    },
    data() {
        return {
            isStoreOwner: false,
            userId: LocalStorageHelper.getItem('id'),
            userRole: LocalStorageHelper.getItem('role'),
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
            types: [],
            quantity: 1,
            negativeReviews: '',
            neutralReviews: '',
            positiveReviews: '',
        };
    },
    async mounted() {
        try {
            await this.fetchProduct();
            await this.fetchProductTypes();
            await this.checkPermission();
        } catch (error) {
            console.error('Error fetching product:', error);
            this.error = error;
        }
    },
    methods: {
        productPicture(picture) {
            if (picture) {
                return `data:image/jpeg;base64,${picture}`;
            }
            return 'https://donggia.vn/wp-content/uploads/2019/11/thiet-ke-noi-that-phong-khach-chung-cu-dep-2020-12.jpg';
        },
        async checkPermission() {
            try {
                const store = await StoreService.get(this.product.storeid);
                this.isStoreOwner = store.userid === this.userId || this.userRole === 'admin';
            } catch (error) {
                console.error('Error checking permission:', error);
            }
        },
        async fetchProduct() {
            try {
                const response = await ProductService.get(this.id);
                const comments = await CommentService.findByProduct(this.id);
                this.countReviews(comments);
                this.product = response;
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        },
        countReviews(comments) {
            let negativeCount = 0;
            let neutralCount = 0;
            let positiveCount = 0;

            comments.forEach(comment => {
                if (comment.rate === 'Tiêu cực') {
                    negativeCount++;
                } else if (comment.rate === 'Bình thường') {
                    neutralCount++;
                } else if (comment.rate === 'Tích cực') {
                    positiveCount++;
                }
            });
            // negativeCount += 999000000;
            // neutralCount += 999000000;
            // positiveCount += 998000000;
            this.negativeReviews = negativeCount > 0 ? `${this.formatCount(negativeCount)} đánh giá tiêu cực` : 'Chưa có đánh giá Tiêu cực';
            this.neutralReviews = neutralCount > 0 ? `${this.formatCount(neutralCount)} đánh giá bình thường` : 'Chưa có đánh giá Bình thường';
            this.positiveReviews = positiveCount > 0 ? `${this.formatCount(positiveCount)} đánh giá tích cực` : 'Chưa có đánh giá Tích cực';
        },
        formatCount(count) {
            if (count >= 1000000) {
                return `${Math.floor(count / 1000000)} triệu`;
            } else if (count >= 1000) {
                return `${Math.floor(count / 1000)}k`;
            }
            return count;
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
        async addToCart(product) {
            const userId = LocalStorageHelper.getItem('id');
            if (!userId) {
                alert(`Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng`);
                return;
            }

            if (this.quantity <= 0 || this.quantity > product.count) {
                alert('Không đủ số lượng sản phẩm');
                return;
            }

            try {
                // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
                const existingCartItems = await CartService.findByUserIdAndStoreId(userId, product.storeid);
                const existingCartItem = existingCartItems.find(item => item.productid === product._id);

                let cart;
                if (existingCartItem) {
                    // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
                    cart = {
                        ...existingCartItem,
                        count: existingCartItem.count + this.quantity
                    };
                    await CartService.update(existingCartItem._id, cart);
                    alert(`Số lượng sản phẩm có trong giỏ hàng hiện tại là ${existingCartItem.count + this.quantity}`);
                } else {
                    // Nếu sản phẩm chưa có trong giỏ hàng, tạo mới
                    cart = {
                        userid: userId,
                        productid: product._id,
                        count: this.quantity,
                        storeid: product.storeid,
                        state: "1",
                    };
                    await CartService.create(cart);
                    alert(`Đã thêm ${this.quantity} sản phẩm vào giỏ hàng`);
                }

                // Cập nhật số lượng sản phẩm
                product.count -= this.quantity;
                await ProductService.update(product._id, { count: product.count });

            } catch (error) {
                console.error("Error adding product to cart:", error);
            }
        },

        navigateToProduct(type) {
            this.$router.push({ name: 'products', params: { id: type._id } });
        },
        async deleteProductType(id) {
            try {
                await ProductTypeService.delete(id);
                this.types = this.types.filter(type => type.id !== id);
                await this.fetchProductTypes();
                alert("Product type remove successfully!");

            } catch (error) {
                console.error("Error deleting product type:", error);
            }
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
        },
        editProduct(productId) {
            this.$emit('edit-product', productId);
        },
        async updateState(product, newState) {
            try {
                product.state = newState;
                await ProductService.update(product._id, { state: newState });
            } catch (error) {
                console.error('Error updating state:', error);
            }
        },
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

.quantity-container {
    display: flex;
    align-items: center;
}

.quantity-container>div {
    margin-right: 10px;
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
