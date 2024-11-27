<template>
    <div class="container  bg-danger">
        <h1 class="text-white">Giỏ hàng</h1>
        <hr>
        <div v-if="availableCodes.length" class="discount-codes mb-4">
            <div class="card">
                <div class="card-header bg-info text-white">
                    <h2>Mã giảm giá khả dụng</h2>
                </div>
                <div class="card-body">
                    <table class="table table-hover">
                        <thead class="thead-dark">
                            <tr>
                                <th scope="col">Mã giảm giá</th>
                                <th scope="col">Phần trăm giảm</th>
                                <th scope="col">Ngày bắt đầu</th>
                                <th scope="col">Ngày kết thúc</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="code in availableCodes" :key="code._id">
                                <td>{{ code.code }}</td>
                                <td>{{ code.percent }}%</td>
                                <td>{{ new Date(code.start).toLocaleDateString() }}</td>
                                <td>{{ new Date(code.end).toLocaleDateString() }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <hr>
        <ul v-if="carts.length" class="list-unstyled">
            <li v-for="cart in carts" :key="cart.id" class="cart-item row mb-3 p-3 rounded shadow-sm">
                <div class="col-12 col-md-3 mb-3 mb-md-0">
                    <img :src="productPicture(cart.product.picture)" alt="Product Image"
                        class="product-image img-fluid" />
                </div>
                <div class="col-12 col-md-5 mb-3 mb-md-0">
                    <p><strong>Tên sản phẩm:</strong> {{ cart.product.name }}</p>
                    <p><strong>Vật liệu:</strong> {{ cart.product.material }}</p>
                    <p><strong>Kích thước:</strong> {{ cart.product.size }}</p>
                    <p><strong>Bảo hành:</strong> {{ cart.product.warranty }}</p>
                    <p><strong>Mô tả:</strong> {{ cart.product.description }}</p>
                </div>
                <div class="col-12 col-md-2 mb-3 mb-md-0">
                    <p><strong>Số lượng:</strong> {{ cart.count }}</p>
                    <p>
                        <strong>Giá:</strong>
                        {{ formatCurrency(calculateCost(cart.price, cart.discount)) }}
                    </p>
                    <p><strong>Tổng:</strong>
                        {{ formatCurrency(cart.count * calculateCost(cart.price, cart.discount)) }}
                    </p>
                </div>
                <div class="col-12 col-md-2 d-flex align-items-center justify-content-evenly">
                    <button @click="checkout(cart)" class="btn btn-primary">Thanh toán</button>
                    <button @click="deleteCartItem(cart)" class="btn btn-danger ml-2 bg-danger">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </li>
        </ul>
        <p v-else>No items in cart.</p>
    </div>
</template>

<script>
import CartService from '@/services/cart.service';
import ProductService from '@/services/product.service';
import PriceService from '@/services/price.service';
import LocalStorageHelper from '@/services/local.service';
import io from 'socket.io-client';
import CodedService from '@/services/coded.service';
import CodeuseService from '@/services/codeuse.service';
export default {
    data() {
        return {
            carts: [],
            availableCodes: [],
        };
    },

    mounted() {
        const socket = io('http://localhost:3000');
        socket.on('createCart', async (data) => {
            console.log(data);
            const userId = LocalStorageHelper.getItem('id');
            if (userId) {
                try {
                    const carts = await CartService.findByUser(userId);
                    for (const cart of carts) {
                        if (cart.state !== 'done') {
                            const product = await ProductService.get(cart.productid);
                            const priceData = await PriceService.findByProductWithNoEndDate(cart.productid);
                            if (priceData.length > 0) {
                                cart.price = priceData[0].price;
                                cart.discount = priceData[0].discount;
                            } else {
                                cart.price = null;
                                cart.discount = null;
                            }
                            cart.product = product;
                        }
                    }
                    this.carts = carts.filter(cart => cart.state !== 'done');
                } catch (error) {
                    console.error('Error fetching cart or product data:', error);
                }
            }
        });
        socket.on('deleteCart', async (data) => {
            const userId = LocalStorageHelper.getItem('id');
            if (userId) {
                try {
                    const carts = await CartService.findByUser(userId);
                    for (const cart of carts) {
                        if (cart.state !== 'done') {
                            const product = await ProductService.get(cart.productid);
                            const priceData = await PriceService.findByProductWithNoEndDate(cart.productid);
                            if (priceData.length > 0) {
                                cart.price = priceData[0].price;
                                cart.discount = priceData[0].discount;
                            } else {
                                cart.price = null;
                                cart.discount = null;
                            }
                            cart.product = product;
                        }
                    }
                    this.carts = carts.filter(cart => cart.state !== 'done');
                } catch (error) {
                    console.error('Error fetching cart or product data:', error);
                }
            }
        });
        socket.on('updateCart', async (data) => {
            const userId = LocalStorageHelper.getItem('id');
            if (userId) {
                try {
                    const carts = await CartService.findByUser(userId);
                    for (const cart of carts) {
                        if (cart.state !== 'done') {
                            const product = await ProductService.get(cart.productid);
                            const priceData = await PriceService.findByProductWithNoEndDate(cart.productid);
                            if (priceData.length > 0) {
                                cart.price = priceData[0].price;
                                cart.discount = priceData[0].discount;
                            } else {
                                cart.price = null;
                                cart.discount = null;
                            }
                            cart.product = product;
                        }
                    }
                    this.carts = carts.filter(cart => cart.state !== 'done');
                } catch (error) {
                    console.error('Error fetching cart or product data:', error);
                }
            }
        });
    },
    async created() {
        const userId = LocalStorageHelper.getItem('id');
        if (userId) {
            try {
                await this.fetchAvailableCodes();
                const carts = await CartService.findByUser(userId);
                for (const cart of carts) {
                    if (cart.state !== 'done') {
                        const product = await ProductService.get(cart.productid);
                        const priceData = await PriceService.findByProductWithNoEndDate(cart.productid);
                        if (priceData.length > 0) {
                            cart.price = priceData[0].price;
                            cart.discount = priceData[0].discount;
                        } else {
                            cart.price = null;
                            cart.discount = null;
                        }
                        cart.product = product;
                    }
                }
                this.carts = carts.filter(cart => cart.state !== 'done');
            } catch (error) {
                console.error('Error fetching cart or product data:', error);
            }
        }
    },
    methods: {
        async fetchAvailableCodes() {
            const userId = LocalStorageHelper.getItem('id');
            const allCodes = await CodedService.getAll();
            const userCodeUses = await CodeuseService.findByUser(userId);
            const now = new Date();
            let availableCodes = allCodes.filter(code => {
                const start = new Date(code.start);
                const end = new Date(code.end);
                return start <= now && now <= end;
            });
            availableCodes = availableCodes.filter(code => {
                return !userCodeUses.some(codeUse => codeUse.codeid === code._id);
            });
            this.availableCodes = availableCodes;
        },
        productPicture(picture) {
            if (picture) {
                return `data:image/jpeg;base64,${picture}`;
            }
            return 'https://th.bing.com/th?id=OIP.XqGBZKSVcAqsEghNyEn1wAHaE8&w=306&h=204&c=8&rs=1&qlt=90&r=0&o=6&dpr=1.1&pid=3.1&rm=2.jpg';
        },
        calculateCost(price, discount) {
            if (discount) {
                return (price - (price * discount / 100)).toFixed(2);
            }
            return price;
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
        },
        checkout(cart) {
            this.$emit('checkout', cart);
        },
        async deleteCartItem(cart) {
            const confirmed = confirm('Bạn có muốn xóa sản phẩm này khỏi giỏ hàng hay không?');
            if (confirmed) {
                try {
                    const product = await ProductService.get(cart.productid);
                    product.count += cart.count;
                    await ProductService.update(cart.productid, { count: product.count });
                    await CartService.delete(cart._id);
                    this.carts = this.carts.filter(c => c._id !== cart._id);
                } catch (error) {
                    console.error('Error deleting cart item:', error);
                }
            }
        },
    },
};
</script>

<style scoped>
.container {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
}

.discount-codes {
    background-color: #ffffff;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.card {
    border-radius: 8px;
    overflow: hidden;
}

.card-header {
    padding: 10px;
}

.card-body {
    padding: 15px;
}

.table-hover tbody tr:hover {
    background-color: #f1f1f1;
}

.thead-dark th {
    background-color: #343a40;
    color: #ffffff;
}
/* here */
.cart-item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    background-color: whitesmoke;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
}

.product-image {
    width: 100%;
    height: 200px;
    object-fit: fill;
}

.details-column,
.cost-column,
.action-column {
    display: flex;
    flex-direction: column;
}

button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>
