<template>
    <div class="container mt-4">
        <h2>Categories</h2>
        <div class="row m-3">
            <div class="col-md-3" v-for="(category, index) in displayedCategories" :key="category.id">
                <div class="card mb-4" @click="navigateToStore(category._id)">
                    <img :src="storePicture(category.picture)" class="card-img-top shoplistcard" :alt="category.name">
                    <div class="card-body">
                        <h5 class="card-title">{{ category.name }}</h5>
                        <div class="card-address">{{ category.address }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-center mb-4">
            <button v-if="displayedCategories.length < categories.length" @click="loadMore" class="btn btn-primary">Hiển
                thị thêm</button>
        </div>
    </div>
</template>

<script>
import StoreService from '@/services/store.service';

export default {
    name: 'CategoryList',
    data() {
        return {
            categories: [],
            displayedCategories: [],
            itemsToShow: 20
        }
    },
    async created() {
        try {
            const data = await StoreService.findByState('show');
            this.categories = data;
            this.displayedCategories = this.categories.slice(0, this.itemsToShow);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    },
    methods: {
        loadMore() {
            const nextItems = this.displayedCategories.length + 8;
            if (nextItems <= this.categories.length) {
                this.displayedCategories = this.categories.slice(0, nextItems);
            } else {
                this.displayedCategories = this.categories;
            }
        },
        storePicture(picture) {
            if (picture) {
                return `data:image/jpeg;base64,${picture}`;
            }
            return 'https://th.bing.com/th?id=OIP.XqGBZKSVcAqsEghNyEn1wAHaE8&w=306&h=204&c=8&rs=1&qlt=90&r=0&o=6&dpr=1.1&pid=3.1&rm=2.jpg';
        },
        navigateToStore(storeId) {
            this.$router.push(`/shop/${storeId}`);
        }
    }
}
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
    max-height: 250px;
    /* Giới hạn chiều cao của hình ảnh */
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
