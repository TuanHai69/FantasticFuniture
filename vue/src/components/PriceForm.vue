<template>
    <hr>
    <h3>Cập nhật giá sản phẩm</h3>
    <hr>
    <div class="container mt-4">
        <div class="row justify-content-evenly">
            <div class="col-md-4 text-center ">
                <div v-if="product">
                    <img :src="productPicture(product.picture)" alt="Product Image" class="img-fluid" />
                    <h3>{{ product.name }}</h3>
                </div>
            </div>
            <div class="col-md-4 ">
                <form @submit.prevent="handleSubmit">
                    <div class="form-group">
                        <label for="price">Giá:</label>
                        <input type="number" id="price" v-model.number="price" class="form-control" required />
                    </div>
                    <div class="form-group">
                        <label for="discount">Giảm giá (%):</label>
                        <input type="number" id="discount" v-model.number="discount" class="form-control" min="0"
                            max="100" />
                    </div>
                    <div class="text-center">
                        <button type="submit" class="btn btn-primary mt-3">
                            {{ existingPrice ? 'Cập nhật giá' : 'Tạo giá' }}
                        </button>
                        <button type="button" class="btn btn-secondary mt-3" @click="handleCancel">Hủy</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import ProductService from "@/services/product.service";
import PriceService from "@/services/price.service";

export default {
    props: {
        productid: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            product: null,
            price: null,
            discount: null,
            existingPrice: null,
            error: null
        };
    },
    emits: ['cancel'],
    async mounted() {
        await this.fetchProduct();
        await this.fetchExistingPrice();
    },
    methods: {
        async fetchProduct() {
            try {
                const response = await ProductService.get(this.productid);
                this.product = response;
            } catch (error) {
                console.error('Error fetching product:', error);
                this.error = 'Error fetching product';
            }
        },
        async fetchExistingPrice() {
            try {
                const existingPrices = await PriceService.findByProductWithNoEndDate(this.productid);
                if (existingPrices.length > 0) {
                    const existingPrice = existingPrices[0];
                    this.price = existingPrice.price;
                    this.discount = existingPrice.discount !== null ? existingPrice.discount : null;
                    this.existingPrice = existingPrice;
                }
            } catch (error) {
                console.error('Error fetching existing price:', error);
                this.error = 'Error fetching existing price';
            }
        },
        async handleSubmit() {
            const now = new Date();
            const daystart = now.toISOString();

            try {
                if (this.existingPrice) {
                    if (this.price === this.existingPrice.price && this.discount !== null) {
                        await PriceService.update(this.existingPrice._id, { discount: this.discount });
                        alert('Giá đã được cập nhật thành công!');
                    } else {
                        await PriceService.update(this.existingPrice._id, { dayend: daystart });
                        const newPrice = {
                            daystart,
                            price: this.price,
                            discount: this.discount > 0 && this.discount < 100 ? this.discount : null,
                            productid: this.productid
                        };
                        await PriceService.create(newPrice);
                        alert('Giá mới đã được tạo thành công!');
                    }
                } else {
                    const newPrice = {
                        daystart,
                        price: this.price,
                        discount: this.discount > 0 && this.discount < 100 ? this.discount : null,
                        productid: this.productid
                    };
                    await PriceService.create(newPrice);
                    alert('Giá mới đã được tạo thành công!');
                }
                this.$emit('cancel');
            } catch (error) {
                console.error('Error creating or updating price:', error);
                this.error = 'Error creating or updating price';
            }
        },
        handleCancel() {
            this.$emit('cancel');
        },
        productPicture(picture) {
            return picture ? `data:image/jpeg;base64,${picture}` : 'https://donggia.vn/wp-content/uploads/2019/11/thiet-ke-noi-that-phong-khach-chung-cu-dep-2020-12.jpg';
        }
    }
};

</script>
