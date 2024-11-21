<template>
    <div class="comment-product-card p-3 border rounded" style="max-height: 500px; overflow-y: auto;">
        <h4>Đánh giá</h4>
        <div v-if="isLoading" class="loading">Loading comments...</div>
        <div v-else>
            <div v-if="!hasPurchased">Bạn chưa mua sản phẩm này, hãy mua hàng để đánh giá.</div>
            <div v-else-if="!hasCommented">
                <form @submit.prevent="submitComment" class="mb-4">
                    <div class="form-group mb-3">
                        <label><strong>Rate:</strong></label>
                        <div>
                            <span v-for="star in 5" :key="star" class="me-2">
                                <i :class="['fa-star', rate >= star ? 'fas' : 'far']" @click="rate = star"></i>
                            </span>
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
            <div v-if="visibleComments.length === 0" class="no-comments">Chưa có bình luận</div>
            <div v-else>
                <div v-for="comment in visibleComments" :key="comment._id" class="comment-card mb-3 p-2 border rounded">
                    <div class="row mb-2 p-3">
                        <div class="col-2">
                            <div class="text-center">
                                <img :src="productPicture(comment.userPicture)" alt="User Picture"
                                    class="user-picture img-fluid rounded-circle">
                            </div>
                        </div>
                        <div class="col-2">
                            <p><strong>{{ comment.userName }}</strong></p>
                            <hr>
                            <p>
                                <span v-for="(star, index) in getStarIcons(comment.rate)" :key="index"
                                    :class="star"></span>
                            </p>
                        </div>
                        <div class="col-7 comment-content border rounded">
                            <p>{{ comment.comment }}</p>
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
import CommentService from '@/services/comment.service';
import AccountsService from '@/services/accounts.service';
import StoreService from '@/services/store.service';
import LocalStorageHelper from '@/services/local.service';

export default {
    name: 'CommentProductCard',
    props: {
        productid: {
            type: String,
            required: true
        },
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
                return this.comments.filter(comment => comment.state !== '');
            }
            return this.comments.filter(comment => comment.state !== 'hide' && comment.state !== '' && comment.state !== 'Nopay');
        }
    },
    methods: {
        getStarIcons(rate) {
            const stars = [];
            for (let i = 1; i <= 5; i++) {
                stars.push(i <= rate ? 'fas fa-star' : 'far fa-star');
            }
            return stars;
        },
        async checkPurchaseStatus() {
            try {
                const userComments = await CommentService.findByUser(this.userId);
                if (userComments.length === 0) {
                    this.hasPurchased = false;
                } else {
                    const hasCommentedProduct = userComments.some(comment => comment.productid === this.productid && comment.state === '');
                    const hasCommented = userComments.some(comment => comment.productid === this.productid && (comment.state === 'show' || comment.state === 'hide'));
                    this.hasPurchased = hasCommentedProduct || hasCommented;
                    this.hasCommented = hasCommented;
                }
            } catch (error) {
                console.error('Error checking purchase status:', error);
            }
        },
        async fetchComments() {
            try {
                const comments = await CommentService.findByProduct(this.productid);
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
        async checkReportPermission() {
            try {
                const store = await StoreService.get(this.storeid);
                this.isStoreOwner = store.userid === this.userId || this.userRole === 'admin';
            } catch (error) {
                console.error('Error checking report permission:', error);
            }
        },
        async deleteComment(commentId) {
            if (confirm('Bạn có muốn xóa bình luận này hay không?')) {
                try {
                    const updatedComment = {
                        rate: "",
                        comment: "",
                        state: ""
                    };
                    await CommentService.update(commentId, updatedComment);
                    this.hasCommented = false;
                    await this.fetchComments();
                } catch (error) {
                    console.error('Error updating comment:', error);
                }
            }
        },
        async showComment(commentId) {
            try {
                if (confirm('Bạn có muốn hiện lại bình luận cho mọi người xem hay không?')) {
                    await CommentService.update(commentId, { state: 'show' });
                    await this.fetchComments();
                }
            } catch (error) {
                console.error('Error showing comment:', error);
            }
        },
        async reportComment(commentId) {
            try {
                if (confirm('Bạn có muốn báo cáo bình luận này không?')) {
                    await CommentService.update(commentId, { state: 'hide' });
                    await this.fetchComments();
                }
            } catch (error) {
                console.error('Error reporting comment:', error);
            }
        },
        async submitComment() {
            if (!this.rate || !this.commentText.trim()) {
                alert('Vui lòng chọn đánh giá và nhập bình luận.');
                return;
            }
            try {
                if (this.hasPurchased) {
                    const userComments = await CommentService.findByUser(this.userId);
                    const commentToUpdate = userComments.find(comment => comment.productid === this.productid && comment.state === '');

                    if (commentToUpdate) {
                        const updatedComment = {
                            ...commentToUpdate,
                            rate: this.rate,
                            comment: this.commentText,
                            state: 'show'
                        };
                        await CommentService.update(commentToUpdate._id, updatedComment);
                    }
                } else {
                    alert('Bạn chưa có bình luận nào để cập nhật.');
                }
                this.hasCommented = true;
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
.comment-product-card {
    max-height: 800px;
    overflow-y: auto;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
}

.fa-star {
    cursor: pointer;
    font-size: 1.5em;
    color: #ffd700;
}

.comment-card {
    border: 1px solid #ddd;
    background-color: #ffffff;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-picture {
    max-width: 100%;
    height: auto;
    max-height: 120px;
    border-radius: 50%;
    border: 1px solid #ccc;
    padding: 2px;
}

.loading {
    font-size: 1.2em;
    font-weight: bold;
    text-align: center;
}

.no-comments {
    font-size: 1.2em;
    font-weight: bold;
    text-align: center;
    color: #555;
}

.comment-content {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
    background-color: #fdfdfd;
}

.btn {
    border-radius: 5px;
    padding: 5px 10px;
}

.btn-danger {
    background-color: #dc3545;
    border: none;
    color: #fff;
}

.btn-warning {
    background-color: #ffc107;
    border: none;
    color: #000;
}

.btn-info {
    background-color: #17a2b8;
    border: none;
    color: #fff;
}

.form-group label {
    font-weight: bold;
}

.form-group input[type="radio"] {
    margin-right: 5px;
}

.form-group textarea {
    resize: vertical;
}
</style>
