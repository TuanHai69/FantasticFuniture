<template>
    <div class="container mt-4">
        <h2>Products</h2>
        <div class="accordion" id="filterAccordion">
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        Bộ lọc
                    </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne"
                    data-bs-parent="#filterAccordion">
                    <div class="accordion-body">
                        <div class="form-group">
                            <label>Chọn loại sản phẩm</label>
                            <div class="checkbox-grid">
                                <div v-for="option in filterOptions" :key="option.value" class="form-check">
                                    <input class="form-check-input" type="checkbox" :value="option.value"
                                        v-model="selectedFilters" @change="logSelectedFilters">
                                    <label class="form-check-label">{{ option.text }}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row m-3">
            <div v-if="filteredProducts.length > 0" class="col-md-3" v-for="(product, index) in filteredProducts"
                :key="product.id">
                <div class="card mb-4 product-card">
                    <img :src="productPicture(product.picture)" class="card-img-top shoplistcard" :alt="product.name">
                    <div class="card-body">
                        <h5 class="card-title">{{ product.name }}</h5>
                        <div class="card-cost d-flex justify-content-end">
                            <span v-if="product.discount">
                                <s>{{ formatCurrency(product.cost) }}</s>
                            </span>
                            <span v-else>
                                {{ formatCurrency(product.cost) }}
                            </span>
                        </div>
                        <div class="card-cost d-flex justify-content-end" v-if="product.discount">
                            {{ formatCurrency(product.cost - product.cost * product.discount / 100) }}
                        </div>
                        <div class="card-buttons d-flex justify-content-evenly">
                            <button class="btn btn-secondary" @click="moveToProduct(product._id)">Xem thêm</button>
                            <button class="btn btn-primary" @click="addToCart(product)">Thêm vào giỏ</button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="selectedFilters.length > 0" class="col-12">
                <p>Không có sản phẩm phù hợp với bộ lọc</p>
            </div>
            <div v-else class="col-md-3" v-for="(product, index) in displayedProducts" :key="product._id">
                <div class="card mb-4 product-card">
                    <img :src="productPicture(product.picture)" class="card-img-top shoplistcard" :alt="product.name">
                    <div class="card-body">
                        <h5 class="card-title">{{ product.name }}</h5>
                        <div class="card-cost d-flex justify-content-end">
                            <span v-if="product.discount">
                                <s>{{ formatCurrency(product.cost) }}</s>
                            </span>
                            <span v-else>
                                {{ formatCurrency(product.cost) }}
                            </span>
                        </div>
                        <div class="card-cost d-flex justify-content-end" v-if="product.discount">
                            {{ formatCurrency(product.cost - product.cost * product.discount / 100) }}
                        </div>
                        <div class="card-buttons d-flex justify-content-evenly">
                            <button class="btn btn-secondary" @click="moveToProduct(product._id)">Xem thêm</button>
                            <button class="btn btn-primary" @click="addToCart(product)">Thêm vào giỏ</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-center mb-4">
            <button v-if="displayedProducts.length < products.length && filteredProducts.length === 0" @click="loadMore"
                class="btn btn-primary">Hiển thị thêm</button>
        </div>
        <div v-if="loading" class="loading">Loading...</div>
        <div v-if="error" class="error">{{ error }}</div>
    </div>
</template>

<script>
import ProductService from "@/services/product.service";
import TypeService from "@/services/type.service";
import ProductTypeService from "@/services/producttype.service";
import CartService from "@/services/cart.service";
import LocalStorageHelper from "@/services/local.service";

export default {
    name: 'ProductList',
    props: {
        id: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            products: [],
            displayedProducts: [],
            filteredProducts: [],
            itemsToShow: 20,
            loading: false,
            error: null,
            selectedFilters: [],
            filterOptions: [],
        };
    },
    async created() {
        this.loading = true;
        await this.fetchProducts();
        await this.fetchTypes();
        this.displayedProducts = this.products.slice(0, this.itemsToShow);


        if (this.id) {
            this.selectedFilters.push(this.id);
            await this.logSelectedFilters();
        }
        this.loading = false;
    },
    methods: {
        async fetchProducts() {
            try {
                const response = await ProductService.findByState('show');
                this.products = response;
            } catch (error) {
                this.error = 'Error fetching products';
                console.error('Error fetching products:', error);
            }
        },
        async fetchTypes() {
            try {
                const response = await TypeService.getAll();
                this.filterOptions = response.map(type => ({
                    value: type._id,
                    text: type.name
                }));
            } catch (error) {
                this.error = 'Error fetching types';
                console.error('Error fetching types:', error);
            }
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
        loadMore() {
            const nextItems = this.displayedProducts.length + 8;
            if (nextItems <= this.products.length) {
                this.displayedProducts = this.products.slice(0, nextItems);
            } else {
                this.displayedProducts = this.products;
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
        moveToProduct(productId) {
            this.$router.push(`/product/${productId}`);
        },
        async logSelectedFilters() {
            if (this.selectedFilters.length === 0) {
                this.filteredProducts = [];
                return;
            }
            try {
                const results = await Promise.all(
                    this.selectedFilters.map(id => ProductTypeService.findByType(id))
                );

                // Tổng hợp các productid từ tất cả các result
                const productIds = results.reduce((acc, result) => {
                    result.forEach(item => {
                        if (!acc[item.productid]) {
                            acc[item.productid] = 0;
                        }
                        acc[item.productid]++;
                    });
                    return acc;
                }, {});

                // Lọc các productid xuất hiện trong tất cả các selectedFilters
                const filteredProductIds = Object.keys(productIds).filter(
                    id => productIds[id] === this.selectedFilters.length
                );

                // Lấy dữ liệu sản phẩm cho từng productid trong filteredProductIds
                const products = await Promise.all(
                    filteredProductIds.map(id => ProductService.get(id))
                );

                this.filteredProducts = products.filter(product => product.state !== 'hide');
                // console.log(products);
            } catch (error) {
                console.error('Error fetching product types or products:', error);
            }
        }
    }
};
</script>
<style>
.loading {
    text-align: center;
    font-size: 1.5em;
    color: #007bff;
}

.error {
    text-align: center;
    font-size: 1.5em;
    color: red;
}

.checkbox-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}
</style>