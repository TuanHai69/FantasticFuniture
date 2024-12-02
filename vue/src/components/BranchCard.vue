<template>
    <div class="container mt-4">
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">Tên chuỗi cửa hàng: {{ branch.name }}</h5>
                <table class="table table-bordered">
                    <tbody>
                        <tr>
                            <th>Ngày thành lập</th>
                            <td>{{ branch.birthday }}</td>
                        </tr>
                        <tr>
                            <th>Địa chỉ</th>
                            <td>{{ branch.address }}</td>
                        </tr>
                        <tr>
                            <th>Số điện thoại</th>
                            <td>{{ branch.phonenumber }}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{{ branch.email }}</td>
                        </tr>
                        <tr>
                            <th>Mô tả</th>
                            <td>{{ branch.description }}</td>
                        </tr>
                        <tr>
                            <th>Tài khoản thành lập cửa hàng</th>
                            <td>{{ branch.userName }}</td>
                        </tr>
                        <tr>
                            <th>Số lượng cửa hàng</th>
                            <td>{{ branch.storecount }}</td>
                        </tr>
                        <tr>
                            <th>Trạng thái</th>
                            <td>{{ branch.state }}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="row justify-content-evenly">
                    <div class="col-10">
                        <button @click="updateState(branch, 'accept')" :disabled="branch.state === 'accept'"
                            class="btn btn-success">Accept</button>
                        <button @click="updateState(branch, 'unaccept')" :disabled="branch.state === 'unaccept'"
                            class="btn btn-danger">Unaccept</button>
                    </div>
                    <div class="col-2">
                        <button @click="$emit('back')" class="btn btn-secondary">Back</button>
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-12" v-if="branch._id && branch.state != 'unaccept'">
                        <StoreCard :branchId="branch._id" />
                    </div>
                </div>


            </div>
        </div>
    </div>
</template>

<script>
import BranchService from "@/services/branch.service";
import AccountsService from "@/services/accounts.service"; // Đảm bảo đường dẫn đúng
import StoreCard from '@/components/StoreCard.vue';

export default {
    name: 'BranchCard',
    props: {
        branch: {
            type: Object,
            required: true
        }
    },
    components: {
        StoreCard,
    },
    methods: {
        async updateState(branch, newState) {
            try {
                // Cập nhật state của branch
                branch.state = newState;
                await BranchService.update(branch.id, { state: newState });

                // Cập nhật role của account dựa trên state mới
                const account = await AccountsService.get(branch.userid);
                if (newState === 'accept') {
                    account.role = 'storeowner';
                } else if (newState === 'unaccept') {
                    account.role = 'client';
                }
                
                await AccountsService.update(branch.userid, { role: account.role });
            } catch (error) {
                console.error('Error updating state:', error);
            }
        }
    }
}
</script>

<style scoped>
.card {
    margin-bottom: 1rem;
}
</style>
