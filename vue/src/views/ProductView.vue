<template>
    <AppHeader />
    <div class="shopcardbg bg-warning bg-gradient">
        <div class="container-fluid ">
            <div class="page row">
                <div class="offset-1 col-md-10">
                    <div class="d-flex justify-content-center mt-3">
                        <h2>Danh sách sản phẩm</h2>
                    </div>
                    <ProductCard :id="$route.params.id" :searchQuery="$route.query.search" />
                </div>
            </div>
            <Footer></Footer>
        </div>
    </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import ProductCard from "@/components/ProductCard.vue";
import Footer from "@/components/Footer.vue";

export default {
    components: {
        AppHeader,
        ProductCard,
        Footer,
    },
    props: {
        id: {
            type: String,
            default: null
        }
    },
};
</script>