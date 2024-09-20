<template>
    <AppHeader />
    <div class="shopcardbg">
        <div class="container-fluid ">
            <div class="page row">
                <div class="offset-1 col-md-10">
                    <div class="d-flex justify-content-center mt-3">
                        <h2>Danh sách sản phẩm</h2>
                    </div>
                    <ProductCard />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import ProductCard from "@/components/ProductCard.vue";
export default {
    components: {
        AppHeader,
        ProductCard
    },
};
</script>