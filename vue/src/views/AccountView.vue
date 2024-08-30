<template>
    <AppHeader />
    <hr>
    <div class="account-page">
        <AccountInfo :account="account" />
    </div>
</template>

<script>
import AccountInfo from '@/components/InformationCard.vue'; // Đường dẫn tới component
import AppHeader from "@/components/AppHeader.vue";
import LocalStorageHelper from '@/services/local.service';
import AccountService from "@/services/accounts.service"; // Đường dẫn tới API service của account

export default {
    name: 'AccountPage',
    components: {
        AccountInfo,
        AppHeader,
    },
    data() {
        return {
            account: {
                username: '', // Thay thế bằng dữ liệu thực tế
                name: '',
                picture: '',
                birthday: '',
                gender: '',
                address: '',
                phonenumber: '',
                email: '',
                role: '',
            }, // Khởi tạo account là null
            
        };
    },
    async mounted() {
        try {
            const accountId = LocalStorageHelper.getItem("id");
            if (accountId) {
                // Gọi API service để lấy thông tin tài khoản dựa trên id
                this.account = await AccountService.get(accountId);
            } else {
                console.error("No account id found in LocalStorage.");
            }
        } catch (error) {
            console.error("Error fetching account data:", error);
        }
    },
};
</script>

<style scoped>
/* Thêm các kiểu CSS tùy chỉnh cho trang chính */
</style>