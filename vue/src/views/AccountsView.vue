<template>
    <AppHeader />
    <hr>
    <div class="container mt-4">
        <AccountList />
    </div>
</template>

<script>
import AccountList from "@/components/AccountList.vue"; // Đảm bảo đường dẫn đúng
import AppHeader from "@/components/AppHeader.vue";

export default {
    name: 'AccountsView',
    components: {
        AccountList,
        AppHeader,
    }
}
</script>

<style scoped>
/* Thêm style tùy chỉnh nếu cần */
</style>