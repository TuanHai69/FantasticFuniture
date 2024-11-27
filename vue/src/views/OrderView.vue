<template>
    <AppHeader />
    <hr>
    <div class="container order-view bg-danger bg-gradient">
        <h1 class="my-4 text-white">Đơn hàng của bạn</h1>
        <OrderList />
    </div>
</template>

<script>
import OrderList from '@/components/OrderList.vue';
import AppHeader from "@/components/AppHeader.vue";

export default {
    components: {
        OrderList,
        AppHeader
    }
};
</script>

<style scoped>
.order-view {
    margin: auto;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>