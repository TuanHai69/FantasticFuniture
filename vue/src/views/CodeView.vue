<template>
    <AppHeader />
    <hr>
    <div class="container bg-whitesmoke p-4">
        <div class="row">
            <div class="col-md-5">
                <div class="card">
                    <div class="card-body">
                        <CodeForm @data-saved="handleDataSaved" :editData="editData" />
                    </div>
                </div>
            </div>
            <div class="col-md-7">
                <div class="card">
                    <div class="card-body">
                        <CodedList ref="codedList" @edit-coded="handleEditCoded" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CodeForm from '@/components/CodedForm.vue';
import CodedList from '@/components/CodedList.vue';
import AppHeader from "@/components/AppHeader.vue";

export default {
    components: {
        CodeForm,
        CodedList,
        AppHeader,
    },
    data() {
        return {
            editData: null,
        };
    },
    methods: {
        handleDataSaved() {
            this.$refs.codedList.fetchCodedList();
            this.editData = null;
        },
        handleEditCoded(coded) {
            this.editData = coded;
        },
    },
};
</script>

<style scoped>
.container {
    background-color: rgb(211, 209, 209);
    padding: 20px;
    border-radius: 8px;
}

.card {
    margin-bottom: 20px;
}
</style>