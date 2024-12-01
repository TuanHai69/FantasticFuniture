<template>
    <AppHeader />
    <div class="shopcardbg bg-info bg-gradient">
        <div class="container-fluid ">
            <div class="page row">
                <div class="offset-1 col-md-10">
                    <div class="d-flex justify-content-center mt-3">
                        <h2>Danh sách cửa hàng</h2>
                    </div>
                    <ShopCard />
                </div>
            </div>
            <Footer></Footer>
        </div>
    </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import ShopCard from "@/components/ShopCard.vue";
import Footer from "@/components/Footer.vue";

export default {
    components: {
        AppHeader,
        ShopCard,
        Footer,
    },
};
</script>