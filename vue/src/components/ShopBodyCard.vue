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
                            <img :src="Product.image" class="card-img-top shoplistcard" :alt="Product.name">
                            <div class="card-body">
                                <h5 class="card-title">{{ Product.name }}</h5>
                                <div class="card-cost d-flex justify-content-end">{{ formatCurrency(Product.cost) }}
                                </div>
                                <div class="card-cost d-flex justify-content-end">{{ formatCurrency(Product.cost) }}
                                </div>
                                <div class="card-buttons d-flex justify-content-evenly ">
                                    <button class="btn btn-secondary">Xem thêm</button>
                                    <button class="btn btn-primary">Thêm vào giỏ</button>
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
export default {
    name: 'ProductList',
    data() {
        return {
            products: [
                { id: 1, cost: '12220000', name: 'Product 1', image: 'https://donggia.vn/wp-content/uploads/2019/11/thiet-ke-noi-that-phong-khach-chung-cu-dep-2020-12.jpg' },
                { id: 2, cost: '12000000', name: 'Product 2', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 3, cost: '12000000', name: 'Product 3', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 4, cost: '12000000', name: 'Product 4', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 5, cost: '12000000', name: 'Product 5', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 6, cost: '12000000', name: 'Product 6', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 7, cost: '12000000', name: 'Product 7', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 8, cost: '12000000', name: 'Product 8', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 9, cost: '12000000', name: 'Product 9', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 10, cost: '12000000', name: 'Product 10', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 11, cost: '12000000', name: 'Product 11', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 12, cost: '12000000', name: 'Product 12', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 13, cost: '12000000', name: 'Product 13', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 14, cost: '12000000', name: 'Product 14', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 15, cost: '12000000', name: 'Product 15', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 16, cost: '12000000', name: 'Product 16', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 17, cost: '12000000', name: 'Product 17', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 18, cost: '12000000', name: 'Product 18', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 19, cost: '12000000', name: 'Product 19', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 20, cost: '12000000', name: 'Product 20', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 21, cost: '12000000', name: 'Product 21', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                // Thêm các danh mục khác
            ],
            displayedproducts: [],
            itemsToShow: 20
        }
    },
    created() {
        this.displayedproducts = this.products.slice(0, this.itemsToShow);
    },
    methods: {
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
        }
    }
}
</script>