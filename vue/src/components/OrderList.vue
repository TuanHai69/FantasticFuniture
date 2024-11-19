<template>
    <div class="order-list">
        <div v-for="order in orders" :key="order._id" class="order-item card mb-3">
            <div class="card-body">
                <div class="order-summary row">
                    <div class="col-md-5">
                        <p><strong>Mã đơn hàng: </strong> MD{{ order._id }}</p>
                        <p>
                            <strong>Tổng giá: </strong>
                            {{ orderTotals[order._id] ? formatCurrency(orderTotals[order._id]) : 'Chưa thanh toán' }}
                        </p>
                        <p>
                            <strong>Đã thanh toán: </strong>
                            {{ orderPaymentTotals[order._id] ? formatCurrency(orderPaymentTotals[order._id].transfer) :
                                '0' }}
                        </p>
                        <p>
                            <strong>Chưa thanh toán:</strong>
                            {{ orderPaymentTotals[order._id] ? formatCurrency(orderPaymentTotals[order._id].nonTransfer)
                                : '0' }}
                        </p>
                        <p><strong>Ngày đặt hàng:</strong> {{ order.date }}</p>
                    </div>
                    <div class="col-md-5" v-if="stores[order.storeid]">
                        <p><strong>Tên cửa hàng:</strong> {{ stores[order.storeid].name }}</p>
                        <p><strong>Địa chỉ cửa hàng:</strong> {{ stores[order.storeid].address }}</p>
                        <p><strong>Điện thoại cửa hàng:</strong> {{ stores[order.storeid].phonenumber }}</p>
                        <p><strong>Email cửa hàng:</strong> {{ stores[order.storeid].email }}</p>
                        <p><strong>Trạng thái:</strong> {{ order.state }} ||
                            <button v-if="showConfirmButton(order)" class="btn btn-success ml-2"
                                @click="updateOrderState(order._id, 'prepare for delivery')">Xác nhận</button>
                            <button v-if="showDeliveryButton(order)" class="btn btn-warning ml-2"
                                @click="updateOrderState(order._id, 'Shipping')">Giao hàng</button>
                            <button v-if="showReceivedButton(order)" class="btn btn-info ml-2"
                                @click="updateOrderState(order._id, 'Received')">Đã nhận hàng</button>
                        </p>
                    </div>
                    <div class="col-md-2 d-flex align-items-center justify-content-center">
                        <button class="btn btn-primary" @click="toggleOrderDetails(order._id)">
                            {{ expandedOrderId === order._id ? 'Ẩn Chi tiết' : 'Hiện Chi tiết' }}
                        </button>
                    </div>
                </div>
                <div v-if="expandedOrderId === order._id" class="order-details mt-3">
                    <ul class="list-unstyled">
                        <li v-for="detail in orderDetails[order._id]" :key="detail._id"
                            class="order-detail-item row mb-3 p-3 rounded shadow-sm">
                            <div class="col-12 col-md-2 mb-3 mb-md-0  d-flex justify-content-center">
                                <img :src="productPicture(detail.productPicture)" alt="Product Image"
                                    class="product-image img-fluid" />
                            </div>
                            <div class="col-12 col-md-3 mb-3 mb-md-0">
                                <p><strong>Tên sản phẩm:</strong> {{ detail.productName }}</p>
                                <p><strong>Vặt liệu:</strong> {{ detail.productMaterial }}</p>
                                <p><strong>Kích thước:</strong> {{ detail.productSize }}</p>
                                <p><strong>Bảo hành:</strong> {{ detail.productWarranty }}</p>

                            </div>
                            <div class="col-12 col-md-4 mb-3 mb-md-0">
                                <p><strong>Số điện thoại:</strong> {{ detail.phonenumber }}</p>
                                <p><strong>Phương thức trả:</strong>
                                    <span v-if="detail.payment === 'Chuyển khoảng'"> Đã trả bằng zalopay</span>
                                    <span v-else>{{ detail.payment }}</span>
                                </p>
                                <p class="address"><strong>Địa chỉ giao hàng:</strong> {{ detail.address }}</p>

                            </div>
                            <div class="col-12 col-md-3 mb-3 mb-md-0">
                                <p><strong>Số lượng:</strong> {{ detail.count }}</p>
                                <p><strong>Tổng giá:</strong> {{ formatCurrency(((detail.productPrice * detail.count) -
                                    (detail.productPrice * detail.count * (detail.discount / 100)))) }}</p>
                                <p class="description"><strong>Mô tả:</strong> {{ detail.note }}</p>
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
import StoreService from '@/services/store.service';
import AccountsService from "@/services/accounts.service";
import CartService from '@/services/cart.service';
import ProductService from '@/services/product.service';
import PriceService from '@/services/price.service';

export default {
    props: {
        storeid: {
            type: String,
            default: null,
        },
    },
    data() {
        return {
            orders: [],
            orderDetails: reactive({}),
            stores: reactive({}),
            expandedOrderId: null,
            orderTotals: reactive({}),
            orderPaymentTotals: reactive({}),
        };
    },
    async created() {
        await this.fetchOrders();
        await this.checkrole();

    },
    methods: {
        async checkrole() {
            const temp = LocalStorageHelper.getItem('id');
            const response = await AccountsService.get(temp);
            LocalStorageHelper.clear();
            LocalStorageHelper.setItem('id', response._id);
            LocalStorageHelper.setItem('role', response.role);
        },
        async fetchOrders() {
            try {
                if (this.storeid) {
                    this.orders = await OrderService.findByStore(this.storeid);
                } else {
                    const userId = LocalStorageHelper.getItem('id');
                    if (userId) {
                        this.orders = await OrderService.findByUser(userId);
                    }
                }
                await this.fetchStores();
                await this.calculateAllOrderTotals();
            } catch (error) {
                console.error('Error fetching orders:', error);
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
                const cartItems = await CartService.findByOrderId(orderId);
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
                this.orderDetails[orderId] = details;
                this.orderTotals[orderId] = this.calculateOrderTotal(orderId);
                this.orderPaymentTotals[orderId] = this.calculateOrderPaymentTotals(orderId);
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        },
        async calculateAllOrderTotals() {
            for (const order of this.orders) {
                await this.fetchOrderDetails(order._id);
            }
        },
        calculateOrderTotal(orderId) {
            const details = this.orderDetails[orderId] || [];

            return details.reduce((total, detail) => {
                const productTotal = (detail.productPrice * detail.count) - (detail.productPrice * detail.count * (detail.discount / 100));
                return total + productTotal;
            }, 0);
        },
        calculateOrderPaymentTotals(orderId) {
            const details = this.orderDetails[orderId] || [];
            const paymentTotals = { transfer: 0, nonTransfer: 0 };
            details.forEach(detail => {
                const productTotal = (detail.productPrice * detail.count) - (detail.productPrice * detail.count * (detail.discount / 100));
                if (detail.payment === 'Chuyển khoảng') {
                    paymentTotals.transfer += productTotal;
                } else {
                    paymentTotals.nonTransfer += productTotal;
                }
            }); return paymentTotals;
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
        async updateOrderState(orderId, newState) {
            try {
                await OrderService.update(orderId, { state: newState });
                alert(`Order state updated to ${newState}`);
                await this.fetchOrders();
            } catch (error) {
                console.error('Error updating order state:', error);
                alert('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.');
            }
        },
        showConfirmButton(order) {
            const role = LocalStorageHelper.getItem('role');
            return role === 'storeowner' && order.state === 'Chờ xác nhận';
        },
        showDeliveryButton(order) {
            const role = LocalStorageHelper.getItem('role');
            return role === 'storeowner' && order.state === 'prepare for delivery';
        },
        showReceivedButton(order) {
            const userId = LocalStorageHelper.getItem('id');
            return order.state === 'Shipping' && order.userid === userId;
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
    max-height: 80px;
    overflow-y: auto;
}

.address {
    max-height: 80px;
    overflow-y: auto;
}
</style>