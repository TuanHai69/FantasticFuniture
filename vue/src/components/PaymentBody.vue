<template>
    <div class="payment-body container">
        <div class="row">
            <div class="col-md-6 d-flex flex-column align-items-center">
                <h2>Product Details</h2>
                <img :src="productPicture(cart.product.picture)" alt="Product Image" class="product-image img-fluid" />
                <p><strong>Name:</strong> {{ cart.product.name }}</p>
                <p><strong>Material:</strong> {{ cart.product.material }}</p>
                <p><strong>Size:</strong> {{ cart.product.size }}</p>
                <p><strong>Warranty:</strong> {{ cart.product.warranty }}</p>

            </div>
            <div class="col-md-6 d-flex flex-column align-items-center">

                <h2>Payment Details</h2>
                <div class="d-flex justify-content-evenly w-100">
                    <p><strong>Cost:</strong> {{ formatCurrency(calculateCost(cart.product.cost, cart.product.discount))
                        }}</p>
                    <p><strong>Count:</strong> {{ cart.count }}</p>
                </div>
                <div class="d-flex justify-content-evenly w-100">
                    <p><strong>Sum:</strong> {{ formatCurrency(cart.count * calculateCost(cart.product.cost,
                        cart.product.discount)) }}</p>
                    <p v-if="discountPercent"><strong>Discount:</strong> {{ discountPercent }}%</p>
                </div>
                <p v-if="discountPercent"><strong>Total:</strong> {{ formatCurrency(calculateTotal(cart.count *
                    calculateCost(cart.product.cost, cart.product.discount), discountPercent)) }}</p>
                <form @submit.prevent="validateCode" class="d-flex justify-content-evenly w-100">
                    <div class="form-group mr-2">
                        <input v-model="code" type="text" class="form-control" id="code" placeholder="Enter code" />
                    </div>
                    <button type="submit" class="btn btn-secondary  ">Apply Code</button>
                </form>
                <div class="form-group w-100">
                    <label for="paymentMethod">Payment Method</label>
                    <select v-model="paymentMethod" class="form-control" id="paymentMethod">
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="cash_on_delivery">Cash on Delivery</option>
                    </select>
                </div>
                <div class="form-group w-100">
                    <label for="address">Address</label>
                    <input v-model="address" type="text" class="form-control" id="address"
                        placeholder="Enter address" />
                </div>
                <div class="form-group w-100">
                    <label for="phonenumber">Phone Number</label>
                    <input v-model="phonenumber" type="text" class="form-control" id="phonenumber"
                        placeholder="Enter phone number" />
                </div>
                <div class="form-group w-100">
                    <label for="description">Description</label>
                    <textarea v-model="description" class="form-control" id="description" rows="3"
                        placeholder="Enter description"></textarea>
                </div>

                <button @click="confirmPayment" class="btn btn-primary m-4">Confirm</button>
            </div>
        </div>
    </div>
</template>

<script>
import OrderService from '@/services/order.service';
import LocalStorageHelper from '@/services/local.service';
import CodedService from '@/services/coded.service';
import CodeuseService from '@/services/codeuse.service';

export default {
    props: {
        cart: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            paymentMethod: 'bank_transfer',
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
                } else {
                    const pendingOrder = orders.find(order => order.state === 'Pending Confirmation');
                    if (pendingOrder) {
                        this.order = pendingOrder;
                    } else {
                        await this.createOrder(userId, storeId);
                    }
                }
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
                state: 'Pending Confirmation'
            };
            try {
                await OrderService.create(newOrder);
                const orders = await OrderService.findByUserIdAndStoreId(userId, storeId);
                this.order = orders.find(order => order.state === 'Pending Confirmation');
            } catch (error) {
                console.error('Error creating order:', error);
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
        calculateCost(cost, discount) {
            if (discount) {
                return (cost - (cost * discount / 100)).toFixed(2);
            }
            return cost;
        },
        calculateTotal(sum, discountPercent) {
            return (sum * (1 - discountPercent / 100)).toFixed(2);
        },
        async validateCode() {
            try {
                if (!this.code) {
                    this.discountPercent = null;
                    return;
                }
                const codeData = await CodedService.findByCode(this.code);
                if (!codeData) {
                    alert('Mã không hợp lệ');
                    return;
                }

                const userId = LocalStorageHelper.getItem('id');
                const codeUses = await CodeuseService.findByUser(userId);
                const codeUsed = codeUses.some(use => use.codeid === codeData._id);

                if (codeUsed) {
                    alert('Mã đã được sử dụng');
                } else {
                    // const newCodeUse = {
                    //     userid: userId,
                    //     codeid: codeData[0]._id,
                    //     day: new Date().toISOString()
                    // };
                    // await CodeuseService.create(newCodeUse);
                    this.discountPercent = codeData[0].percent;
                }
            } catch (error) {
                console.error('Error validating code:', error);
                alert('Có lỗi xảy ra khi kiểm tra mã');
            }
        },
        confirmPayment() {
            console.log('Payment Method:', this.paymentMethod);
            console.log('Code:', this.code);
            console.log('Description:', this.description);
            console.log('Address:', this.address);
            console.log('Phone Number:', this.phonenumber);
        }
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