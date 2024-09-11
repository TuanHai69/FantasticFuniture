<template>
    <div class="container mt-4">
        <h2>Account List</h2>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Picture</th>
                    <th>Birthday</th>
                    <th>Gender</th>
                    <th>Address</th>
                    <th>Phone Number</th>
                    <th>Email</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(account, index) in accounts" :key="account.id">
                    <td>{{ account.username }}</td>
                    <td>{{ account.name }}</td>
                    <td><img :src="accountPicture(account.picture)" alt="Account Picture" class="img-thumbnail"
                            width="50"></td>
                    <td>{{ account.birthday }}</td>
                    <td>{{ account.gender }}</td>
                    <td>{{ account.address }}</td>
                    <td>{{ account.phonenumber }}</td>
                    <td>{{ account.email }}</td>
                    <td>{{ account.role }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import AccountsService from "@/services/accounts.service"; // Đảm bảo đường dẫn đúng

export default {
    name: 'AccountList',
    data() {
        return {
            accounts: []
        }
    },
    async created() {
        await this.fetchAccounts();
    },
    methods: {
        async fetchAccounts() {
            try {
                const response = await AccountsService.getAll();
                this.accounts = response;
            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        },
        accountPicture(picture) {
            if (picture) {
                return `data:image/jpeg;base64,${picture}`;
            }
            return 'https://via.placeholder.com/50';
        }
    }
}
</script>

<style scoped>
.img-thumbnail {
    border-radius: 50%;
}
</style>