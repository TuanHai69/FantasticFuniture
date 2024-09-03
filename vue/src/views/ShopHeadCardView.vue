<template>
    <AppHeader />
    <div class="shopcardbg">
        <div class="container-fluid ">
            <div class="page row">
                <div class="offset-1 col-md-10">
                    <div v-if="!editingStoreId">
                        <div class="d-flex justify-content-center mt-3" v-if="id">
                            <ShopHeadCard :id="id" @edit-store="handleEditStore" />
                        </div>
                        <ShopBodyCard />
                    </div>
                    <StoreForm v-else :storeId="editingStoreId" @cancel="handleCancelEdit" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import ShopHeadCard from "@/components/ShopHeadCard.vue";
import ShopBodyCard from "@/components/ShopBodyCard.vue";
import StoreForm from "@/components/StoreForm.vue";
export default {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    components: {
        AppHeader,
        ShopHeadCard,
        ShopBodyCard,
        StoreForm,
    },
    data() {
        return {
            editingStoreId: null
        };
    },
    methods: {
        handleEditStore(storeId) {
            this.editingStoreId = storeId;
        },
        handleCancelEdit() {
            this.editingStoreId = null;
        }
    }
};
</script>