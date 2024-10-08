<template>
    <div class="order-list">
        <div v-for="order in orders" :key="order._id" class="order-item card mb-3">
            <div class="card-body">
                <div class="order-summary row">
                    <div class="col-md-5">
                        <p><strong>Order ID:</strong> {{ order._id }}</p>
                        <p>
                            <strong>Total Price:</strong>
                            {{ order.price ? formatCurrency(order.price) : 'Chưa thanh toán' }}
                        </p>
                        <p><strong>Date:</strong> {{ order.date }}</p>
                        <p><strong>State:</strong> {{  order.state }}</p>
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
                            <div class="col-12 col-md-3 mb-3 mb-md-0  d-flex justify-content-center">
                                <img :src="productPicture(detail.picture)" alt="Product Image"
                                    class="product-image img-fluid" />
                            </div>
                            <div class="col-12 col-md-3 mb-3 mb-md-0">
                                <p><strong>Name:</strong> {{ detail.name }}</p>
                                <p><strong>Material:</strong> {{ detail.material }}</p>
                                <p><strong>Size:</strong> {{ detail.size }}</p>
                                <p><strong>Warranty:</strong> {{ detail.warranty }}</p>

                            </div>
                            <div class="col-12 col-md-3 mb-3 mb-md-0">
                                <p><strong>Phonenumber:</strong> {{ detail.phonenumber }}</p>
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
</template>

<script>
import { reactive } from 'vue';
import LocalStorageHelper from '@/services/local.service';
import OrderService from '@/services/order.service';
import OrderDetailService from '@/services/orderdetail.service';
import StoreService from '@/services/store.service';
export default {
    data() {
        return {
            orders: [],
            orderDetails: reactive({}),
            stores: reactive({}),
            expandedOrderId: null,
        };
    },
    async created() {
        await this.fetchOrders();
    },
    methods: {
        async fetchOrders() {
            const userId = LocalStorageHelper.getItem('id');
            if (userId) {
                try {
                    this.orders = await OrderService.findByUser(userId);
                    await this.fetchStores();
                } catch (error) {
                    console.error('Error fetching orders:', error);
                }
            }
        },
        async fetchStores() {
            for (const order of this.orders) {
                if (order.storeid && !this.stores[order.storeid]) {
                    try {
                        const store = await StoreService.get(order.storeid);
                        this.stores[order.storeid] = store;
                    } catch (error) {
                        console.error('Error fetching store:', error);
                    }
                }
            }
        },
        async fetchOrderDetails(orderId) {
            try {
                const details = await OrderDetailService.findByOrder(orderId);
                this.orderDetails[orderId] = details;
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
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
        productPicture(picture) {
            if (picture) {
                return `data:image/jpeg;base64,${picture}`;
            }
            return 'https://th.bing.com/th?id=OIP.XqGBZKSVcAqsEghNyEn1wAHaE8&w=306&h=204&c=8&rs=1&qlt=90&r=0&o=6&dpr=1.1&pid=3.1&rm=2.jpg';
        },
    },
};
</script>

<style scoped>
.order-item {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.order-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.order-details {
    margin-top: 10px;
}

.order-detail-item {
    border: 1px solid #ddd;
    padding: 10px;
    background-color: #f8f9fa;
}

.product-image {
    max-width: 100%;
    height: 150px;
}

.description {
    max-height: 60px;
    /* Adjust this value as needed */
    overflow-y: auto;
}

.address {
    max-height: 100px;
    /* Adjust this value as needed */
    overflow-y: auto;
}
</style>