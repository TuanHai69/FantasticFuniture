<template>
    <AppHeader />
    <hr>
    <div>
        <CartList v-if="!showPayment" @checkout="handleCheckout" />
        <PaymentBody v-else :cart="selectedCart" @checkout-complete="handleCheckoutComplete" />
    </div>
</template>

<script>
import CartList from '@/components/CartList.vue';
import AppHeader from "@/components/AppHeader.vue";
import PaymentBody from "@/components/PaymentBody.vue";

export default {
    components: {
        CartList,
        AppHeader,
        PaymentBody,
    },
    data() {
        return {
            showPayment: false,
            selectedCart: null,
        };
    },
    methods: {
        handleCheckout(cart) {
            this.selectedCart = cart;
            this.showPayment = true;
        },
        handleCheckoutComplete() {
            this.selectedCart = null;
            this.showPayment = false;
        },
    }
};
</script>

<style scoped>
/* Add your styles here */
</style>
