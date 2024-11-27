<template>
    <AppHeader />
    <hr>
    <div class="admin-revenue-view p-3 bg-danger bg-gradient">
        <h1 class="text-white">Doanh thu hệ thống</h1>
        <AdminRevenue />
    </div>
</template>

<script>
import AdminRevenue from '@/components/AdminRevenue.vue';
import AppHeader from "@/components/AppHeader.vue";

export default {
    name: 'AdminRevenueView',
    components: {
        AdminRevenue,
        AppHeader,
    }
};
</script>

<style scoped>
.admin-revenue-view {
    padding: 20px;
    background-color: #f3f4f6;
    border-radius: 8px;
}
</style>
