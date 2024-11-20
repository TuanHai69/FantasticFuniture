<template>
    <div class="order-list">
        <div class="date-filters mb-3 p-3 border rounded bg-light">
            <div class="d-flex align-items-center">
                <div class="form-group me-3">
                    <label for="startDate" class="form-label"><strong>Ngày bắt đầu:</strong></label>
                    <input type="date" id="startDate" v-model="startDate" class="form-control">
                </div>
                <div class="form-group me-3">
                    <label for="endDate" class="form-label"><strong>Ngày kết thúc:</strong></label>
                    <input type="date" id="endDate" v-model="endDate" class="form-control">
                </div>
                <div class="button-group d-flex">
                    <button @click="confirmDateRange" class="btn btn-primary me-2">Xác nhận</button>
                    <button @click="resetDateRange" class="btn btn-secondary">Reset</button>
                </div>
            </div>
            <div v-if="isInvalidDateRange" class="alert alert-danger mt-3">
                Ngày bắt đầu phải trước ngày kết thúc.
            </div>
            <div v-if="dateRangeConfirmed && filteredByDateOrders.length" class="alert alert-success mt-3">
                Đơn hàng nằm trong khoảng {{ startDate }} đến {{ endDate }}.
            </div>
        </div>
        <div v-if="!dateRangeConfirmed && filteredOrders.length">
            <div class="card mb-3">
                <div class="card-body">
                    <div class="statistics">
                        <p><strong>Tổng đơn hàng:</strong> {{ totalOrders }}</p>
                        <p><strong>Tổng số sản phẩm:</strong> {{ totalOrderDetails }}</p>
                        <p><strong>Tổng giá trị:</strong> {{ formatCurrency(totalPrice) }}</p>
                        <p><strong>Giá sản phẩm lớn nhất trên 1 đơn hàng:</strong> {{ highestCostDetail.productName }} :
                            {{
                                formatCurrency(highestCostDetail.productPrice) }}</p>
                        <p><strong>Số lượng bán nhiều nhất trên 1 đơn hàng:</strong> {{ mostCountDetail.productName }} :
                            {{
                                mostCountDetail.count }} sản phẩm</p>
                    </div>
                </div>
            </div>
            <div v-for="order in filteredOrders" :key="order._id" class="order-item card mb-3">
                <div class="card-body">
                    <div class="order-summary row">
                        <div class="col-md-5">
                            <p><strong>Mã đơn hàng:</strong> {{ order._id }}</p>
                            <p>
                                <strong>Tổng giá đơn hàng:</strong>
                                {{ calculateOrderTotal(order._id) ? formatCurrency(calculateOrderTotal(order._id)) :
                                'Chưa thanh toán' }}
                            </p>
                            <p><strong>Ngày thành lập:</strong> {{ order.date }}</p>
                            <p><strong>Trạng thái:</strong> {{ order.state }}</p>
                        </div>
                        <div class="col-md-5" v-if="stores[order.storeid]">
                            <p><strong>Tên cửa hàng:</strong> {{ stores[order.storeid].name }}</p>
                            <p><strong>Địa chỉ cửa hàng:</strong> {{ stores[order.storeid].address }}</p>
                            <p><strong>Số điện thoại cửa hàng:</strong> {{ stores[order.storeid].phonenumber }}</p>
                            <p><strong>Email cửa hàng:</strong> {{ stores[order.storeid].email }}</p>
                        </div>
                        <div class="col-md-2 d-flex align-items-center justify-content-center">
                            <button class="btn btn-primary" @click="toggleOrderDetails(order._id)">
                                {{ expandedOrderId === order._id ? 'Ẩn chi tiết' : 'Hiện chi tiết' }}
                            </button>
                        </div>
                    </div>
                    <div v-if="expandedOrderId === order._id" class="order-details mt-3">
                        <ul class="list-unstyled">
                            <li v-for="detail in orderDetails[order._id]" :key="detail._id"
                                class="order-detail-item row mb-3 p-3 rounded shadow-sm">
                                <div class="col-12 col-md-2 mb-3 mb-md-0 d-flex justify-content-center">
                                    <img :src="productPicture(detail.productPicture)" alt="Product Image"
                                        class="product-image img-fluid" />
                                </div>
                                <div class="col-12 col-md-3 mb-3 mb-md-0">
                                    <p><strong>Tên sản phẩm:</strong> {{ detail.productName }}</p>
                                    <p><strong>Chất liệu:</strong> {{ detail.productMaterial }}</p>
                                    <p><strong>Kích thước:</strong> {{ detail.productSize }}</p>
                                    <p><strong>Bảo hành:</strong> {{ detail.productWarranty }}</p>
                                </div>
                                <div class="col-12 col-md-4 mb-3 mb-md-0">
                                    <p><strong>Số điện thoại người nhận:</strong> {{ detail.phonenumber }}</p>
                                    <p><strong>Phương thức trả:</strong>
                                        <span v-if="detail.payment === 'Chuyển khoảng'"> Đã trả bằng zalopay</span>
                                        <span v-else>{{ detail.payment }}</span>
                                    </p>
                                    <p class="address"><strong>Địa chỉ giao hàng:</strong> {{ detail.address }}</p>
                                </div>
                                <div class="col-12 col-md-3 mb-3 mb-md-0">
                                    <p><strong>Số lượng:</strong> {{ detail.count }}</p>
                                    <p><strong>Tổng cộng:</strong> {{ formatCurrency((detail.productPrice * detail.count
                                        - detail.productPrice * detail.count * (detail.discount / 100))) }}</p>
                                    <p class="description"><strong>Mô tả:</strong> {{ detail.note }}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="filteredByDateOrders.length">
            <div class="card mb-3">
                <div class="card-body">
                    <div class="statistics">
                        <p><strong>Tống số đơn hàng:</strong> {{ totalOrders }}</p>
                        <p><strong>Tổng số sản phẩm:</strong> {{ totalOrderDetails }}</p>
                        <p><strong>Tổng giá trị:</strong> {{ formatCurrency(totalPrice) }}</p>
                        <p><strong>Giá sản phẩm lớn nhất trên 1 đơn hàng:</strong> {{ highestCostDetail.productName }} :
                            {{
                                formatCurrency(highestCostDetail.productPrice) }}</p>
                        <p><strong>Số lượng bán nhiều nhất trên 1 đơn hàng:</strong> {{ mostCountDetail.name }} : {{
                            mostCountDetail.count }} sản phẩm</p>
                    </div>
                </div>
            </div>
            <div v-for="order in filteredByDateOrders" :key="order._id" class="order-item card mb-3">
                <div class="card-body">
                    <div class="order-summary row">
                        <div class="col-md-5">
                            <p><strong>Mã đơn hàng:</strong> {{ order._id }}</p>
                            <p><strong>Tổng đơn hàng:</strong>
                                {{ calculateOrderTotal(order._id) ? formatCurrency(calculateOrderTotal(order._id)) :
                                'Chưa thanh toán' }}</p>
                            <p><strong>Ngày thành lập:</strong> {{ order.date }}</p>
                            <p><strong>Trạng thái:</strong> {{ order.state }}</p>
                        </div>
                        <div class="col-md-5" v-if="stores[order.storeid]">
                            <p><strong>Tên cửa hàng:</strong> {{ stores[order.storeid].name }}</p>
                            <p><strong>Địa chỉ cửa hàng:</strong> {{ stores[order.storeid].address }}</p>
                            <p><strong>Số điện thoại cửa hàng:</strong> {{ stores[order.storeid].phonenumber }}</p>
                            <p><strong>Email cửa hàng:</strong> {{ stores[order.storeid].email }}</p>
                        </div>
                        <div class="col-md-2 d-flex align-items-center justify-content-center">
                            <button class="btn btn-primary" @click="toggleOrderDetails(order._id)">
                                {{ expandedOrderId === order._id ? 'Ẩn chi tiết' : 'Hiện chi tiết' }}
                            </button>
                        </div>
                    </div>
                    <div v-if="expandedOrderId === order._id" class="order-details mt-3">
                        <ul class="list-unstyled">
                            <li v-for="detail in orderDetails[order._id]" :key="detail._id"
                                class="order-detail-item row mb-3 p-3 rounded shadow-sm">
                                <div class="col-12 col-md-2 mb-3 mb-md-0 d-flex justify-content-center">
                                    <img :src="productPicture(detail.productPicture)" alt="Product Image"
                                        class="product-image img-fluid" />
                                </div>
                                <div class="col-12 col-md-3 mb-3 mb-md-0">
                                    <p><strong>Name:</strong> {{ detail.productName }}</p>
                                    <p><strong>Material:</strong> {{ detail.productMaterial }}</p>
                                    <p><strong>Size:</strong> {{ detail.productSize }}</p>
                                    <p><strong>Warranty:</strong> {{ detail.productWarranty }}</p>
                                </div>
                                <div class="col-12 col-md-4 mb-3 mb-md-0">
                                    <p><strong>Phonenumber:</strong> {{ detail.phonenumber }}</p>
                                    <p><strong>Payment:</strong> <span
                                            v-if="detail.payment === 'Chuyển khoảng'">STK</span> <span v-else>{{
                                                detail.payment }}</span></p>
                                    <p class="address"><strong>Delivery address:</strong> {{ detail.address }}</p>
                                </div>
                                <div class="col-12 col-md-3 mb-3 mb-md-0">
                                    <p><strong>Count:</strong> {{ detail.count }}</p>
                                    <p><strong>Sum:</strong> {{ formatCurrency((detail.productPrice * detail.count
                                        - detail.productPrice * detail.count * (detail.discount / 100))) }}</p>
                                    <p class="description"><strong>Description:</strong> {{ detail.note }}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="dateRangeConfirmed && !filteredByDateOrders.length">
            <p>Không có đơn hàng trong khoản {{ startDate }} đến {{ endDate }}.</p>
        </div>
        <div v-else>
            <p>Không có đơn hàng nào. </p>
        </div>
    </div>
</template>

<script>
import OrderService from '@/services/order.service';
import StoreService from '@/services/store.service';
import CartService from '@/services/cart.service';
import ProductService from '@/services/product.service';
import PriceService from '@/services/price.service';

export default {
    name: 'RevenueCard',
    props: {
        storeid: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            orders: [],
            orderDetails: {},
            expandedOrderId: null,
            stores: {},
            totalOrders: 0,
            totalOrderDetails: 0,
            totalPrice: 0,
            highestCostDetail: { productName: '', productPrice: 0 },
            mostCountDetail: { productName: '', count: 0 },
            startDate: '',
            endDate: '',
            dateRangeConfirmed: false,
            filteredByDateOrders: [],
        };
    },
    mounted() {
        this.fetchOrders();
        this.fetchStore(this.storeid);
    },
    computed: {
        filteredOrders() {
            return this.orders.filter(order => order.state === 'Received');
        },
        isInvalidDateRange() {
            if (this.startDate && this.endDate) {
                return new Date(this.startDate) > new Date(this.endDate);
            }
            return false;
        }
    },
    methods: {
        async fetchOrders() {
            try {
                const orders = await OrderService.findByStore(this.storeid);
                this.orders = orders;
                await this.fetchOrderDetailsForOrders(orders);
                this.calculateStatistics(this.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        },
        async fetchOrderDetailsForOrders(orders) {
            for (const order of orders) {
                const details = await this.fetchOrderDetails(order._id);
                this.orderDetails[order._id] = details;
            }
        },
        async fetchOrderDetails(orderId) {
            try {
                const cartItems = await CartService.findByOrderId(orderId);
                if (!cartItems || cartItems.length === 0) {
                    console.warn(`No cart items found for order ID: ${orderId}`);
                    return [];
                }
                const details = await Promise.all(cartItems.map(async (cart) => {
                    const product = await ProductService.get(cart.productid);
                    const prices = await PriceService.findByProduct(cart.productid);

                    const applicablePrice = prices.find(price => {
                        const daystart = new Date(price.daystart);
                        const dayend = price.dayend ? new Date(price.dayend) : null;
                        const cartDay = new Date(cart.day);

                        return cartDay >= daystart && (!dayend || cartDay <= dayend);
                    });

                    return {
                        ...cart,
                        productName: product.name,
                        productMaterial: product.material,
                        productSize: product.size,
                        productWarranty: product.warranty,
                        productPicture: product.picture,
                        productPrice: applicablePrice ? applicablePrice.price : 'N/A',
                    };
                }));
                return details;
            } catch (error) {
                console.error('Error fetching order details:', error);
                return [];
            }
        },
        async fetchStore(storeid) {
            try {
                const store = await StoreService.get(storeid);
                this.stores[storeid] = store;
            } catch (error) {
                console.error('Error fetching store:', error);
            }
        },
        calculateStatistics(orders) {
            let totalOrderDetails = 0;
            let highestCostDetail = { productName: '', productPrice: 0 };
            let mostCountDetail = { productName: '', count: 0 };
            this.totalPrice = 0;
            for (const order of orders) {
                this.totalPrice += order.price || 0;
                const details = this.orderDetails[order._id] || [];
                totalOrderDetails += details.length;

                for (const detail of details) {
                    if (detail.productPrice > highestCostDetail.productPrice) {
                        highestCostDetail = detail;
                    }
                    if (detail.count > mostCountDetail.count) {
                        mostCountDetail = detail;
                    }
                }
            }

            this.totalOrders = orders.length;
            this.totalOrderDetails = totalOrderDetails;
            this.highestCostDetail = highestCostDetail;
            this.mostCountDetail = mostCountDetail;
        },
        calculateOrderTotal(orderId) {
            const details = this.orderDetails[orderId] || [];

            return details.reduce((total, detail) => {
                const productTotal = (detail.productPrice * detail.count) - (detail.productPrice * detail.count * (detail.discount / 100));
                return total + productTotal;
            }, 0);
        },
        toggleOrderDetails(orderId) {
            if (this.expandedOrderId === orderId) {
                this.expandedOrderId = null;
            } else {
                this.expandedOrderId = orderId;
                if (!this.orderDetails[orderId]) {
                    this.fetchOrderDetails(orderId);
                }
            }
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(value);
        },
        isDateInRange(date) {
            const orderDate = new Date(date);
            const start = new Date(this.startDate);
            const end = new Date(this.endDate);
            return orderDate >= start && orderDate <= end;
        },
        confirmDateRange() {
            this.dateRangeConfirmed = true;
            this.filteredByDateOrders = this.orders.filter(order => order.state === 'Received' && this.isDateInRange(order.date));
            this.calculateStatistics(this.filteredByDateOrders);
        },
        productPicture(picture) {
            if (picture) {
                return `data:image/jpeg;base64,${picture}`;
            }
            return 'https://th.bing.com/th?id=OIP.XqGBZKSVcAqsEghNyEn1wAHaE8&w=306&h=204&c=8&rs=1&qlt=90&r=0&o=6&dpr=1.1&pid=3.1&rm=2.jpg';
        },
        resetDateRange() {
            this.dateRangeConfirmed = false;
            this.calculateStatistics(this.orders); // Recalculate for all orders
        }
    },

};
</script>

<style scoped>
.date-filters {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #ccc;
}

.form-group {
    margin-bottom: 0;
}

.button-group {
    display: flex;
    gap: 10px;
}

.statistics {
    font-size: 1.1em;
    line-height: 1.5;
}

.statistics p {
    margin-bottom: 0.5em;
}

.order-list {
    padding: 20px;
}

.order-item {
    border: 1px solid #ccc;
    border-radius: 8px;
}

.order-summary {
    margin-bottom: 20px;
}

.order-detail-item {
    background-color: #f9f9f9;
}

.product-image {
    max-width: 100%;
    height: 150px;
}

.description {
    max-height: 80px;
    /* Adjust this value as needed */
    overflow-y: auto;
}

.address {
    max-height: 80px;
    /* Adjust this value as needed */
    overflow-y: auto;
}
</style>