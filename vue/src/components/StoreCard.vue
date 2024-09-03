<template>
    <div class="store-list">
        <h2>Danh sách cửa hàng</h2>
        <div v-if="stores.length">
            <div v-for="store in stores" :key="store._id" class="store-item row align-items-center">
                <div class="col-md-4 d-flex justify-content-center align-items-center">
                    <img :src="storePicture(store.picture)" alt="Store Picture" class="img-fluid rounded mx-auto d-block" />
                </div>
                <div class="col-md-8">
                    <h3>{{ store.name }}</h3>
                    <div class="row">
                        <div class="col-5">
                            <p><strong>Ngày thành lập:</strong> {{ store.birthday }}</p>
                            <p><strong>Số điện thoại:</strong> {{ store.phonenumber }}</p>
                            <p><strong>Giờ mở cửa:</strong> {{ store.opentime }}</p>
                        </div>
                        <div class="col-6">
                            <p><strong>Địa chỉ:</strong> {{ store.address }}</p>
                            <p><strong>Email:</strong> {{ store.email }}</p>
                            <p><strong>Trạng thái:</strong> {{ store.state }}</p>
                        </div>
                    </div>
                    <p><strong>Mô tả:</strong> {{ store.description }}</p>
                    <button @click="navigateToStore(store._id)" class="btn btn-primary position-absolute top-0 end-0 m-3">
                        Đến cửa hàng
                    </button>
                </div>
            </div>
        </div>
        <div v-else>
            <p>Không có cửa hàng nào.</p>
        </div>
    </div>
</template>

<script>
import StoreService from '@/services/store.service';

export default {
    props: {
        branchId: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            stores: [],
        };
    },
    async mounted() {
        await this.fetchStores();
    },
    methods: {
        async fetchStores() {
            try {
                this.stores = await StoreService.findByBranch(this.branchId);
            } catch (error) {
                console.error('Error fetching stores:', error);
                alert('Có lỗi xảy ra khi lấy danh sách cửa hàng.');
            }
        },
        storePicture(picture) {
            console.log(picture);
            if (picture) {
                return `data:image/jpeg;base64,${picture}`;
            }
            return 'https://th.bing.com/th?id=OIP.XqGBZKSVcAqsEghNyEn1wAHaE8&w=306&h=204&c=8&rs=1&qlt=90&r=0&o=6&dpr=1.1&pid=3.1&rm=2.jpg';
        },
        navigateToStore(storeId) {
            this.$router.push(`/shop/${storeId}`);
        },
    },
};
</script>

<style scoped>
.store-list {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.store-item {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    position: relative;
}

.img-fluid {
    max-width: 100%;
    height: auto;
    margin-bottom: 10px;
    max-height: 250px; /* Giới hạn chiều cao của hình ảnh */
}

.row.align-items-center {
    display: flex;
    align-items: center;
}

.btn-primary {
    position: absolute;
    top: 10px;
    right: 10px;
}
</style>
