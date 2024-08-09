<template>
    <div class="container shop-head-card bg-white">
        <div class="row justify-content-evenly">
            <div class=" col-5 image-container m-4">
                <img src="https://donggia.vn/wp-content/uploads/2019/11/thiet-ke-noi-that-phong-khach-chung-cu-dep-2020-12.jpg"
                    alt="Large Image" class="img-fluid large-image" />
            </div>
            <div class="col-6 text-container m-4">
                <p>ID: {{ id }}</p>
                <p>chi nhánh</p>
                <h3>Tên cửa hàng</h3>
                <p class="address">địa chỉ</p>
                <p class="review">
                    đánh giá:
                    <span class="negative">Tiêu cực 2222</span> /
                    <span class="positive">Bình thường 2222</span> /
                    <span class="recommend">tích cực 2222</span>
                </p>
                <p class="open">mở cửa</p>
                <p class="phone">Số điện thoại</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        id: {
            type: String,
            required: true
        }
    }
};
</script>

<style scoped>
/* Thêm các style tùy chỉnh ở đây */
</style>