<template>
    <div class="container">
        <h2 class="mb-4">Coded List</h2>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Percent</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>State</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="coded in codedList" :key="coded.id">
                    <td>{{ coded.code }}</td>
                    <td>{{ coded.percent }}</td>
                    <td>{{ new Date(coded.start).toLocaleDateString() }}</td>
                    <td>{{ new Date(coded.end).toLocaleDateString() }}</td>
                    <td>{{ coded.state }}</td>
                    <td>
                        <button class="btn btn-outline-success btn-sm " @click="editCoded(coded)">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import CodedService from '@/services/coded.service';

export default {
    data() {
        return {
            codedList: [],
        };
    },
    async created() {
        this.fetchCodedList();
    },
    methods: {
        async fetchCodedList() {
            try {
                this.codedList = await CodedService.getAll();
            } catch (error) {
                console.error('Error fetching coded list:', error);
            }
        },
        editCoded(coded) {
            this.$emit('edit-coded', coded);
        },
    },
};
</script>

<style scoped>
/* Add your styles here */
</style>