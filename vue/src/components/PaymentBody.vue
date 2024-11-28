<template>
    <div class="payment-body container">
        <div class="row">
            <div class="col-md-6 d-flex flex-column align-items-center">
                <div class="d-flex justify-content-between w-100 align-items-center">
                    <button @click="goBack" class="btn btn-danger m-2">Quay lại</button>
                </div>
                <h2>Chi tiết sản phẩm</h2>
                <img :src="productPicture(cart.product.picture)" alt="Product Image" class="product-image img-fluid" />
                <p><strong>Tên:</strong> {{ cart.product.name }}</p>
                <p><strong>Vật liệu:</strong> {{ cart.product.material }}</p>
                <p><strong>Kích thước:</strong> {{ cart.product.size }}</p>
                <p><strong>Bảo hành:</strong> {{ cart.product.warranty }}</p>
            </div>
            <div class="col-md-6 d-flex flex-column align-items-center">
                <h2>Chi tiết thanh toán</h2>
                <div class="d-flex justify-content-evenly w-100">
                    <p><strong>Giá:</strong> {{ formatCurrency(calculateCost(cart.price, cart.discount)) }}</p>
                    <p><strong>Số lượng:</strong> {{ cart.count }}</p>
                </div>
                <div class="d-flex justify-content-evenly w-100">
                    <p><strong>Tổng sản phẩm:</strong> {{ formatCurrency(cart.count * calculateCost(cart.price,
                        cart.discount)) }}</p>
                    <p v-if="discountPercent"><strong>Giảm:</strong> {{ discountPercent }}%</p>
                </div>
                <p v-if="discountPercent"><strong>Tổng giá:</strong> {{ formatCurrency(calculateTotal(cart.count *
                    calculateCost(cart.price, cart.discount), discountPercent)) }}</p>
                <form @submit.prevent="validateCode" class="d-flex justify-content-evenly w-100">
                    <div class="form-group mr-2">
                        <input v-model="code" type="text" class="form-control" id="code"
                            placeholder="Nhập mã giảm giá" />
                    </div>
                    <button type="submit" class="btn btn-secondary">Xác nhận mã</button>
                </form>
                <div class="form-group w-100">
                    <label for="paymentMethod">Phương thức thanh toán</label>
                    <select v-model="paymentMethod" class="form-control" id="paymentMethod">
                        <option value="Trả khi nhận hàng">Trả khi nhận hàng</option>
                        <option value="Chuyển khoảng">Chuyển khoảng</option>
                    </select>
                </div>
                <div class="form-group w-100">
                    <label for="address">Địa chỉ giao hàng</label>
                    <input v-model="address" type="text" class="form-control" id="address"
                        placeholder="Nhập vào địa chỉ giao hàng" />
                </div>
                <div class="form-group w-100">
                    <label for="phonenumber">Số điện thoại người nhận</label>
                    <input v-model="phonenumber" type="text" class="form-control" id="phonenumber"
                        placeholder="Nhập vào số điện thoại" />
                </div>
                <div class="form-group w-100">
                    <label for="description">Mô tả</label>
                    <textarea v-model="description" class="form-control" id="description" rows="3"
                        placeholder="Nhập vào mô tả"></textarea>
                </div>
                <button @click="confirmPayment" class="btn btn-primary m-4">Xác nhận</button>
            </div>
        </div>
    </div>
</template>


<script>
import OrderService from '@/services/order.service';
import LocalStorageHelper from '@/services/local.service';
import CodedService from '@/services/coded.service';
import CodeuseService from '@/services/codeuse.service';
import CartService from '@/services/cart.service';
import CommentService from '@/services/comment.service';
import PriceService from '@/services/price.service';
import zaloService from '@/services/zalo.service';

export default {
    props: {
        cart: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            paymentMethod: 'Trả khi nhận hàng',
            code: '',
            description: '',
            address: '',
            phonenumber: '',
            order: null,
            discountPercent: null,
        };
    },
    async created() {
        const userId = LocalStorageHelper.getItem('id');
        const storeId = this.cart.storeid;
        if (userId && storeId) {
            try {
                let orders = await OrderService.findByUserIdAndStoreId(userId, storeId);
                if (orders.length === 0) {
                    await this.createOrder(userId, storeId);
                    let orderss = await OrderService.findByUserIdAndStoreId(userId, storeId);
                    const pendingOrder = orderss.find(order => order.state === 'Chờ xác nhận');
                    if (pendingOrder) {
                        this.order = pendingOrder;
                    }
                } else {
                    const pendingOrder = orders.find(order => order.state === 'Chờ xác nhận');
                    if (pendingOrder) {
                        this.order = pendingOrder;
                    } else {
                        await this.createOrder(userId, storeId);
                        let orderss = await OrderService.findByUserIdAndStoreId(userId, storeId);
                        const pendingOrder = orderss.find(order => order.state === 'Chờ xác nhận');
                        if (pendingOrder) {
                            this.order = pendingOrder;
                        }
                    }
                }
                await this.fetchPrice();
            } catch (error) {
                console.error('Error fetching or creating order:', error);
            }
        }
    },
    methods: {
        async createOrder(userId, storeId) {
            const newOrder = {
                userid: userId,
                storeid: storeId,
                date: new Date().toISOString(),
                state: 'Chờ xác nhận',
                price: 0,
            };
            try {
                await OrderService.create(newOrder);
                const orders = await OrderService.findByUserIdAndStoreId(userId, storeId);
                this.order = orders.find(order => order.state === 'Chờ xác nhận');
            } catch (error) {
                console.error('Error creating order:', error);
            }
        },
        async fetchPrice() {
            try {
                const priceData = await PriceService.findByProductWithNoEndDate(this.cart.product._id);
                if (priceData.length > 0) {
                    this.cart.price = priceData[0].price;
                    this.cart.discount = priceData[0].discount;
                } else {
                    this.cart.price = null;
                    this.cart.discount = null;
                }
            } catch (error) {
                console.error('Error fetching price:', error);
            }
        },
        productPicture(picture) {
            if (picture) {
                return `data:image/jpeg;base64,${picture}`;
            }
            return 'https://th.bing.com/th?id=OIP.XqGBZKSVcAqsEghNyEn1wAHaE8&w=306&h=204&c=8&rs=1&qlt=90&r=0&o=6&dpr=1.1&pid=3.1&rm=2.jpg';
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
        },
        calculateCost(price, discount) {
            if (discount) {
                return (price - (price * discount / 100)).toFixed(2);
            }
            return price;
        },
        calculateTotal(sum, discountPercent) {
            return (sum * (1 - discountPercent / 100)).toFixed(2);
        },
        formatDate(date) {
            return date.toISOString().split('T')[0];
        },
        async validateCode() {
            try {
                if (!this.code) {
                    this.discountPercent = null;
                    return;
                }
                const codeData = await CodedService.findByCode(this.code);
                if (!codeData[0]) {
                    alert('Mã không hợp lệ');
                    return;
                }

                const userId = LocalStorageHelper.getItem('id');
                const codeUses = await CodeuseService.findByUser(userId);
                const codeUsed = codeUses.some(use => use.codeid === codeData[0]._id);

                if (codeUsed) {
                    alert('Mã đã được sử dụng');
                } else {
                    this.discountPercent = codeData[0].percent;
                }
            } catch (error) {
                console.error('Error validating code:', error);
                alert('Có lỗi xảy ra khi kiểm tra mã');
            }
        },
        async confirmPayment() {
            if (!this.address || !this.phonenumber) {
                alert('Vui lòng nhập địa chỉ và số điện thoại');
                return;
            }
            try {
                let cost;
                let disc;
                if (this.discountPercent) {
                    cost = this.calculateTotal(this.cart.count * this.calculateCost(this.cart.price, this.cart.discount), this.discountPercent);
                    const userId = LocalStorageHelper.getItem('id');
                    const codeData = await CodedService.findByCode(this.code);
                    const newCodeUse = {
                        userid: userId,
                        codeid: codeData[0]._id,
                        day: this.formatDate(new Date())
                    };
                    await CodeuseService.create(newCodeUse);

                    if (this.cart.discount) {
                        disc = (this.cart.discount + this.discountPercent) - (this.discountPercent * this.cart.discount) / 100;
                    } else {
                        disc = this.discountPercent;
                    }
                } else {
                    cost = this.cart.count * this.calculateCost(this.cart.price, this.cart.discount);
                    disc = this.cart.discount ? this.cart.discount : 0;
                }

                if (this.paymentMethod === "Chuyển khoảng") {
                    const updatedCart = {
                        _id: this.cart._id,
                        userid: this.cart.userid,
                        productid: this.cart.productid,
                        count: this.cart.count,
                        payment: this.paymentMethod,
                        note: this.description,
                        discount: disc,
                        phonenumber: this.phonenumber,
                        address: this.address,
                        day: new Date().toISOString(),
                        storeid: this.cart.storeid,
                        orderid: this.order._id,
                        state: "done"
                    };
                    const updatedOrder = {
                        _id: this.order._id,
                        state: 'Chờ xác nhận',
                        date: this.formatDate(new Date()),
                        price: parseFloat(this.order.price) + parseFloat(cost)
                    }; const userId = LocalStorageHelper.getItem('id');
                    const userComments = await CommentService.findByUser(userId);
                    let newComment;
                    if (userComments.length === 0) {
                        newComment = {
                            userid: userId,
                            productid: this.cart.product._id,
                            rate: "",
                            comment: "",
                            state: "",
                            like: false,
                        };
                    } else {
                        const hasCommented = userComments.find(comment => comment.productid === this.cart.product._id);
                        if (!hasCommented) {
                            newComment = {
                                userid: userId,
                                productid: this.cart.product._id,
                                rate: "",
                                comment: "",
                                state: "",
                                like: false,
                            };
                        } else {
                            if (hasCommented.state == 'Nopay') {
                                newComment = {
                                    _id: hasCommented._id,
                                    state: ""
                                };
                            }
                        }
                    } const zaloPayData = {
                        amount: parseFloat(cost),
                        description: this.cart.product.name
                    };
                    const paymentData = {
                        zaloPayData,
                        updatedCart,
                        updatedOrder,
                        newComment
                    };
                    console.log(paymentData);
                    const response = await zaloService.createOrder(paymentData);
                    console.log(response);
                    if (response.return_code === 1) {  // Check if the payment was successful
                        // Redirect user to ZaloPay payment page
                        window.location.href = response.order_url;
                        return; // Stop further processing and await callback confirmation
                    } else {
                        alert('Có lỗi xảy ra khi xử lý thanh toán qua ZaloPay.');
                        return; // Stop further processing if payment failed
                    }
                }

                // Continue with order update if not using ZaloPay
                await this.updateOrderAndCart(cost, disc);
                alert('Thanh toán thành công');
                this.$emit('checkout-complete');
            } catch (error) {
                console.error('Error confirming payment:', error);
                alert('Có lỗi xảy ra khi xác nhận đơn hàng');
            }
        },
        async updateOrderAndCart(cost, disc) {
            const updatedCart = {
                userid: this.cart.userid,
                productid: this.cart.productid,
                count: this.cart.count,
                payment: this.paymentMethod,
                note: this.description,
                discount: disc,
                phonenumber: this.phonenumber,
                address: this.address,
                day: new Date().toISOString(),
                storeid: this.cart.storeid,
                orderid: this.order._id,
                state: "done"
            };
            await CartService.update(this.cart._id, updatedCart);

            const updatedOrder = {
                state: 'Chờ xác nhận',
                date: this.formatDate(new Date()),
                price: parseFloat(this.order.price) + parseFloat(cost)
            };

            await OrderService.update(this.order._id, updatedOrder);

            const userId = LocalStorageHelper.getItem('id');
            const userComments = await CommentService.findByUser(userId);
            if (userComments.length === 0) {
                const newComment = {
                    userid: userId,
                    productid: this.cart.product._id,
                    rate: "",
                    comment: "",
                    state: "",
                    like: false
                };
                await CommentService.create(newComment);
            } else {
                const hasCommented = userComments.find(comment => comment.productid === this.cart.product._id);
                if (!hasCommented) {
                    const newComment = {
                        userid: userId,
                        productid: this.cart.product._id,
                        rate: "",
                        comment: "",
                        state: "",
                        like: false,
                    };
                    await CommentService.create(newComment);
                } else {
                    if (hasCommented.state == 'Nopay') {
                        await CommentService.update(hasCommented._id, { state: "" });
                    }
                }
            }
        },
        goBack() {
            this.$emit('checkout-complete');
        },
    }
};
</script>


<style scoped>
.payment-body {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
}

.product-image {
    max-width: 300px;
    height: 200px;
}
</style>