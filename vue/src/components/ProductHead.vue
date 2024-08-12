<template>
    <div class="container shop-head-card bg-white">
        <div class="row justify-content-evenly">
            <div class=" col-5 image-container m-4">
                <img src="https://donggia.vn/wp-content/uploads/2019/11/thiet-ke-noi-that-phong-khach-chung-cu-dep-2020-12.jpg"
                    alt="Large Image" class="img-fluid large-image" />
            </div>
            <div class="col-6 text-container m-4">
                <h3>Tên sản phẩm <p>ID: {{ id }}</p>
                </h3>
                <p>Giá</p>
                <p>Vật liệu</p>

                <p class="address">kích thước</p>
                <p class="review">
                    đánh giá:
                    <span class="negative">Tiêu cực 2222</span> /
                    <span class="positive">Bình thường 2222</span> /
                    <span class="recommend">tích cực 2222</span>
                </p>
                <p class="open">Danh mục</p>
                <p class="phone">Số lượng</p>
                <nav>
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab"
                            data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home"
                            aria-selected="true">Mô tả</button>
                        <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile"
                            type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Đánh giá</button>
                        <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact"
                            type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Bảo hành</button>
                        <button class="nav-link" id="nav-move-tab" data-bs-toggle="tab" data-bs-target="#nav-move"
                            type="button" role="tab" aria-controls="nav-move" aria-selected="false">Vận chuyển</button>
                    </div>
                </nav>
                <div class="tab-content" id="nav-tabContent">
                    <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                        aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaâ</div>
                    <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">...
                    </div>
                    <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">...
                    </div>
                    <div class="tab-pane fade" id="nav-move" role="tabpanel" aria-labelledby="nav-move-tab">Vận chuyển
                    </div>
                </div>
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