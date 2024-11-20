<template>
    <div class="admin-revenue p-3">
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="overall-stats p-3 border rounded bg-light">
                    <h3>thống kê</h3>
                    <p><strong>Tổng doanh thu:</strong> {{ formatCurrency(totalRevenue) }}</p>
                    <p><strong>Đơn hàng giá trị lớn nhất:</strong> {{ highestRevenueOrder ?
                        highestRevenueOrder.storeName +
                        ' (' + formatCurrency(highestRevenueOrder.price) + ')' : 'Chưa có đơn hàng trong yêu cầu' }}</p>
                    <p><strong>Cửa hàng danh thu lớn nhất:</strong> {{ highestRevenueStore ? highestRevenueStore.name +
                        ' ('
                        + formatCurrency(highestRevenueStore.revenue) + ')' : 'Chưa có đơn hàng trong yêu cầu' }}</p>
                    <p><strong>Số lượng sản phẩm nhiều nhất:</strong>
                        {{ highestRevenueOrder ? highestRevenueOrder.storeName +
                            '(' + highestItemCount + ')' : 'Chưa có đơn hàng trong yêu cầu' }}</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="date-filters p-3 border rounded bg-light">
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
                    <div v-if="isInvalidDateRange" class="alert alert-danger mt-3">
                        Ngày bắt đầu không thể sau ngày kết thúc và ngược lại
                    </div>
                    <div v-if="dateRangeConfirmed" class="alert alert-success mt-3">
                        Danh sách đơn hàng tìm được trong khoảng {{ startDate }} đến {{ endDate }}.
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isLoading" class="loading">
            Loading data...
        </div>
        <div v-else>
            <div v-for="store in stores" :key="store._id" class="store-section mb-4">
                <div class="card">
                    <div class="card-body">
                        <h3>{{ store.name }}</h3>
                        <p><strong>Địa chỉ:</strong> {{ store.address }}</p>
                        <p><strong>Số điện thoại:</strong> {{ store.phonenumber }}</p>
                        <p><strong>Email:</strong> {{ store.email }}</p>
                        <p><strong>Tổng doanh thu:</strong>
                            {{ (dateRangeConfirmed
                                ? (filteredStoreRevenues[store._id] != null && filteredStoreRevenues[store._id] !== ''
                                    ? formatCurrency(filteredStoreRevenues[store._id])
                                    : 'Chưa có đơn hàng')
                                : (storeRevenues[store._id] != null && storeRevenues[store._id] !== ''
                                    ? formatCurrency(storeRevenues[store._id])
                                    : 'Chưa có đơn hàng')) }}
                        </p>
                        <button @click="toggleStoreOrders(store._id)" class="btn btn-primary">
                            {{ expandedStoreId === store._id ? 'Ẩn đơn hàng' : 'Hiển thị đơn hàng' }}
                        </button>
                        <div
                            v-if="expandedStoreId === store._id && (dateRangeConfirmed ? filteredStoreOrders[store._id] : storeOrders[store._id])">
                            <div v-for="order in (dateRangeConfirmed ? filteredStoreOrders[store._id] : storeOrders[store._id])"
                                :key="order._id" class="order-card card mt-3">
                                <div class="card-body">
                                    <div class="order-summary row">
                                        <div class="col-md-5">
                                            <p><strong>Mã đơn hàng:</strong> {{ order._id }}</p>
                                            <p><strong>Tổng tiền:</strong> {{ order.price ?
                                                formatCurrency(order.price) : 'Unpaid' }}</p>
                                            <p><strong>Ngày thành lập:</strong> {{ order.date }}</p>
                                            <p><strong>Trạng thái:</strong> {{ order.state }}</p>
                                        </div>
                                        <div class="col-md-5">
                                            <p><strong>Tên cửa hàng:</strong> {{ store.name }}</p>
                                            <p><strong>Địa chỉ cửa hàng:</strong> {{ store.address }}</p>
                                            <p><strong>Số điện thoại cửa hàng:</strong> {{ store.phonenumber }}</p>
                                            <p><strong>Email cửa hàng:</strong> {{ store.email }}</p>
                                        </div>
                                        <div class="col-md-2 d-flex align-items-center justify-content-center">
                                            <button @click="toggleOrderDetails(order._id)" class="btn btn-secondary">
                                                {{ expandedOrderId === order._id ? 'Ẩn chi tiết' : 'Hiện chi tiết' }}
                                            </button>
                                        </div>
                                    </div>
                                    <div v-if="expandedOrderId === order._id" class="order-details mt-3">
                                        <ul class="list-unstyled">
                                            <li v-for="detail in orderDetails[order._id]" :key="detail._id"
                                                class="order-detail-item row mb-3 p-3 rounded shadow-sm">
                                                <div class="col-12 col-md-2 mb-3 mb-md-0 d-flex justify-content-center">
                                                    <img :src="productPicture(detail.productPicture)"
                                                        alt="Product Image" class="product-image img-fluid" />
                                                </div>
                                                <div class="col-12 col-md-3 mb-3 mb-md-0">
                                                    <p><strong>Tên sản phẩm:</strong> {{ detail.productName }}</p>
                                                    <p><strong>Vật liệu:</strong> {{ detail.productMaterial }}</p>
                                                    <p><strong>Kích thước:</strong> {{ detail.productSize }}</p>
                                                    <p><strong>Bảo hàng:</strong> {{ detail.productWarranty }}</p>
                                                </div>
                                                <div class="col-12 col-md-4 mb-3 mb-md-0">
                                                    <p><strong>Phonenumber:</strong> {{ detail.phonenumber }}</p>
                                                    <p><strong>Payment:</strong> <span
                                                            v-if="detail.payment === 'Chuyển khoảng'"> Đã trả bằng
                                                            zalopay</span> <span v-else>{{ detail.payment }}</span></p>
                                                    <p class="address"><strong>Địa chỉ giao hàng:</strong> {{
                                                        detail.address }}</p>
                                                </div>
                                                <div class="col-12 col-md-3 mb-3 mb-md-0">
                                                    <p><strong>Số lượng:</strong> {{ detail.count }}</p>
                                                    <p><strong>Tổng tiền:</strong> {{
                                                        formatCurrency((detail.productPrice * detail.count
                                                        - detail.productPrice * detail.count * (detail.discount / 100)))
                                                        }}</p>
                                                    <p class="description"><strong>Description:</strong> {{
                                                        detail.note }}</p>
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
import CartService from '@/services/cart.service';
import ProductService from '@/services/product.service';
import PriceService from '@/services/price.service';

export default {
    name: 'AdminRevenue',
    data() {
        return {
            stores: [],
            storeOrders: {},
            orderDetails: {},
            filteredStoreOrders: {},
            expandedStoreId: null,
            expandedOrderId: null,
            isLoading: true,
            totalRevenue: 0,
            highestRevenueOrder: null,
            highestRevenueStore: null,
            highestItemCount: 0,
            startDate: '',
            endDate: '',
            dateRangeConfirmed: false,
            isInvalidDateRange: false,
            storeRevenues: {},
            filteredStoreRevenues: {},

        };
    },
    async mounted() {
        await this.fetchStores();
        await this.fetchAllOrdersAndDetails();
        this.isLoading = false;
        this.calculateOverallStatistics();
    },
    computed: {
        isInvalidDateRange() {
            if (this.startDate && this.endDate) {
                return new Date(this.startDate) > new Date(this.endDate);
            }
            return false;
        }
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

                for (const order of orders) {
                    const details = await this.fetchOrderDetails(order._id);
                    this.orderDetails[order._id] = details;
                }
            } catch (error) {
                console.error(`Error fetching orders for store ${storeId}:`, error);
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
        calculateOverallStatistics() {
            let totalRevenue = 0;
            let highestRevenueOrder = null;
            let highestRevenueStore = null;
            let highestItemCount = 0;

            const stores = this.dateRangeConfirmed ? this.getStoresWithFilteredOrders() : this.stores;

            stores.forEach(store => {
                let storeRevenue = 0;
                let highestOrderRevenue = 0;
                let totalItemCount = 0;

                const orders = this.dateRangeConfirmed ? this.filteredStoreOrders[store._id] : this.storeOrders[store._id];
                orders.forEach(order => {
                    storeRevenue += order.price || 0;
                    if (order.price > highestOrderRevenue) {
                        highestOrderRevenue = order.price;
                        highestRevenueOrder = { ...order, storeName: store.name };
                    }
                    const details = this.orderDetails[order._id] || [];
                    details.forEach(detail => {
                        totalItemCount += detail.count;
                    });
                });


                if (this.dateRangeConfirmed) {
                    this.filteredStoreRevenues[store._id] = storeRevenue;  // Update filtered revenues
                } else {
                    this.storeRevenues[store._id] = storeRevenue;  // Update regular revenues
                }

                if (!highestRevenueStore || storeRevenue > highestRevenueStore.revenue) {
                    highestRevenueStore = { ...store, revenue: storeRevenue };
                }
                if (totalItemCount > highestItemCount) {
                    highestItemCount = totalItemCount;
                }

                store.revenue = storeRevenue;
                store.itemCount = totalItemCount;
                totalRevenue += storeRevenue;
            });

            this.totalRevenue = totalRevenue;
            this.highestRevenueOrder = highestRevenueOrder;
            this.highestRevenueStore = highestRevenueStore;
            this.highestItemCount = highestItemCount;
        },

        getStoresWithFilteredOrders() {
            return this.stores.filter(store => this.filteredStoreOrders[store._id]);
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
        confirmDateRange() {
            if (this.isInvalidDateRange) return;

            this.dateRangeConfirmed = true;
            this.filteredStoreOrders = {};

            this.stores.forEach(store => {
                const filteredOrders = this.storeOrders[store._id].filter(order => this.isDateInRange(order.date));
                if (filteredOrders.length) {
                    this.filteredStoreOrders[store._id] = filteredOrders;
                }
            });

            this.calculateOverallStatistics();
        },
        resetDateRange() {
            this.startDate = '';
            this.endDate = '';
            this.dateRangeConfirmed = false;
            this.filteredStoreOrders = this.storeOrders
            this.isInvalidDateRange = false;
            this.calculateOverallStatistics();
        },
        isDateInRange(date) {
            const orderDate = new Date(date);
            const start = new Date(this.startDate);
            const end = new Date(this.endDate);
            return orderDate >= start && orderDate <= end;
        },

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

.row>.col-md-6 {
    padding-left: 15px;
    padding-right: 15px;
}

.form-group {
    margin-bottom: 10px;
}

.button-group {
    display: flex;
    gap: 10px;
}
</style>
