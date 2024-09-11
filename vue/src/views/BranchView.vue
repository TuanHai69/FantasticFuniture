<template>
    <AppHeader />
    <hr>
    <div class="container mt-4 branch-list-container">
        <BranchList />
    </div>
</template>

<script>
import BranchList from "@/components/BranchList.vue"; // Đảm bảo đường dẫn đúng
import AppHeader from "@/components/AppHeader.vue";

export default {
    name: 'BranchView',
    components: {
        BranchList,
        AppHeader,
    }
}
</script>

<style scoped>
.branch-list-container {
    background-color: #f0f0f0;
    /* Màu nền hơi xám */
    padding: 20px;
    border-radius: 8px;
}
</style>
