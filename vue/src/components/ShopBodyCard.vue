<template>
    <div class="container mt-4">
        <h2>products</h2>
        <div class="row m-3 d-flex justify-content-evenly">
            <div class="col-3 bg-white p-4 tag-container">
                <p class="tag">tag</p>
                <p class="tag">tag</p>
                <p class="tag">tag</p>
                <p class="tag">tag</p>
                <p class="tag">tag</p>
                <p class="tag">tag</p>
                <p class="tag">tag</p>
            </div>
            <div class="col-8">
                <div class="row bg-white p-3 justify-content-evenly">
                    <div class="col-md-5" v-for="(Product, index) in displayedproducts" :key="Product.id">
                        <div class="card mb-4 product-card">
                            <img :src="productPicture(Product.picture)" class="card-img-top shoplistcard" :alt="Product.name">
                            <div class="card-body">
                                <h5 class="card-title">{{ Product.name }}</h5>
                                <div class="card-cost d-flex justify-content-end">{{ formatCurrency(Product.cost) }}
                                </div>
                                <div class="card-cost d-flex justify-content-end">{{ formatCurrency(Product.cost) }}
                                </div>
                                <div class="card-buttons d-flex justify-content-evenly">
                                    <button class="btn btn-primary" @click="addToCart(Product._id)">Xem thêm</button>
                                    <button class="btn btn-secondary">Thêm vào giỏ</button>
                                    <button class="btn btn-secondary" @click="editProduct(Product._id)">Chỉnh sửa</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-center mb-4">
            <button v-if="displayedproducts.length < products.length" @click="loadMore" class="btn btn-primary">Hiển thị
                thêm</button>
        </div>
    </div>
</template>

<script>
import ProductService from "@/services/product.service"; // Giả sử bạn có service này

export default {
    name: 'ProductList',
    props: {
        storeid: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            products: [],
            displayedproducts: [],
            itemsToShow: 20
        }
    },
    async created() {
        await this.fetchProducts();
        this.displayedproducts = this.products.slice(0, this.itemsToShow);
        // console.log(this.displayedproducts);
    },
    methods: {
        async fetchProducts() {
            try {
                // console.log(this.storeid);
                const response = await ProductService.findByStore(this.storeid);
                // console.log(response);
                this.products = response;
                // console.log(this.products);
            } catch (error) {
                console.log('Error fetching products:', error);
            }
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
        addToCart(productId) {
            this.$router.push( `/product/${productId}`);
        },
    }
}
</script>
