<template>
    <AppHeader />
    <div class="shopcardbg bg-info bg-gradient">
        <div class="container-fluid">
            <div class="page row">
                <div class="offset-1 col-md-10">
                    <div
                        v-if="!editingStoreId && !creatingProduct && !editingProductId && !viewingCart && !viewingRevenue">
                        <div class="d-flex justify-content-center mt-3" v-if="id">
                            <ShopHeadCard :id="id" @edit-store="handleEditStore" @create-product="handleCreateProduct"
                                @view-cart="handleViewCart" @view-revenue="handleViewRevenue" />
                        </div>
                        <CommandStoreCard :storeid="id" />
                        <ShopBodyCard :storeid="id" :editstate="'show'" @edit-product="handleEditProduct" />

                    </div>
                    <StoreForm v-if="editingStoreId" :storeId="editingStoreId" @cancel="handleCancelEdit" />
                    <div v-else-if="viewingCart" class="m-3">
                        <h2>Danh sách đơn hàng</h2>
                        <hr>
                        <OrderList :storeid="id" />
                    </div>
                    <div v-else-if="viewingRevenue" class="m-3">
                        <h2>Doanh thu</h2>
                        <hr>
                        <RevenueCard :storeid="id" />
                    </div>
                    <productForm v-else-if="creatingProduct" :storeid="id" @cancel="handleCancelCreate"
                        @create-product="handleCreateProductSubmit" />
                    <productForm v-else-if="editingProductId" :storeid="id" :productid="editingProductId"
                        @cancel="handleCancelEditProduct" @update-product="handleUpdateProductSubmit" />
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
import productForm from "@/components/ProductForm.vue";
import ProductService from "@/services/product.service";
import OrderList from "@/components/OrderList.vue";
import RevenueCard from "@/components/RevenueCard.vue";
import CommandStoreCard from "@/components/CommandStoreCard.vue";

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
        OrderList,
        RevenueCard,
        CommandStoreCard,
    },
    data() {
        return {
            editingStoreId: null,
            creatingProduct: false,
            editingProductId: null,
            viewingCart: false,
            viewingRevenue: false,
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
        handleEditProduct(productId) {
            this.editingProductId = productId;
        },
        handleCancelEditProduct() {
            this.editingProductId = null;
        },
        handleViewCart() {
            this.viewingCart = true;
            this.viewingRevenue = false;
        },
        handleViewRevenue() {
            this.viewingRevenue = true;
            this.viewingCart = false;
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
                this.editingProductId = null;
                // Optionally, refresh the product list or perform other actions
            } catch (error) {
                console.error('Error updating product:', error);
                alert('Có lỗi xảy ra khi cập nhật thông tin sản phẩm.');
            }
        }
    }
};
</script>