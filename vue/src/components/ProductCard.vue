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
                :key="`filtered-${product._id}`">
                <div class="card mb-4 product-card">
                    <img :src="productPicture(product.picture)" class="card-img-top shoplistcard" :alt="product.name">
                    <div class="card-body">
                        <h5 class="card-title">{{ product.name }}</h5>
                        <div v-if="product.price">
                            <div class="card-cost d-flex justify-content-end">
                                <span v-if="product.discount">
                                    <s>{{ formatCurrency(product.price) }}</s>
                                </span>
                                <span v-else>
                                    {{ formatCurrency(product.price) }}
                                </span>
                            </div>
                            <div class="card-cost d-flex justify-content-end" v-if="product.discount">
                                {{ formatCurrency(product.price - product.price * product.discount / 100) }}
                            </div>
                        </div>
                        <div v-else>
                            <p>Sản phẩm này chưa có giá</p>
                        </div>
                        <div class="card-buttons d-flex justify-content-evenly">
                            <button class="btn btn-secondary" @click="moveToProduct(product._id)">Xem thêm</button>
                            <button class="btn btn-primary" @click="addToCart(product)" :disabled="!product.price">Thêm
                                vào giỏ</button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="selectedFilters.length > 0" class="col-12">
                <p>Không có sản phẩm phù hợp với bộ lọc</p>
            </div>
            <div v-else class="col-md-3" v-for="(product, index) in displayedProducts"
                :key="`displayed-${product._id}`">
                <div class="card mb-4 product-card">
                    <img :src="productPicture(product.picture)" class="card-img-top shoplistcard" :alt="product.name">
                    <div class="card-body">
                        <h5 class="card-title">{{ product.name }}</h5>
                        <div v-if="product.price">
                            <div class="card-cost d-flex justify-content-end">
                                <span v-if="product.discount">
                                    <s>{{ formatCurrency(product.price) }}</s>
                                </span>
                                <span v-else>
                                    {{ formatCurrency(product.price) }}
                                </span>
                            </div>
                            <div class="card-cost d-flex justify-content-end" v-if="product.discount">
                                {{ formatCurrency(product.price - product.price * product.discount / 100) }}
                            </div>
                        </div>
                        <div v-else>
                            <p>Sản phẩm này chưa có giá</p>
                        </div>
                        <div class="card-buttons d-flex justify-content-evenly">
                            <button class="btn btn-secondary" @click="moveToProduct(product._id)">Xem thêm</button>
                            <button class="btn btn-primary" @click="addToCart(product)" :disabled="!product.price">Thêm
                                vào giỏ</button>
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
import PriceService from "@/services/price.service";
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
        },
        searchQuery: {
            type: String,
            default: ''
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
        }
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
    watch: {
        searchQuery(newQuery) {
            this.filterProducts(newQuery);
        }
    },
    methods: {
        async fetchProducts() {
            try {
                const response = await ProductService.findByState('show');
                this.products = response;
                await this.fetchPricesForProducts(this.products);
                this.filterProducts(this.searchQuery);
            } catch (error) {
                this.error = 'Error fetching products';
                console.error('Error fetching products:', error);
            }
        },
        async fetchPricesForProducts(products) {
            try {
                const pricePromises = products.map(async (product) => {
                    const priceResponse = await PriceService.findByProductWithNoEndDate(product._id);
                    if (priceResponse.length > 0) {
                        product.price = priceResponse[0].price;
                        product.discount = priceResponse[0].discount;
                    } else {
                        product.price = null;
                        product.discount = null;
                    }
                });
                await Promise.all(pricePromises);
            } catch (error) {
                this.error = 'Error fetching prices';
                console.error('Error fetching prices:', error);
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
                const existingCartItems = await CartService.findByUserIdAndStoreId(userId, product.storeid);
                const existingCartItem = existingCartItems.find(item => item.productid === product._id);
                let cart;
                if (existingCartItem) {
                    cart = {
                        ...existingCartItem,
                        count: existingCartItem.count + 1
                    };
                    await CartService.update(existingCartItem._id, cart);
                    alert(`Số lượng sản phẩm có trong giỏ hàng hiện tại là ${existingCartItem.count + 1}`);
                } else {
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

                const productIds = results.reduce((acc, result) => {
                    result.forEach(item => {
                        if (!acc[item.productid]) {
                            acc[item.productid] = 0;
                        }
                        acc[item.productid]++;
                    });
                    return acc;
                }, {});

                const filteredProductIds = Object.keys(productIds).filter(
                    id => productIds[id] === this.selectedFilters.length
                );

                const products = await Promise.all(
                    filteredProductIds.map(id => ProductService.get(id))
                );

                await this.fetchPricesForProducts(products);

                this.filteredProducts = products.filter(product => product.state !== 'hide');
            } catch (error) {
                console.error('Error fetching product types or products:', error);
            }
        },
        filterProducts(query) {
            if (!query) {
                this.filteredProducts = this.products;
                return;
            }
            const lowerCaseQuery = query.toLowerCase();
            this.filteredProducts = this.products.filter(product =>
                product.name.toLowerCase().includes(lowerCaseQuery)
            );
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