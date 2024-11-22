<template>
    <div class="container shop-head-card bg-white" v-if="!loading">
        <div class="row justify-content-evenly">
            <div class="col-5 image-container m-4">
                <img :src="storePicture(store.picture)" alt="Large Image" class="img-fluid large-image" />
            </div>
            <div class="col-6 text-container m-4">
                <div class="row">
                    <div class="col-10">
                        <h3>{{ store.name }}</h3>
                        <p class="address">Địa chỉ: {{ store.address }}</p>
                        <div class="row align-items-center">
                            <div class="col">
                                <p class="review">Đánh giá:
                                    <span v-for="(star, index) in getStarIcons(averageRating)" :key="index"
                                        :class="star"></span>
                                    <span>({{ averageRating }})</span>
                                </p>
                            </div>
                            <div class="col-auto">
                                <button class="btn btn-follow" @click="toggleFollow">
                                    {{ isFollowed ? 'Đã theo dõi' : 'Theo dõi' }}
                                </button>
                            </div>
                        </div>

                        <p class="open">Mở cửa: {{ store.opentime }}</p>
                        <p class="phone">Số điện thoại: {{ store.phonenumber }}</p>
                        <p class="description">Về chúng tôi: {{ store.description }}</p>

                    </div>
                    <div class="col-2" v-if="isStoreOwner">
                        <button v-if="isStoreOwner" @click="editStore" class="btn btn-secondary bg-primary">Chỉnh
                            sửa</button>
                        <button v-if="isStoreOwner" @click="createProduct" class="btn btn-secondary bg-success mt-2">Tạo
                            sản phẩm</button>
                        <button v-if="isStoreOwner" @click="viewCart" class="btn btn-secondary bg-info mt-2">Đơn
                            hàng</button>
                        <button v-if="isStoreOwner" @click="viewRevenue" class="btn btn-secondary bg-warning mt-2">Doanh
                            thu</button>
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
import StoreService from '@/services/store.service';
import LocalStorageHelper from '@/services/local.service';
import CommentstoreService from '@/services/commentstore.service';

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
            loading: true,
            isStoreOwner: false,
            userId: LocalStorageHelper.getItem('id'),
            userRole: LocalStorageHelper.getItem('role'),
            isFollowed: false,
        };
    },
    async mounted() {
        await this.fetchStoreData();
        await this.checkReportPermission();
        await this.checkFollowStatus();
    },
    methods: {
        async toggleFollow() {
            const userId = this.userId;
            if (!userId) {
                alert('Bạn cần đăng nhập để theo dõi cửa hàng'); return;
            }
            try {
                const userComments = await CommentstoreService.findByUser(userId);
                const existingComment = userComments.find(comment => comment.storeid === this.id);
                if (!existingComment) { // Create a new follow commentstore 
                    const commentstore = {
                        userid: this.userId,
                        storeid: this.id,
                        rate: "",
                        commentstore: "",
                        state: "Nopay",
                        like: true,
                    };
                    await CommentstoreService.create(commentstore);
                    await this.checkFollowStatus();
                } else { 
                    await CommentstoreService.update(existingComment._id, { like: !existingComment.like });
                    this.isFollowed = !existingComment.like;
                    await this.checkFollowStatus();
                }
            } catch (error) {
                console.error('Error toggling follow status:', error);
            }
        },
        async checkFollowStatus() {
            const userId = this.userId;
            if (!userId) {
                return;
            }
            try {
                const response = await CommentstoreService.isLiked(userId, this.id);
                this.isFollowed = response.length > 0 && response[0].like === true;
            } catch (error) {
                console.error('Error checking follow status:', error);
            }
        },
        async fetchStoreData() {
            try {
                this.store = await StoreService.get(this.id);
                const comments = await CommentstoreService.findByStore(this.id);
                this.calculateAverageRating(comments);
                this.loading = false;
            } catch (error) {
                console.error('Error fetching store data:', error);
                alert('Có lỗi xảy ra khi lấy thông tin cửa hàng.');
                this.loading = false;
                this.$router.push(`/home`);
            }
        },
        calculateAverageRating(comments) {
            let totalRating = 0;
            let ratingCount = comments.length;

            comments.forEach(comment => {
                totalRating += parseInt(comment.rate, 10);
            });

            this.averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0;
        },
        async checkReportPermission() {
            try {
                const store = await StoreService.get(this.store._id);
                this.isStoreOwner = store.userid === this.userId;
            } catch (error) {
                console.error('Error checking report permission:', error);
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
        },
        viewCart() {
            this.$emit('view-cart');
        },
        viewRevenue() {
            this.$emit('view-revenue');
        },
        getStarIcons(rate) {
            const fullStars = Math.floor(rate);
            const halfStar = rate % 1 !== 0;
            const stars = [];

            for (let i = 1; i <= 5; i++) {
                if (i <= fullStars) {
                    stars.push('fas fa-star');
                } else if (i === fullStars + 1 && halfStar) {
                    stars.push('fas fa-star-half-alt');
                } else {
                    stars.push('far fa-star');
                }
            }
            return stars;
        }
    }
};
</script>

<style scoped>
.btn-follow {
    background-color: #007bff;
    border: none;
    color: white;
    padding: 5px 10px;
    cursor: pointer;
}

.btn-follow:hover {
    background-color: #0056b3;
}

.image-container {
    max-height: 250px;
    overflow: hidden;
}

.fa-star,
.fa-star-half-alt,
.far.fa-star {
    color: #ffd700;
    font-size: 1.2em;
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
