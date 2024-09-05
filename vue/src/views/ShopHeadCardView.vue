<template>
    <AppHeader />
    <div class="shopcardbg">
        <div class="container-fluid">
            <div class="page row">
                <div class="offset-1 col-md-10">
                    <div v-if="!editingStoreId && !creatingProduct">
                        <div class="d-flex justify-content-center mt-3" v-if="id">
                            <ShopHeadCard :id="id" @edit-store="handleEditStore"
                                @create-product="handleCreateProduct" />
                        </div>
                        <ShopBodyCard :storeid="id" />
                    </div>
                    <StoreForm v-if="editingStoreId" :storeId="editingStoreId" @cancel="handleCancelEdit" />
                    <productForm v-else-if="creatingProduct" :storeid="id" @cancel="handleCancelCreate"
                        @create-product="handleCreateProductSubmit" @update-product="handleUpdateProductSubmit" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import ShopHeadCard from "@/components/ShopHeadCard.vue";
import ShopBodyCard from "@/components/ShopBodyCard.vue";
import StoreForm from "@/components/StoreForm.vue";
import productForm from "@/components/ProductForm.vue"; // Giả sử bạn có component này
import ProductService from "@/services/product.service"; // Giả sử bạn có service này

export default {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    components: {
        AppHeader,
        ShopHeadCard,
        ShopBodyCard,
        StoreForm,
        productForm,
    },
    data() {
        return {
            editingStoreId: null,
            creatingProduct: false,
        };
    },
    methods: {
        handleEditStore(storeId) {
            this.editingStoreId = storeId;
        },
        handleCancelEdit() {
            this.editingStoreId = null;
        },
        handleCreateProduct() {
            this.creatingProduct = true;
        },
        handleCancelCreate() {
            this.creatingProduct = false;
        },
        async handleCreateProductSubmit(product) {
            try {
                await ProductService.create(product);
                alert('Tạo sản phẩm mới thành công!');
                this.creatingProduct = false;
                // Optionally, refresh the product list or perform other actions
            } catch (error) {
                console.error('Error creating product:', error);
                alert('Có lỗi xảy ra khi tạo sản phẩm mới.');
            }
        },
        async handleUpdateProductSubmit(product) {
            try {
                await ProductService.update(product._id, product);
                alert('Cập nhật thông tin sản phẩm thành công!');
                this.creatingProduct = false;
                // Optionally, refresh the product list or perform other actions
            } catch (error) {
                console.error('Error updating product:', error);
                alert('Có lỗi xảy ra khi cập nhật thông tin sản phẩm.');
            }
        }
    }
};
</script>