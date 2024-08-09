<template>
    <AppHeader />
    <div class="shopcardbg">
        <div class="container-fluid ">
            <div class="page row">
                <div class="offset-1 col-md-10">
                    <div class="d-flex justify-content-center mt-3">
                        <h2>Danh sách cửa hàng</h2>
                    </div>
                    <ShopCard />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import ShopCard from "@/components/ShopCard.vue";
import ShopList from "@/components/ShopList.vue";
export default {
    components: {
        AppHeader,
        ShopCard,
        ShopList,
    },
};
</script>