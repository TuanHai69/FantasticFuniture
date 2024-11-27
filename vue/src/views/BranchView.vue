<template>
    <AppHeader />
    <hr>
    <div class="container mt-4 branch-list-container bg-success bg-gradient">
        <BranchList v-if="!selectedBranch" @view-branch="viewBranch" />
        <BranchCard v-if="selectedBranch" :branch="selectedBranch" @back="selectedBranch = null" />
    </div>
</template>

<script>
import BranchList from "@/components/BranchList.vue"; // Đảm bảo đường dẫn đúng
import AppHeader from "@/components/AppHeader.vue";
import BranchCard from "@/components/BranchCard.vue";
export default {
    name: 'BranchView',
    components: {
        BranchList,
        AppHeader,
        BranchCard,
    },
    data() {
        return {
            selectedBranch: null
        }
    },
    methods: {
        viewBranch(branch) {
            this.selectedBranch = branch;
        }
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
