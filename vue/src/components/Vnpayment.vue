<template>
    <div>
        <button @click="createPayment">Create Payment</button>
    </div>
</template>

<script>
import VNPayService from "@/services/vnpay.service";

export default {
    methods: {
        async createPayment() {
            try {
                const paymentData = {
                    amount: 100000, // Số tiền tính bằng VND
                    orderInfo: "Thanh toán cho đơn hàng #12345",
                };
                const response = await VNPayService.createPayment(paymentData);
                window.location.href = response.paymentUrl; // Chuyển hướng người dùng đến URL thanh toán
            } catch (error) {
                console.error("Error creating payment:", error);
                alert("Đã xảy ra lỗi khi tạo yêu cầu thanh toán. Vui lòng thử lại.");
            }
        },
    },
};
</script>
