<template>
    <AppHeader />
    <div class="shopcardbg">
        <div class="container-fluid ">
            <div class="page row" v-if="!editingProductId">
                <div class="offset-1 col-md-10">
                    <div class="d-flex justify-content-center mt-3">
                        <ProductHead :id=id @edit-product="handleEditProduct" />
                    </div>
                </div>
                <ShopBodyCard :storeid="this.product.storeid" :editstate="'hide'" v-if="this.product.storeid" />
                <ProductCard />
            </div>
            <div class="page row" v-else-if="editingProductId">
                <ProductForm :storeid="id" :productid="editingProductId" @cancel="handleCancelEditProduct"
                    @update-product="handleUpdateProductSubmit" />
            </div>
        </div>
    </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import ProductHead from "@/components/ProductHead.vue";
import ProductCard from "@/components/ProductCard.vue";
import ShopBodyCard from "@/components/ShopBodyCard.vue";
import ProductService from "@/services/product.service";
import ProductForm from "@/components/ProductForm.vue";

export default {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            product: {},
            editingProductId: null,
        };
    },
    components: {
        AppHeader,
        ProductHead,
        ProductCard,
        ShopBodyCard,
        ProductForm
    },
    watch: {
        id: {
            handler(newId) {
                this.fetchProduct(newId);
            },
            immediate: true
        }
    },
    mounted() {
        this.fetchProduct();
    },
    methods: {
        async fetchProduct() {
            try {
                const response = await ProductService.get(this.id);
                this.product = response;
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        },
        handleEditProduct(productId) {
            this.editingProductId = productId;
        },
        handleCancelEditProduct() {
            this.editingProductId = null;
        },
        async handleUpdateProductSubmit(product) {
            try {
                await ProductService.update(product._id, product);
                alert('Cập nhật thông tin sản phẩm thành công!');
                this.editingProductId = null;
                // Optionally, refresh the product list or perform other actions
            } catch (error) {
                console.error('Error updating product:', error);
                alert('Có lỗi xảy ra khi cập nhật thông tin sản phẩm.');
            }
        },
    }

};
</script>