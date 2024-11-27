<template>
    <div class="container mt-4 ">
        <h2 class="text-white">Danh sách tài khoản</h2>
        <div class="row">
            <div class="col-12">
                <table class="table table-striped m-4">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Tên người dùng</th>
                            <th>Ảnh</th>
                            <th>Ngày sinh</th>
                            <th>Giới tính</th>
                            <th>Địa chỉ</th>
                            <th>Số điện thoại</th>
                            <th>Email</th>
                            <th>Vai trò</th>
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
                            <td>
                                <template v-if="account.role === 'storeowner'">
                                    {{ account.role }}
                                </template>
                                <template v-else>
                                    <select v-model="account.role" @change="updateRole(account._id, account.role)">
                                        <option value="admin">Admin</option>
                                        <option value="client">Client</option>
                                    </select>
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import AccountsService from "@/services/accounts.service";
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
        },
        async updateRole(id, role) {
            try {
                await AccountsService.update(id, { role });
                alert('Cập nhật thành công quyền của tài khoản');
            } catch (error) {
                console.error('Error updating role:', error);
            }
        },
    }
}
</script>

<style scoped>
.img-thumbnail {
    border-radius: 50%;
}
</style>