<template>
    <div class="container shop-head-card bg-white" v-if="!loading">
        <div class="row justify-content-evenly">
            <div class="col-5 image-container m-4">
                <img :src="storePicture(store.picture)" alt="Large Image" class="img-fluid large-image" />
            </div>
            <div class="col-6 text-container m-4">
                <div class="row">
                    <div class="col-9">
                        <p>Chi nhánh: {{ store.branchid }}</p>
                        <h3>{{ store.name }}</h3>
                        <p class="address">Địa chỉ: {{ store.address }}</p>
                        <p class="review">
                            Đánh giá:
                            <span class="negative">Tiêu cực 2222</span> /
                            <span class="positive">Bình thường 2222</span> /
                            <span class="recommend">Tích cực 3333</span>
                        </p>
                        <p class="open">Mở cửa: {{ store.opentime }}</p>
                        <p class="phone">Số điện thoại: {{ store.phonenumber }}</p>
                    </div>
                    <div class="col-3">
                        <button @click="editStore" class="btn btn-secondary bg-primary">Chỉnh sửa</button>
                        <button @click="createProduct" class="btn btn-secondary bg-success mt-2">Tạo sản phẩm</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="loading">
        <div class="spinner-border" role="status">
            <span class="sr-only">Đang tải dữ liệu...</span>
        </div>
    </div>
</template>

<script>
import StoreService from '@/services/store.service'; // Giả sử bạn có service này

export default {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            store: {},
            loading: true // Biến trạng thái để kiểm soát việc hiển thị
        };
    },
    async mounted() {
        await this.fetchStoreData();
    },
    methods: {
        async fetchStoreData() {
            try {
                this.store = await StoreService.get(this.id);
                this.loading = false;
            } catch (error) {
                console.error('Error fetching store data:', error);
                alert('Có lỗi xảy ra khi lấy thông tin cửa hàng.');
                this.loading = false;
                this.$router.push(`/home`);
            }
        },
        storePicture(picture) {
            if (picture) {
                return `data:image/jpeg;base64,${picture}`;
            }
            return 'https://donggia.vn/wp-content/uploads/2019/11/thiet-ke-noi-that-phong-khach-chung-cu-dep-2020-12.jpg';
        },
        editStore() {
            this.$emit('edit-store', this.store._id);
        },
        createProduct() {
            this.$emit('create-product');
        }
    }
};
</script>

<style scoped>
.image-container {
    max-height: 250px;
    overflow: hidden;
}

.large-image {
    max-height: 250px;
    object-fit: cover;
}

.loading {
    text-align: center;
    padding: 20px;
    font-size: 18px;
}

.spinner-border {
    width: 3rem;
    height: 3rem;
    border-width: 0.3rem;
}
</style>
