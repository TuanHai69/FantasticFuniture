<template>
    <div class="comment-store-card p-3 border rounded" style="max-height: 600px; overflow-y: auto;">
        <h4>Đánh giá</h4>
        <div v-if="isLoading" class="loading">
            Loading comments...
        </div>
        <div v-else>
            <div v-if="!hasPurchased">
                Bạn chưa mua hàng từ cửa hàng này, hãy mua hàng để đánh giá.
            </div>
            <div v-else-if="!hasCommented">
                <form @submit.prevent="submitComment" class="mb-4">
                    <div class="form-group mb-3">
                        <label><strong>Rate:</strong></label>
                        <div>
                            <label class="me-3">
                                <input type="radio" value="Tiêu cực" v-model="rate" required> Tiêu cực
                            </label>
                            <label class="me-3">
                                <input type="radio" value="Bình thường" v-model="rate" required> Bình thường
                            </label>
                            <label>
                                <input type="radio" value="Tích cực" v-model="rate" required> Tích cực
                            </label>
                        </div>
                    </div>
                    <div class="form-group mb-3">
                        <label for="comment"><strong>Comment:</strong></label>
                        <textarea id="comment" v-model="commentText" class="form-control" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
            <hr>
            <div v-if="visibleComments.length === 0" class="no-comments">
                Chưa có bình luận
            </div>
            <div v-else>
                <div v-for="comment in visibleComments" :key="comment._id" class="comment-card mb-3 p-2 border rounded">
                    <div class="row mb-2 p-3">
                        <div class="col-2">
                            <div class="">
                                <img :src="productPicture(comment.userPicture)" alt="User Picture"
                                    class="user-picture img-fluid rounded-circle">
                            </div>
                        </div>
                        <div class="col-2">
                            <p><strong>{{ comment.userName }}</strong></p>
                            <hr>
                            <p>Rate: {{ comment.rate }}</p>
                        </div>
                        <div class="col-7 comment-content border rounded">
                            <p>{{ comment.commentstore }}</p>
                        </div>
                        <div class="col-1 d-flex flex-column justify-content-around">
                            <button v-if="comment.userid === userId" @click="deleteComment(comment._id)"
                                class="btn btn-danger btn-sm">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                            <button v-if="isStoreOwner && comment.state !== 'hide'" @click="reportComment(comment._id)"
                                class="btn btn-warning btn-sm mt-2">
                                <i class="fas fa-flag"></i>
                            </button>
                            <button v-if="isStoreOwner && comment.state === 'hide'" @click="showComment(comment._id)"
                                class="btn btn-info btn-sm mt-2">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<script>
import CommentStoreService from '@/services/commentstore.service';
import AccountsService from '@/services/accounts.service';
import OrderService from '@/services/order.service';
import StoreService from '@/services/store.service';
import LocalStorageHelper from '@/services/local.service';

export default {
    name: 'CommentStoreCard',
    props: {
        storeid: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            comments: [],
            isLoading: true,
            hasPurchased: false,
            rate: '',
            commentText: '',
            hasCommented: false,
            isStoreOwner: false,
            userId: LocalStorageHelper.getItem('id'),
            userRole: LocalStorageHelper.getItem('role'),
        };
    },

    async mounted() {
        await this.checkPurchaseStatus();
        await this.fetchComments();
        await this.checkReportPermission();
    },
    computed: {
        visibleComments() {
            if (this.isStoreOwner) {
                return this.comments;
            }
            return this.comments.filter(comment => comment.state !== 'hide');
        }
    },
    methods: {
        async checkPurchaseStatus() {
            try {
                const orders = await OrderService.findByUserIdAndStoreId(this.userId, this.storeid);
                this.hasPurchased = orders.some(order => order.state === 'Received');
            } catch (error) {
                console.error('Error checking purchase status:', error);
            }
        },
        async deleteComment(commentId) {
            if (confirm('Bạn có muốn xóa bình luận này hay không?')) {
                try {
                    await CommentStoreService.delete(commentId);
                    await this.fetchComments();
                } catch (error) {
                    console.error('Error deleting comment:', error);
                }
            }
        },
        async checkReportPermission() {
            try {
                const store = await StoreService.get(this.storeid);
                this.isStoreOwner = store.userid === this.userId || this.userRole === 'admin';
            } catch (error) {
                console.error('Error checking report permission:', error);
            }
        },
        async showComment(commentId) {
            try {
                if (confirm('Bạn có muốn hiện lại bình luận cho mọi người xem hay không?')) {
                    await CommentStoreService.update(commentId, { state: 'show' });
                    await this.fetchComments();
                }
            } catch (error) {
                console.error('Error showing comment:', error);
            }
        },
        async reportComment(commentId) {
            try {
                if (confirm('Bạn có muốn báo cáo bình luận này không?')) {
                    await CommentStoreService.update(commentId, { state: 'hide' });
                    await this.fetchComments();
                }
            } catch (error) {
                console.error('Error reporting comment:', error);
            }
        },

        async fetchComments() {
            try {
                const comments = await CommentStoreService.findByStore(this.storeid);
                this.hasCommented = comments.some(comment => comment.userid === this.userId);
                await Promise.all(comments.map(async comment => {
                    const user = await AccountsService.get(comment.userid);
                    comment.userName = user.name;
                    comment.userPicture = user.picture;
                }));
                this.comments = comments;
            } catch (error) {
                console.error('Error fetching comments:', error);
            } finally {
                this.isLoading = false;
            }
        },
        async submitComment() {
            if (!this.rate || !this.commentText.trim()) {
                alert('Vui lòng chọn đánh giá và nhập bình luận.');
                return;
            }

            try {
                const newComment = {
                    userid: this.userId,
                    storeid: this.storeid,
                    rate: this.rate,
                    commentstore: this.commentText,
                    state: 'show'
                };
                await CommentStoreService.create(newComment);
                this.commentText = '';
                this.rate = '';
                await this.fetchComments();
            } catch (error) {
                console.error('Error submitting comment:', error);
            }
        },

        productPicture(picture) {
            if (picture) {
                return `data:image/jpeg;base64,${picture}`;
            }
            return 'https://th.bing.com/th?id=OIP.XqGBZKSVcAqsEghNyEn1wAHaE8&w=306&h=204&c=8&rs=1&qlt=90&r=0&o=6&dpr=1.1&pid=3.1&rm=2.jpg';
        },
    }
};
</script>

<style scoped>
.comment-store-card {
    max-height: 800px;
    overflow-y: auto;
}

.comment-card {
    border: 1px solid #ddd;
}

.user-picture {
    max-width: 100%;
    height: auto;
}

.loading {
    font-size: 1.2em;
    font-weight: bold;
}

.no-comments {
    font-size: 1.2em;
    font-weight: bold;
    text-align: center;
}

.comment-content {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
}
</style>
