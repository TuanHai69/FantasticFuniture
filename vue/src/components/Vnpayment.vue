<template>
    <div>
        <h1>VNPay Payment Test</h1>
        <form @submit.prevent="createPayment">
            <div>
                <label for="amount">Amount:</label>
                <input type="number" v-model="paymentData.amount" required />
            </div>
            <div>
                <label for="orderInfo">Order Info:</label>
                <input type="text" v-model="paymentData.orderInfo" required />
            </div>
            <div>
                <label for="bankCode">Bank Code:</label>
                <input type="text" v-model="paymentData.bankCode" />
            </div>
            <div>
                <label for="orderType">Order Type:</label>
                <input type="text" v-model="paymentData.orderType" required />
            </div>
            <div>
                <label for="language">Language:</label>
                <input type="text" v-model="paymentData.language" />
            </div>
            <button type="submit">Create Payment</button>
        </form>
        <div v-if="paymentUrl">
            <p>Payment URL: <a :href="paymentUrl" target="_blank">{{ paymentUrl }}</a></p>
        </div>
    </div>
</template>

<script>
import VNPayService from "@/services/vnpay.service";

export default {
    data() {
        return {
            paymentData: {
                amount: 0,
                orderInfo: '',
                bankCode: '',
                orderType: '',
                language: 'vn'
            },
            paymentUrl: null
        };
    },
    methods: {
        async createPayment() {
            try {
                const response = await VNPayService.createPayment(this.paymentData);
                this.paymentUrl = response.paymentUrl;
            } catch (error) {
                console.error("Error creating payment:", error);
                alert("Error creating payment");
            }
        }
    }
};
</script>

<style scoped>
form {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    margin: auto;
}

div {
    margin-bottom: 10px;
}

button {
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}
</style>