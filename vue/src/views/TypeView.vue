<template>
    <div class="type-view container">
        <div class="row">
            <div class="col-md-4">
                <TypeForm :type="selectedType" @create-type="handleCreateType" @update-type="handleUpdateType"
                    @cancel="handleCancel" />
            </div>
            <div class="col-md-8">
                <TypeList :types="types" @select-type="handleSelectType" />
            </div>
        </div>
    </div>
</template>

<script>
import TypeForm from '@/components/TypeForm.vue';
import TypeList from '@/components/TypeList.vue';
import TypeService from '@/services/type.service';

export default {
    name: 'TypeView',
    components: {
        TypeForm,
        TypeList,
    },
    data() {
        return {
            types: [],
            selectedType: {},
        };
    },
    async mounted() {
        this.fetchTypes();
    },
    methods: {
        async fetchTypes() {
            try {
                this.types = await TypeService.getAll();
            } catch (error) {
                console.error('Error fetching types:', error);
            }
        },
        async handleCreateType(newType) {
            try {
                await TypeService.create(newType);
                alert('Tạo type mới thành công!');
                this.fetchTypes();
            } catch (error) {
                console.error('Error creating type:', error);
                alert('Có lỗi xảy ra khi tạo type mới.');
            }
        },
        async handleUpdateType(updatedType) {
            try {
                await TypeService.update(updatedType._id, updatedType)
                alert('Cập nhật thông tin type thành công!');
                this.fetchTypes();
            } catch (error) {
                console.error('Error updating type:', error);
                alert('Có lỗi xảy ra khi cập nhật thông tin type.'); 
            }
        },
        handleSelectType(typeId) {
            this.selectedType = this.types.find(type => type._id === typeId) || {};
        },
        handleCancel() {
            this.selectedType = {};
        },
    },
};

</script>

<style scoped>
.type-view {
    padding: 20px;
}

.col-md-4,
.col-md-8 {
    padding: 10px;
}
</style>