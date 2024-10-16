<template>
    <div class="order-list">
        <div class="date-filters mb-3 p-3 border rounded bg-light">
            <div class="d-flex align-items-center">
                <div class="form-group me-3">
                    <label for="startDate" class="form-label"><strong>Start Date:</strong></label>
                    <input type="date" id="startDate" v-model="startDate" class="form-control">
                </div>
                <div class="form-group me-3">
                    <label for="endDate" class="form-label"><strong>End Date:</strong></label>
                    <input type="date" id="endDate" v-model="endDate" class="form-control">
                </div>
                <div class="button-group d-flex">
                    <button @click="confirmDateRange" class="btn btn-primary me-2">Confirm</button>
                    <button @click="resetDateRange" class="btn btn-secondary">Reset</button>
                </div>
            </div>
            <div v-if="isInvalidDateRange" class="alert alert-danger mt-3">
                Start date cannot be greater than end date, and end date cannot be less than start date.
            </div>
            <div v-if="dateRangeConfirmed && filteredByDateOrders.length" class="alert alert-success mt-3">
                Orders found between {{ startDate }} and {{ endDate }}.
            </div>
        </div>
        <div v-if="!dateRangeConfirmed && filteredOrders.length">
            <div class="card mb-3">
                <div class="card-body">
                    <div class="statistics">
                        <p><strong>Total Orders:</strong> {{ totalOrders }}</p>
                        <p><strong>Total Order Details:</strong> {{ totalOrderDetails }}</p>
                        <p><strong>Total Price:</strong> {{ formatCurrency(totalPrice) }}</p>
                        <p><strong>Highest Cost Order Detail:</strong> {{ highestCostDetail.name }} : {{
                            formatCurrency(highestCostDetail.cost) }}</p>
                        <p><strong>Most Count Order Detail:</strong> {{ mostCountDetail.name }} : {{
                            mostCountDetail.count }}</p>
                    </div>
                </div>
            </div>
            <div v-for="order in filteredOrders" :key="order._id" class="order-item card mb-3">
                <div class="card-body">
                    <div class="order-summary row">
                        <div class="col-md-5">
                            <p><strong>Order ID:</strong> {{ order._id }}</p>
                            <p>
                                <strong>Total Price:</strong>
                                {{ order.price ? formatCurrency(order.price) : 'Chưa thanh toán' }}
                            </p>
                            <p><strong>Date:</strong> {{ order.date }}</p>
                            <p><strong>State:</strong> {{ order.state }}</p>
                        </div>
                        <div class="col-md-5" v-if="stores[order.storeid]">
                            <p><strong>Store name:</strong> {{ stores[order.storeid].name }}</p>
                            <p><strong>Store address:</strong> {{ stores[order.storeid].address }}</p>
                            <p><strong>Store Phonenumber:</strong> {{ stores[order.storeid].phonenumber }}</p>
                            <p><strong>Store Email:</strong> {{ stores[order.storeid].email }}</p>
                        </div>
                        <div class="col-md-2 d-flex align-items-center justify-content-center">
                            <button class="btn btn-primary" @click="toggleOrderDetails(order._id)">
                                {{ expandedOrderId === order._id ? 'Hide Details' : 'Show Details' }}
                            </button>
                        </div>
                    </div>
                    <div v-if="expandedOrderId === order._id" class="order-details mt-3">
                        <ul class="list-unstyled">
                            <li v-for="detail in orderDetails[order._id]" :key="detail._id"
                                class="order-detail-item row mb-3 p-3 rounded shadow-sm">
                                <div class="col-12 col-md-2 mb-3 mb-md-0 d-flex justify-content-center">
                                    <img :src="productPicture(detail.picture)" alt="Product Image"
                                        class="product-image img-fluid" />
                                </div>
                                <div class="col-12 col-md-3 mb-3 mb-md-0">
                                    <p><strong>Name:</strong> {{ detail.name }}</p>
                                    <p><strong>Material:</strong> {{ detail.material }}</p>
                                    <p><strong>Size:</strong> {{ detail.size }}</p>
                                    <p><strong>Warranty:</strong> {{ detail.warranty }}</p>
                                </div>
                                <div class="col-12 col-md-4 mb-3 mb-md-0">
                                    <p><strong>Phonenumber:</strong> {{ detail.phonenumber }}</p>
                                    <p><strong>Payment:</strong>
                                        <span v-if="detail.payment === 'Chuyển khoảng'">STK</span>
                                        <span v-else>{{ detail.payment }}</span>
                                    </p>
                                    <p class="address"><strong>Delivery address:</strong> {{ detail.address }}</p>
                                </div>
                                <div class="col-12 col-md-3 mb-3 mb-md-0">
                                    <p><strong>Count:</strong> {{ detail.count }}</p>
                                    <p><strong>Sum:</strong> {{ formatCurrency(detail.cost) }}</p>
                                    <p class="description"><strong>Description:</strong> {{ detail.description }}</p>
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
                        <p><strong>Total Orders:</strong> {{ totalOrders }}</p>
                        <p><strong>Total Order Details:</strong> {{ totalOrderDetails }}</p>
                        <p><strong>Total Price:</strong> {{ formatCurrency(totalPrice) }}</p>
                        <p><strong>Highest Cost Order Detail:</strong> {{ highestCostDetail.name }} : {{
                            formatCurrency(highestCostDetail.cost) }}</p>
                        <p><strong>Most Count Order Detail:</strong> {{ mostCountDetail.name }} : {{
                            mostCountDetail.count }}</p>
                    </div>
                </div>
            </div>
            <div v-for="order in filteredByDateOrders" :key="order._id" class="order-item card mb-3">
                <div class="card-body">
                    <div class="order-summary row">
                        <div class="col-md-5">
                            <p><strong>Order ID:</strong> {{ order._id }}</p>
                            <p><strong>Total Price:</strong>
                                {{ order.price ? formatCurrency(order.price) : 'Chưa thanh toán' }}</p>
                            <p><strong>Date:</strong> {{ order.date }}</p>
                            <p><strong>State:</strong> {{ order.state }}</p>
                        </div>
                        <div class="col-md-5" v-if="stores[order.storeid]">
                            <p><strong>Store name:</strong> {{ stores[order.storeid].name }}</p>
                            <p><strong>Store address:</strong> {{ stores[order.storeid].address }}</p>
                            <p><strong>Store Phonenumber:</strong> {{ stores[order.storeid].phonenumber }}</p>
                            <p><strong>Store Email:</strong> {{ stores[order.storeid].email }}</p>
                        </div>
                        <div class="col-md-2 d-flex align-items-center justify-content-center">
                            <button class="btn btn-primary" @click="toggleOrderDetails(order._id)">
                                {{ expandedOrderId === order._id ? 'Hide Details' : 'Show Details' }}
                            </button>
                        </div>
                    </div>
                    <div v-if="expandedOrderId === order._id" class="order-details mt-3">
                        <ul class="list-unstyled">
                            <li v-for="detail in orderDetails[order._id]" :key="detail._id"
                                class="order-detail-item row mb-3 p-3 rounded shadow-sm">
                                <div class="col-12 col-md-2 mb-3 mb-md-0 d-flex justify-content-center">
                                    <img :src="productPicture(detail.picture)" alt="Product Image"
                                        class="product-image img-fluid" />
                                </div>
                                <div class="col-12 col-md-3 mb-3 mb-md-0">
                                    <p><strong>Name:</strong> {{ detail.name }}</p>
                                    <p><strong>Material:</strong> {{ detail.material }}</p>
                                    <p><strong>Size:</strong> {{ detail.size }}</p>
                                    <p><strong>Warranty:</strong> {{ detail.warranty }}</p>
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
                                    <p><strong>Sum:</strong> {{ formatCurrency(detail.cost) }}</p>
                                    <p class="description"><strong>Description:</strong> {{ detail.description }}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="dateRangeConfirmed && !filteredByDateOrders.length">
            <p>No orders found between {{ startDate }} and {{ endDate }}.</p>
        </div>
        <div v-else>
            <p>No orders found for this store. </p>
        </div>
    </div>
</template>

<script>
import OrderService from '@/services/order.service';
import OrderDetailService from '@/services/orderdetail.service';
import StoreService from '@/services/store.service';

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
            stores: {}, // Assuming you have a way to fetch store details
            totalOrders: 0,
            totalOrderDetails: 0,
            totalPrice: 0,
            highestCostDetail: { name: '', cost: 0 },
            mostCountDetail: { name: '', count: 0 },
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
                const details = await OrderDetailService.findByOrder(orderId);
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
            let highestCostDetail = { name: '', cost: 0 };
            let mostCountDetail = { name: '', count: 0 };
            this.totalPrice = 0;
            for (const order of orders) {
                this.totalPrice += order.price || 0;
                const details = this.orderDetails[order._id] || [];
                totalOrderDetails += details.length;

                for (const detail of details) {
                    if (detail.cost > highestCostDetail.cost) {
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