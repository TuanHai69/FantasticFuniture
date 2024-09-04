<template>
    <div class="type-list">
        <h2>Danh sách các loại</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>Tên loại</th>
                    <th>Mô tả</th>
                    <th>User ID</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="type in types" :key="type._id">
                    <td>{{ type.name }}</td>
                    <td>{{ type.description }}</td>
                    <td>{{ type.userid }}</td>
                    <td>{{ type.state }}</td>
                    <td>
                        <button @click="selectType(type._id)" class="btn btn-primary">Chọn</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script>
export default {
    name: 'TypeList',
    props: {
        types: {
            type: Array,
            required: true,
        },
    },
    methods: {
        selectType(typeId) {
            this.$emit('select-type', typeId);
        },
    },
};

</script>

<style scoped>
.type-list {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.table th,
.table td {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: left;
}

.table th {
    background-color: #007bff;
    color: white;
}

.table tr:nth-child(even) {
    background-color: #f2f2f2;
}

.btn {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    padding: 5px 10px;
}

.btn:hover {
    background-color: #0056b3;
}
</style>
