<template>
    <div class="container mt-4">
        <h2>products</h2>
        <div class="row m-3">
            <div class="col-md-3" v-for="(Product, index) in displayedproducts" :key="Product.id">
                <div class="card mb-4 product-card">
                    <img :src="productPicture(Product.picture)" class="card-img-top shoplistcard" :alt="Product.name">
                    <div class="card-body">
                        <h5 class="card-title">{{ Product.name }}</h5>
                        <div class="card-cost d-flex justify-content-end" v-if="Product.discount">
                            <s>{{ formatCurrency(Product.cost) }}</s>
                        </div>
                        <div class="card-cost d-flex justify-content-end" v-if="Product.discount">
                            {{ formatCurrency(Product.cost - Product.cost * Product.discount / 100) }}
                        </div>
                        <div class="card-buttons d-flex justify-content-evenly ">
                            <button class="btn btn-secondary" @click="moveToProduct(Product._id)">Xem thêm</button>
                            <button class="btn btn-primary">Thêm vào giỏ</button>
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
    },
    methods: {
        async fetchProducts() {
            try {
                const response = await ProductService.findByState('show');
                this.products = response;
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
        moveToProduct(productId) {
            this.$router.push(`/product/${productId}`);
        },
    }
}
</script>
