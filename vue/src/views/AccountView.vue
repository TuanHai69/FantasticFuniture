<template>
    <AppHeader />
    <hr>
    <div class="account-page">
        <AccountInfo v-if="!isEditing && !isRegistering && !isCreatingStore && !isUpdatingPassword" :account="account"
            :branch-data="branch" @edit="toggleEdit" @register="toggleRegister" @create-store="toggleCreateStore"
            @update-password="toggleUpdatePassword" />
        <UpdateAccountForm v-else-if="isEditing" :account="account" @update-account="updateAccount"
            @cancel="toggleEdit" />
        <BranchForm v-else-if="isRegistering" :branch="branch" @update-branch="updateBranch"
            @create-branch="createBranch" @cancel="toggleRegister" />
        <StoreForm v-else-if="isCreatingStore" :branch="branch" @create-store="createStore"
            @cancel="toggleCreateStore" />
        <Updatepass v-else :account="account" @update-account="updateAccount" @cancel="toggleUpdatePassword" />
    </div>
</template>

<script>
import AccountInfo from '@/components/InformationCard.vue'; // Đường dẫn tới component
import AppHeader from "@/components/AppHeader.vue";
import LocalStorageHelper from '@/services/local.service';
import AccountService from "@/services/accounts.service"; // Đường dẫn tới API service của account
import UpdateAccountForm from "@/components/AccountForm.vue";
import BranchForm from "@/components/BranchForm.vue"; // Đường dẫn tới component BranchForm
import BranchService from '@/services/branch.service';
import StoreForm from "@/components/StoreForm.vue";
import StoreService from '@/services/store.service'; // Đường dẫn tới API service của store
import Updatepass from '@/components/Updatepass.vue';

export default {
    name: 'AccountPage',
    components: {
        AccountInfo,
        AppHeader,
        UpdateAccountForm,
        BranchForm,
        StoreForm,
        Updatepass,
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
            branch: {
                name: '',
                birthday: '',
                address: '',
                phonenumber: '',
                email: '',
                description: '',
                userid: '',
                storecount: 1,
                state: '',
            },
            isEditing: false,
            isRegistering: false,
            isCreatingStore: false,
            isUpdatingPassword: false,
        };
    },
    async mounted() {
        try {
            const accountId = LocalStorageHelper.getItem("id");
            if (accountId) {
                // Gọi API service để lấy thông tin tài khoản dựa trên id
                this.account = await AccountService.get(accountId);
                const branchData = await BranchService.findByUser(accountId);
                if (branchData) {
                    this.branch = branchData[0];
                }
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
        toggleRegister() {
            this.isRegistering = !this.isRegistering;
        },
        toggleCreateStore() {
            this.isCreatingStore = !this.isCreatingStore;
        },
        toggleUpdatePassword() {
            this.isUpdatingPassword = !this.isUpdatingPassword;
        },
        async updateAccount(updatedAccount) {
            try {
                // console.log(updatedAccount.picture);
                await AccountService.update(updatedAccount._id, updatedAccount);
                this.account = updatedAccount;
                this.isEditing = false;
                this.isUpdatingPassword = false;
                alert('Cập nhật thông tin thành công!');
                this.$router.push('/account');
            } catch (error) {
                console.error('Error updating account:', error);
                alert('Có lỗi xảy ra khi cập nhật thông tin.');
            }
        },
        async updateBranch(updatedBranch) {
            try {
                // Gọi API để cập nhật thông tin chi nhánh
                await BranchService.update(updatedBranch._id, updatedBranch);
                this.branch = updatedBranch;
                this.isRegistering = false;
                alert('Cập nhật thông tin chi nhánh thành công!');
                this.$router.push('/account');
            } catch (error) {
                console.error('Error updating branch:', error);
                alert('Có lỗi xảy ra khi cập nhật thông tin chi nhánh.');
            }
        },
        async createBranch(newBranch) {
            try {
                await BranchService.create(newBranch);
                this.branch = newBranch;
                this.isRegistering = false;
                alert('Tạo chi nhánh mới thành công!');
                this.$router.push('/account');
            } catch (error) {
                console.error('Error creating branch:', error);
                alert('Có lỗi xảy ra khi tạo chi nhánh mới.');
            }
        },
        async createStore(newStore) {
            try {
                console.log(newStore);
                await StoreService.create(newStore);
                alert('Tạo cửa hàng mới thành công!');
                this.isCreatingStore = false;
                this.$router.push('/account');
            } catch (error) {
                console.error('Error creating store:', error);
                alert('Có lỗi xảy ra khi tạo cửa hàng mới.');
            }
        },
    },
};
</script>