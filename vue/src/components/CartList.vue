<template>
    <div class="container">
        <h1>Giỏ hàng</h1>
        <ul v-if="carts.length" class="list-unstyled">
            <li v-for="cart in carts" :key="cart.id" class="cart-item row mb-3 p-3  rounded shadow-sm">
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
                        {{
                            formatCurrency(
                                calculateCost(cart.product.cost,
                                    cart.product.discount
                                )
                            )
                        }}
                    </p>
                    <p><strong>Tổng:</strong>
                        {{
                            formatCurrency(
                                cart.count * calculateCost(cart.product.cost,
                                    cart.product.discount)
                            )
                        }}
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
import LocalStorageHelper from '@/services/local.service';

export default {
    data() {
        return {
            carts: [],
        };
    },
    async created() {
        const userId = LocalStorageHelper.getItem('id');
        if (userId) {
            try {
                const carts = await CartService.findByUser(userId);
                for (const cart of carts) {
                    const product = await ProductService.get(cart.productid);
                    cart.product = product;
                }
                this.carts = carts;
            } catch (error) {
                console.error('Error fetching cart or product data:', error);
            }
        }
    },
    methods: {
        productPicture(picture) {
            if (picture) {
                return `data:image/jpeg;base64,${picture}`;
            }
            return 'https://th.bing.com/th?id=OIP.XqGBZKSVcAqsEghNyEn1wAHaE8&w=306&h=204&c=8&rs=1&qlt=90&r=0&o=6&dpr=1.1&pid=3.1&rm=2.jpg';
        },
        calculateCost(cost, discount) {
            if (discount) {
                return (cost - (cost * discount / 100)).toFixed(2);
            }
            return cost;
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
                    // Fetch the product details
                    const product = await ProductService.get(cart.productid);
                    // Update the product count
                    product.count += cart.count;
                    await ProductService.update(cart.productid, { count: product.count });
                    // Delete the cart item
                    await CartService.delete(cart._id);
                    // Remove the cart item from the local list
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
.cart-item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    background-color: whitesmoke;
    /* Light grey background */
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