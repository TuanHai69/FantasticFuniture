<template>
    <div class="container">
        <div class="row">
            <div class="col-md-6 account-details">
                <h2 class="text-center">Thông tin tài khoản</h2>
                <div>

                    <img :src="accountPicture" alt="Avatar" class="img-fluid rounded-circle mx-auto d-block" />

                </div>

            </div>
            <div class="col-md-6">
                <div class="account-details">
                    <div class="d-flex justify-content-between">
                        <p><strong>Tên người dùng:</strong> {{ account.username }}</p>
                        <button @click="$emit('edit')" class="btn btn-link float-right">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                    </div>
                    <p><strong>Họ tên:</strong> {{ account.name }}</p>
                    <p><strong>Ngày sinh:</strong> {{ account.birthday }}</p>
                    <p><strong>Giới tính:</strong> {{ account.gender }}</p>
                    <p><strong>Địa chỉ:</strong> {{ account.address }}</p>
                    <p><strong>Số điện thoại:</strong> {{ account.phonenumber }}</p>
                    <p><strong>Email:</strong> {{ account.email }}</p>
                    <p>
                        <strong>Vai trò:</strong> {{ account.role }} || 
                        <button @click="$emit('register')" class="btn btn-primary">Đăng ký bán hàng</button>||
                        <button v-if="branchData._id" @click="$emit('create-store')" class="btn btn-primary">Tạo cửa
                            hàng</button>
                    </p>

                </div>

            </div>
            <div class="col-12" v-if="branchData._id">
                <StoreCard :branchId="branchData._id" />
            </div>
        </div>
    </div>
</template>

<script>
import StoreCard from '@/components/StoreCard.vue';

export default {
    components: {
        StoreCard,
    },
    props: {
        account: Object, // Nhận thông tin tài khoản từ parent component
        branchData: Object, // Nhận thông tin chi nhánh từ parent component
    },
    computed: {
        accountPicture() {
            if (this.account.picture) {
                return `data:image/jpeg;base64,${this.account.picture}`;
            }
            return 'https://th.bing.com/th?id=OIP.XqGBZKSVcAqsEghNyEn1wAHaE8&w=306&h=204&c=8&rs=1&qlt=90&r=0&o=6&dpr=1.1&pid=3.1&rm=2.jpg';
        },
    },
};
</script>

<style scoped>
.account-details {
    padding: 20px;
    background-color: #d4cdcd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.img-fluid {
    height: 270px;
    max-width: 100%;
}
</style>