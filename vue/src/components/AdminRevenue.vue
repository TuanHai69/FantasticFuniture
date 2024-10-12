<template>
    <div class="admin-revenue p-3">
        <h2>Admin Revenue</h2>
        <div v-if="isLoading" class="loading">
            Loading data...
        </div>
        <div v-else>
            <div class="overall-stats mb-4 p-3 border rounded bg-light">
                <h3>Overall Statistics</h3>
                <p><strong>Total Revenue:</strong> {{ formatCurrency(totalRevenue) }}</p>
                <p><strong>Highest Revenue Order:</strong> {{ highestRevenueOrder ?
                    highestRevenueOrder.name + ': ' + formatCurrency(highestRevenueOrder.price) : 'N/A' }}</p>
                <p><strong>Highest Revenue Store:</strong>
                    {{ highestRevenueStore ? highestRevenueStore.name + ' (' +
                        formatCurrency(highestRevenueStore.revenue) + ')' : 'N/A' }}</p>
                <p><strong>Highest Item Count:</strong> {{ highestItemCountStore + ': ' + highestItemCount }}</p>
            </div>
            <div v-for="store in stores" :key="store._id" class="store-section mb-4">
                <div class="card">
                    <div class="card-body">
                        <h3>{{ store.name }}</h3>
                        <p><strong>Address:</strong> {{ store.address }}</p>
                        <p><strong>Phone number:</strong> {{ store.phonenumber }}</p>
                        <p><strong>Email:</strong> {{ store.email }}</p>
                        <p><strong>Total Revenue:</strong> {{ formatCurrency(store.revenue || 0) }}</p>
                        <button @click="toggleStoreOrders(store._id)" class="btn btn-primary">
                            {{ expandedStoreId === store._id ? 'Hide Orders' : 'Show Orders' }}
                        </button>
                        <div v-if="expandedStoreId === store._id && storeOrders[store._id]">
                            <div v-for="order in storeOrders[store._id]" :key="order._id" class="order-card card mt-3">
                                <div class="card-body">
                                    <div class="order-summary row">
                                        <div class="col-md-5">
                                            <p><strong>Order ID:</strong> {{ order._id }}</p>
                                            <p><strong>Total Price:</strong> {{ order.price ?
                                                formatCurrency(order.price) : 'Unpaid' }}</p>
                                            <p><strong>Date:</strong> {{ order.date }}</p>
                                            <p><strong>State:</strong> {{ order.state }}</p>
                                        </div>
                                        <div class="col-md-5">
                                            <p><strong>Store name:</strong> {{ store.name }}</p>
                                            <p><strong>Store address:</strong> {{ store.address }}</p>
                                            <p><strong>Store Phonenumber:</strong> {{ store.phonenumber }}</p>
                                            <p><strong>Store Email:</strong> {{ store.email }}</p>
                                        </div>
                                        <div class="col-md-2 d-flex align-items-center justify-content-center">
                                            <button @click="toggleOrderDetails(order._id)" class="btn btn-secondary">
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
                                                            v-if="detail.payment === 'bank_transfer'">STK</span> <span
                                                            v-else>{{ detail.payment }}</span></p>
                                                    <p class="address"><strong>Delivery address:</strong> {{
                                                        detail.address }}</p>
                                                </div>
                                                <div class="col-12 col-md-3 mb-3 mb-md-0">
                                                    <p><strong>Count:</strong> {{ detail.count }}</p>
                                                    <p><strong>Sum:</strong> {{ formatCurrency(detail.cost) }}</p>
                                                    <p class="description"><strong>Description:</strong> {{
                                                        detail.description }}</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="expandedStoreId === store._id">
                            Loading orders...
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import StoreService from '@/services/store.service';
import OrderService from '@/services/order.service';
import OrderDetailService from '@/services/orderdetail.service';

export default {
    name: 'AdminRevenue',
    data() {
        return {
            stores: [],
            storeOrders: {},
            orderDetails: {},
            expandedStoreId: null,
            expandedOrderId: null,
            isLoading: true,
            totalRevenue: 0,
            highestRevenueOrder: null,
            highestRevenueStore: null,
            highestItemCount: 0,
            highestItemCountStore: null,
        };
    },
    async mounted() {
        await this.fetchStores();
        await this.fetchAllOrdersAndDetails();
        this.isLoading = false;
        this.calculateOverallStatistics();
    },
    methods: {
        async fetchStores() {
            try {
                const stores = await StoreService.getAll();
                this.stores = stores;
            } catch (error) {
                console.error('Error fetching stores:', error);
            }
        },
        async fetchAllOrdersAndDetails() {
            const orderPromises = this.stores.map(store => this.fetchOrdersForStore(store._id));
            await Promise.all(orderPromises);
        },
        async fetchOrdersForStore(storeId) {
            try {
                const orders = await OrderService.findByStore(storeId);
                this.storeOrders = { ...this.storeOrders, [storeId]: orders };
                const orderDetailPromises = orders.map(order => this.fetchOrderDetails(order._id));
                await Promise.all(orderDetailPromises);
            } catch (error) {
                console.error(`Error fetching orders for store ${storeId}:`, error);
            }
        },
        async fetchOrderDetails(orderId) {
            try {
                const details = await OrderDetailService.findByOrder(orderId);
                this.orderDetails = { ...this.orderDetails, [orderId]: details };
            } catch (error) {
                console.error(`Error fetching order details for order ${orderId}:`, error);
            }
        },
        toggleStoreOrders(storeId) {
            if (this.expandedStoreId === storeId) {
                this.expandedStoreId = null;
            } else {
                this.expandedStoreId = storeId;
            }
        },
        toggleOrderDetails(orderId) {
            if (this.expandedOrderId === orderId) {
                this.expandedOrderId = null;
            } else {
                this.expandedOrderId = orderId;
            }
        },
        calculateStoreRevenue(storeId) {
            const orders = this.storeOrders[storeId] || [];
            let storeRevenue = 0;
            let highestOrderRevenue = 0;
            let totalItemCount = 0;

            for (const order of orders) {
                storeRevenue += order.price || 0;
                if (order.price > highestOrderRevenue) {
                    highestOrderRevenue = order.price;
                }
                const details = this.orderDetails[order._id] || [];
                for (const detail of details) {
                    totalItemCount += detail.count;
                }
            }

            this.stores = this.stores.map(store =>
                store._id === storeId ? { ...store, revenue: storeRevenue, itemCount: totalItemCount } : store
            );
            this.totalRevenue += storeRevenue;

            if (!this.highestRevenueOrder || highestOrderRevenue > this.highestRevenueOrder.price) {
                this.highestRevenueOrder = orders.find(order => order.price === highestOrderRevenue);
                this.highestRevenueOrder.name = this.stores.find(store => store._id === storeId).name
            }
            if (!this.highestRevenueStore || storeRevenue > this.highestRevenueStore.revenue) {
                this.highestRevenueStore = this.stores.find(store => store.revenue === storeRevenue);
            }
            if (totalItemCount > this.highestItemCount) {
                this.highestItemCount = totalItemCount;
                this.highestItemCountStore = this.stores.find(store => store._id === storeId).name
            }
        },
        calculateOverallStatistics() {
            this.stores.forEach(store => {
                this.calculateStoreRevenue(store._id);
            });
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(value);
        },
        productPicture(picture) {
            if (picture) {
                return `data:image/jpeg;base64,${picture}`;
            }
            return 'https://th.bing.com/th?id=OIP.XqGBZKSVcAqsEghNyEn1wAHaE8&w=306&h=204&c=8&rs=1&qlt=90&r=0&o=6&dpr=1.1&pid=3.1&rm=2.jpg';
        }
    }
};
</script>



<style scoped>
.admin-revenue {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    border: 1px solid #ccc;
}

.loading {
    font-size: 1.2em;
    font-weight: bold;
}

.store-section {
    margin-bottom: 20px;
}

.order-card {
    background-color: #fff;
    border: 1px solid #ddd;
}

.card-body {
    padding: 10px;
}

.order-summary p,
.statistics p {
    margin-bottom: 0.5em;
}

.order-detail-item {
    background-color: #f9f9f9;
}

.product-image {
    max-width: 100%;
    height: 150px;
}

.description,
.address {
    max-height: 80px;
    overflow-y: auto;
}
</style>
