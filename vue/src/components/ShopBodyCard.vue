<template>
    <div class="container mt-4">
        <h2>products</h2>
        <div class="row m-3 d-flex justify-content-evenly">
            <div class="col-3 bg-white p-4 tag-container">
                <button v-for="type in types" :key="type._id" class="water-drop-button" @click="handleTypeClick(type)">
                    {{ type.name }}
                </button>
            </div>
            <div class="col-8" v-if="products.length > 0">
                <div class="row bg-white p-3 justify-content-evenly">
                    <div class="col-md-5" v-for="(Product, index) in displayedproducts" :key="Product._id">
                        <div class="card mb-4 product-card">
                            <div class="position-relative">
                                <img :src="productPicture(Product.picture)" class="card-img-top shoplistcard"
                                    :alt="Product.name"> <button class="btn btn-heart" @click="toggleLike(Product._id)">
                                    <i
                                        :class="{ 'fas fa-heart': isLiked[Product._id], 'far fa-heart': !isLiked[Product._id] }">
                                    </i>
                                </button>
                            </div>

                            <div class="card-body">
                                <h5 class="card-title">{{ Product.name }}</h5>
                                <div v-if="Product.cost">
                                    <div class="card-cost d-flex justify-content-end">
                                        <span v-if="Product.discount">
                                            <s>{{ formatCurrency(Product.cost) }}</s>
                                        </span>
                                        <span v-else>
                                            {{ formatCurrency(Product.cost) }}
                                        </span>
                                    </div>
                                    <div class="card-cost d-flex justify-content-end" v-if="Product.discount">
                                        {{ formatCurrency(Product.cost - Product.cost * Product.discount / 100) }}
                                    </div>
                                </div>
                                <div v-else>
                                    <p>Sản phẩm này chưa có giá</p>
                                </div>
                                <div class="card-buttons d-flex justify-content-evenly">
                                    <button class="btn btn-primary" @click="moveToProduct(Product._id)">Xem
                                        thêm</button>
                                    <button class="btn btn-secondary" @click="addToCart(Product)">Thêm vào giỏ</button>
                                    <button v-if="editstate == 'show' && isStoreOwner" class="btn btn-secondary"
                                        @click="editProduct(Product._id)">Chỉnh
                                        sửa
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-8" v-else>
                <p>Chưa có sản phẩm nào.</p>
            </div>
        </div>
        <div class="d-flex justify-content-center mb-4" v-if="products.length > 0">
            <button v-if="displayedproducts.length < products.length" @click="loadMore" class="btn btn-primary">Hiển thị
                thêm</button>
        </div>
    </div>
</template>
<script>
import ProductService from "@/services/product.service";
import ProductTypeService from "@/services/producttype.service";
import TypeService from "@/services/type.service";
import CartService from "@/services/cart.service";
import LocalStorageHelper from "@/services/local.service";
import StoreService from '@/services/store.service';
import PriceService from "@/services/price.service";
import CommentService from "@/services/comment.service";

export default {
    name: 'ProductList',
    props: {
        storeid: {
            type: String,
            required: true
        },
        editstate: {
            type: String,
            required: true,
        }
    },
    data() {
        return {
            products: [],
            displayedproducts: [],
            itemsToShow: 20,
            types: [],
            isStoreOwner: false,
            userId: LocalStorageHelper.getItem('id'),
            userRole: LocalStorageHelper.getItem('role'),
            isLiked: {},
        }
    },
    async mounted() {
        await this.fetchProducts();
        if (this.products.length > 0) {
            this.displayedproducts = this.products.slice(0, this.itemsToShow);
            await this.fetchTypes();
        }
        await this.checkReportPermission();
        await this.checkLikedStatus();
    },
    methods: {
        async fetchProducts() {
            try {
                const response = await ProductService.findByStore(this.storeid);
                this.products = response;
                await this.fetchPricesForProducts(this.products); // Fetch prices for products
            } catch (error) {
                console.log('Error fetching products:', error);
            }
        },

        async checkReportPermission() {
            try {
                const store = await StoreService.get(this.storeid);
                this.isStoreOwner = store.userid === this.userId;
            } catch (error) {
                console.error('Error checking report permission:', error);
            }
        },
        async fetchPricesForProducts(products) {
            try {
                const pricePromises = products.map(async (product) => {
                    const priceResponse = await PriceService.findByProductWithNoEndDate(product._id);
                    if (priceResponse.length > 0) {
                        product.cost = priceResponse[0].price;
                        product.discount = priceResponse[0].discount;
                    } else {
                        product.cost = null;
                        product.discount = null;
                    }
                });
                await Promise.all(pricePromises);
            } catch (error) {
                console.error('Error fetching prices:', error);
            }
        },
        async checkLikedStatus() {
            const userId = LocalStorageHelper.getItem('id');
            if (!userId) return;
            try {
                const likePromises = this.products.map(async (product) => {
                    const response = await CommentService.isLiked(userId, product._id);
                    this.isLiked = { ...this.isLiked, [product._id]: response.length > 0 && response[0].like === true };
                }); await Promise.all(likePromises);
            } catch (error) {
                console.error('Error checking liked status:', error);
            }
        },
        async toggleLike(productId) {
            const userId = LocalStorageHelper.getItem('id');
            if (!userId) {
                alert('Bạn cần đăng nhập để thích sản phẩm'); return;
            }
            try {
                const userComments = await CommentService.findByUser(userId);
                if (userComments.length === 0) {
                    // Create a new comment 
                    const comment = {
                        rate: '',
                        comment: '',
                        state: 'Nopay',
                        userid: userId,
                        productid: productId,
                        like: true,
                    };
                    await CommentService.create(comment);
                }
                else {
                    const existingComment = userComments.find(comment => comment.productid === productId); if (!existingComment) {
                        // Create a new comment if no comment exists for this product 
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
                        // Update the like status of the existing comment
                        this.isLiked[productId] = !this.isLiked[productId];
                        await CommentService.update(existingComment._id, { like: this.isLiked[productId] });
                    }
                }
            } catch (error) { console.error('Error toggling like status:', error); }
        },
        async addToCart(product) {
            const userId = LocalStorageHelper.getItem('id');
            if (!userId) {
                alert(`Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng`);
                return;
            }
            if (product.count <= 0) {
                alert('Sản phẩm không đủ số lượng');
                return;
            }
            try {
                // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
                const existingCartItems = await CartService.findByUserIdAndStoreId(userId, product.storeid);
                const existingCartItem = existingCartItems.find(item => item.productid === product._id);
                let cart;
                console.log(existingCartItem);
                if (existingCartItem) {
                    // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
                    cart = {
                        ...existingCartItem,
                        count: existingCartItem.count + 1
                    };
                    await CartService.update(existingCartItem._id, cart);
                    alert(`Số lượng sản phẩm có trong giỏ hàng hiện tại là ${existingCartItem.count + 1}`);
                } else {
                    // Nếu sản phẩm chưa có trong giỏ hàng, tạo mới
                    cart = {
                        userid: userId,
                        productid: product._id,
                        count: 1,
                        storeid: product.storeid,
                        state: "1"
                    };
                    await CartService.create(cart);
                    alert('Đã thêm sản phẩm vào giỏ hàng');

                }
                product.count -= 1;
                await ProductService.update(product._id, { count: product.count });
            } catch (error) {
                console.error("Error adding product to cart:", error);
            }
        },
        async fetchTypes() {
            try {
                const typeIds = new Set();
                for (const product of this.products) {
                    try {
                        const productTypes = await ProductTypeService.findByProduct(product._id);

                        if (productTypes && productTypes.length > 0) {
                            productTypes.forEach(pt => typeIds.add(pt.typeid));
                        }
                    } catch (error) {
                        if (error.response && error.response.status === 404) {
                            // console.warn('Product types not found ');
                        } else {
                            console.error('Error fetching product types:', error);
                        }
                    }
                }
                const uniqueTypeIds = Array.from(typeIds);
                for (const typeId of uniqueTypeIds) {
                    const type = await TypeService.get(typeId);
                    this.types.push(type);
                }
            } catch (error) {
                console.error('Error fetching types:', error);
            }
        },
        handleTypeClick(type) {
            this.$router.push({ name: 'products', params: { id: type._id } });
        },
        loadMore() {
            const nextItems = this.displayedproducts.length + 8;
            if (nextItems <= this.products.length) {
                this.displayedproducts = this.products.slice(0, nextItems);
            } else {
                this.displayedproducts = this.products;
            }
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
        },
        productPicture(picture) {
            if (picture) {
                return `data:image/jpeg;base64,${picture}`;
            }
            return 'https://th.bing.com/th?id=OIP.XqGBZKSVcAqsEghNyEn1wAHaE8&w=306&h=204&c=8&rs=1&qlt=90&r=0&o=6&dpr=1.1&pid=3.1&rm=2.jpg';
        },
        editProduct(productId) {
            this.$emit('edit-product', productId);
        },
        moveToProduct(productId) {
            this.$router.push(`/product/${productId}`);
        },
    }
}
</script>
<style scoped>
.water-drop-button {
    background-color: #1E90FF;
    /* Dodger Blue */
    color: white;
    border: none;
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    /* Water drop shape */
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.water-drop-button:hover {
    transform: scale(1.05);
}

.water-drop-button:active {
    transform: scale(0.95);
}

.btn-heart {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 24px;
    color: pink;
}

.btn-heart .far.fa-heart {
    color: red;
}

.btn-heart .fas.fa-heart {
    color: pink;
}
</style>