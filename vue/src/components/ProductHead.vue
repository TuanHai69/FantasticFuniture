<template>
    <div class="container shop-head-card bg-white">
        <div class="row justify-content-evenly">
            <div class="col-5 image-container m-4">
                <img :src="productPicture(product.picture)" alt="Large Image"
                    class="img-fluid large-image limited-height" />
            </div>
            <div class="col-6 text-container m-4">

                <div class="d-flex justify-content-between align-items-center">
                    <h3>Tên sản phẩm {{ product.name }}</h3>
                    <button class="btn btn-heart1 " @click="toggleLike(id)">
                        <i :class="{ 'fas fa-heart': isLiked, 'far fa-heart': !isLiked }"></i>
                    </button>
                </div>
                <p>Vật liệu: {{ product.material }}</p>
                <p class="address">Kích thước: {{ product.size }}</p>
                <p class="review"> Đánh giá:
                    <span v-for="(star, index) in getStarIcons(averageRating)" :key="index" :class="star"></span>
                    <span>({{ averageRating }})</span>
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
                <p class="phone">Số lượng: {{ product.count }} || Giá: <span v-if="discount">
                        <s>{{ formatCurrency(price) }}</s> -> {{ formatCurrency(price - price * discount / 100) }}
                    </span>
                    <span v-else>
                        {{ formatCurrency(price) }}
                    </span>
                </p>
                <p class="quantity-container">
                <div>
                    <label for="quantity">Số lượng: </label>
                    <input type="number" id="quantity" v-model.number="quantity" min="1" :max="product.count" />
                </div>
                <button class="btn btn-primary" @click="addToCart(product)" :disabled="!price">Thêm vào giỏ</button>
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
                        <button v-if="isStoreOwner && userRole != 'admin'" class="btn btn-secondary"
                            @click="updatePrice(product._id)">
                            Cập nhật giá
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
import PriceService from "@/services/price.service";
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
                picture: '',
                material: '',
                size: '',
                description: '',
                warranty: '',
                delivery: '',
                count: '',
                storeid: '',
                state: '',
            },
            price: null,
            discount: null,
            error: {},
            types: [],
            quantity: 1,
            averageRating: 0,
            isLiked: false,
        };
    },
    async mounted() {
        try {
            await this.fetchProduct();
            await this.fetchProductTypes();
            await this.checkPermission();
            await this.checkLikedStatus();
        } catch (error) {
            console.error('Error fetching product:', error);
            this.error = error;
        }
    },
    methods: {
        async toggleLike(productId) {
            const userId = LocalStorageHelper.getItem('id');
            if (!userId) {
                alert('Bạn cần đăng nhập để thích sản phẩm');
                return;
            } try {
                const userComments = await CommentService.findByUser(userId);
                if (userComments.length === 0) { // Create a new comment
                    const comment = {
                        rate: '',
                        comment: '',
                        state: 'Nopay',
                        userid: userId,
                        productid: productId,
                        like: true,
                    };
                    await CommentService.create(comment);
                } else {
                    const existingComment = userComments.find(comment => comment.productid === productId);
                    if (!existingComment) {
                        const comment = {
                            rate: '',
                            comment: '',
                            state: 'Nopay',
                            userid: userId,
                            productid: productId,
                            like: true,
                        };
                        await CommentService.create(comment);
                    } else {
                        this.isLiked = !this.isLiked; await CommentService.update(existingComment._id, { like: this.isLiked });
                    }
                }
            } catch (error) { console.error('Error toggling like status:', error); }
        },
        async checkLikedStatus() {
            const userId = LocalStorageHelper.getItem('id');
            if (!userId) {
                return;
            }
            try {
                const response = await CommentService.isLiked(userId, this.id);
                this.isLiked = response.length > 0 && response[0].like === true;
                console.log(this.isLiked);
            } catch (error) {
                console.error('Error checking liked status:', error);
            }
        },
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
                this.calculateAverageRating(comments);
                this.product = response;
                await this.fetchPrice(this.id);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        },
        async fetchPrice(productId) {
            try {
                const priceResponse = await PriceService.findByProductWithNoEndDate(productId);
                if (priceResponse.length > 0) {
                    this.price = priceResponse[0].price;
                    this.discount = priceResponse[0].discount;
                } else {
                    this.price = null;
                    this.discount = null;
                }
            } catch (error) {
                console.error('Error fetching price:', error);
            }
        },
        calculateAverageRating(comments) {
            let totalRating = 0;
            let ratingCount = comments.length;

            comments.forEach(comment => {
                totalRating += parseInt(comment.rate, 10);
            });

            this.averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0;
        },
        async fetchProductTypes() {
            try {
                const productTypes = await ProductTypeService.findByProduct(this.id);

                const typePromises = productTypes.map(pt => TypeService.get(pt.typeid));
                const types = await Promise.all(typePromises);

                this.types = types.map((type, index) => ({
                    ...type,
                    producttypeid: productTypes[index]._id
                }));
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
                const existingCartItems = await CartService.findByUserIdAndStoreId(userId, product.storeid);
                const existingCartItem = existingCartItems.find(item => item.productid === product._id);

                let cart;
                if (existingCartItem) {
                    cart = {
                        ...existingCartItem,
                        count: existingCartItem.count + this.quantity
                    };
                    await CartService.update(existingCartItem._id, cart);
                    alert(`Số lượng sản phẩm có trong giỏ hàng hiện tại là ${existingCartItem.count + this.quantity}`);
                } else {
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
        updatePrice(productId) {
            this.$emit('update-price', productId);
        },

        async updateState(product, newState) {
            try {
                product.state = newState;
                await ProductService.update(product._id, { state: newState });
            } catch (error) {
                console.error('Error updating state:', error);
            }
        },
        getStarIcons(rate) {
            const fullStars = Math.floor(rate);
            const halfStar = rate % 1 !== 0;
            const stars = [];

            for (let i = 1; i <= 5; i++) {
                if (i <= fullStars) {
                    stars.push('fas fa-star');
                } else if (i === fullStars + 1 && halfStar) {
                    stars.push('fas fa-star-half-alt');
                } else {
                    stars.push('far fa-star');
                }
            }
            return stars;
        },
    },
};
</script>


<style scoped>
.btn-heart1 {
    background: none;
    border: none;
    font-size: 24px;
    color: pink;
    cursor: pointer;
}

.btn-heart1 .far.fa-heart {
    color: red;
}

.btn-heart1 .fas.fa-heart {
    color: pink;
}

.fa-star,
.fa-star-half-alt,
.far.fa-star {
    color: #ffd700;
    font-size: 1.2em;
}

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


.tab-pane {
    min-height: 7.5rem;
    max-height: 7.5rem;
    overflow-y: auto;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;
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
}

.delete-button:hover {
    background-color: darkred;
}
</style>
