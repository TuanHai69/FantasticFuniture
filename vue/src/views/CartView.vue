<template>
    <AppHeader />
    <hr>
    <div>
        <CartList />
    </div>
</template>

<script>
import CartList from '@/components/CartList.vue';
import AppHeader from "@/components/AppHeader.vue";

export default {
    components: {
        CartList,
        AppHeader,
    }
};
</script>

<style scoped>
/* Add your styles here */
</style>