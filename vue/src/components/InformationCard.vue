<template>
    <div class="container">
        <div class="row">
            <div class="col-md-6 account-details">
                <h2 class="text-center">Thông tin tài khoản</h2>
                <div>
                    <!-- Kiểm tra nếu account.picture không tồn tại hoặc trống -->
                    <img v-if="!account.picture"
                        src="https://th.bing.com/th?id=OIP.XqGBZKSVcAqsEghNyEn1wAHaE8&w=306&h=204&c=8&rs=1&qlt=90&r=0&o=6&dpr=1.1&pid=3.1&rm=2.jpg"
                        alt="Avatar" class="img-fluid rounded-circle mx-auto d-block" />
                    <!-- Ngược lại, sử dụng hình ảnh từ account.picture -->
                    <img v-else :src="account.picture" alt="Avatar" class="img-fluid rounded-circle mx-auto d-block" />
                </div>

            </div>
            <div class="col-md-6">
                <div class="account-details">
                    <div class="d-flex justify-content-between">
                        <p><strong>Tên người dùng:</strong> {{ account.username }}</p>
                        <button @click="goToAnotherPage" class="btn btn-link float-right">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                    </div>
                    <p><strong>Họ tên:</strong> {{ account.name }}</p>
                    <p><strong>Ngày sinh:</strong> {{ account.birthday }}</p>
                    <p><strong>Giới tính:</strong> {{ account.gender }}</p>
                    <p><strong>Địa chỉ:</strong> {{ account.address }}</p>
                    <p><strong>Số điện thoại:</strong> {{ account.phonenumber }}</p>
                    <p><strong>Email:</strong> {{ account.email }}</p>
                    <p><strong>Vai trò:</strong> {{ account.role }}</p>

                </div>

            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        account: Object, // Nhận thông tin tài khoản từ parent component
    },
    methods: {
        goToAnotherPage() {
            // Điều hướng đến trang khác khi nhấp vào biểu tượng hình bút viết
            this.$router.push({ name: "home" }); // Thay thế bằng tên trang thực tế
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
    max-width: 100%;
}
</style>