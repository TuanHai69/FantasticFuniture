<template>
    <div class="container mt-4">
        <h2>Branch List</h2>
        <div class="row">
            <div class="col-md-12">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Birthday</th>
                            <th>Address</th>
                            <th>Phone Number</th>
                            <th>Email</th>
                            <th>Description</th>
                            <th>User ID</th>
                            <th>Store Count</th>
                            <th>State</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(branch, index) in branches" :key="branch.id">
                            <td>{{ branch.name }}</td>
                            <td>{{ branch.birthday }}</td>
                            <td>{{ branch.address }}</td>
                            <td>{{ branch.phonenumber }}</td>
                            <td>{{ branch.email }}</td>
                            <td>{{ branch.description }}</td>
                            <td>{{ branch.userid }}</td>
                            <td>
                                {{ branch.storecount }}
                                <button @click="viewBranch(branch)" class="btn btn-link">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </td>
                            <td>
                                <button @click="updateState(branch, 'accept')"
                                    :disabled="branch.state === 'accept'">Accept</button>
                                <button @click="updateState(branch, 'unaccept')"
                                    :disabled="branch.state === 'unaccept'">Unaccept</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import BranchService from "@/services/branch.service";
import AccountsService from "@/services/accounts.service"; // Đảm bảo đường dẫn đúng

export default {
    name: 'BranchList',
    data() {
        return {
            branches: []
        }
    },
    async created() {
        await this.fetchBranches();
    },
    methods: {
        async fetchBranches() {
            try {
                const response = await BranchService.getAll();
                this.branches = response;
            } catch (error) {
                console.error('Error fetching branches:', error);
            }
        },
        async updateState(branch, newState) {
            try {
                // Cập nhật state của branch
                branch.state = newState;
                await BranchService.update(branch._id, { state: newState });

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
        },
        viewBranch(branch) {
            this.$emit('view-branch', branch);
        }
    }
}
</script>

<style scoped></style>
