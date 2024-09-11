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
                            <td>{{ branch.storecount }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import BranchService from "@/services/branch.service"; // Đảm bảo đường dẫn đúng

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
        }
    }
}
</script>

<style scoped>
</style>