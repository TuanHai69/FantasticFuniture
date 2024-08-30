<template>
    <AppHeader />
    <hr>
    <div class="account-page">
        <AccountInfo v-if="!isEditing" :account="account" @edit="toggleEdit" />
        <UpdateAccountForm v-else :account="account" @update-account="updateAccount" @cancel="toggleEdit" />
    </div>
</template>

<script>
import AccountInfo from '@/components/InformationCard.vue'; // Đường dẫn tới component
import AppHeader from "@/components/AppHeader.vue";
import LocalStorageHelper from '@/services/local.service';
import AccountService from "@/services/accounts.service"; // Đường dẫn tới API service của account
import UpdateAccountForm from "@/components/AccountForm.vue";
export default {
    name: 'AccountPage',
    components: {
        AccountInfo,
        AppHeader,
        UpdateAccountForm,
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
            isEditing: false,

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
    methods: {
        toggleEdit() {
            this.isEditing = !this.isEditing;
        },
        async updateAccount(updatedAccount) {
            try {
                console.log(updatedAccount.picture);
                await AccountService.update(updatedAccount._id, updatedAccount);
                this.account = updatedAccount;
                this.isEditing = false;
                alert('Cập nhật thông tin thành công!');
                this.$router.push('/account');
            } catch (error) {
                console.error('Error updating account:', error);
                alert('Có lỗi xảy ra khi cập nhật thông tin.');
            }
        },
    },
};
</script>

<style scoped>
/* Thêm các kiểu CSS tùy chỉnh cho trang chính */
</style>