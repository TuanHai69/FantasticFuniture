<template>
    <AppHeader />
    <div class="shopcardbg">
        <div class="container-fluid ">
            <div class="page row">
                <div class="offset-1 col-md-10">
                    <div class="d-flex justify-content-center mt-3">
                        <ProductHead :id = id />
                    </div>
                </div>
                <ShopBodyCard />
                <ProductCard />
            </div>
        </div>
    </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import ProductHead from "@/components/ProductHead.vue";
import ProductCard from "@/components/ProductCard.vue";
import ShopBodyCard from "@/components/ShopBodyCard.vue";
export default {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    components: {
        AppHeader,
        ProductHead,
        ProductCard,
        ShopBodyCard,
    },
};
</script>