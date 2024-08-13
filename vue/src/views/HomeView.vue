<template>
    <AppHeader />
    <div class="homebg">
        <div class="container-fluid ">
            <div class="page row">
                <div class="offset-1 col-md-4 fixed-col">
                    <!-- Nội dung cột cố định -->
                    <h2>Fixed Column</h2>
                    <p>Đây là cột cố định không bị ảnh hưởng khi cuộn trang.</p>
                </div>
                <div class="col-md-6" >
                    <div class="shopbg">
                        <ShopList />
                    </div>                    
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import ShopCard from "@/components/ShopCard.vue";
import ShopList from "@/components/ShopList.vue";
export default {
    components: {
        AppHeader,
        ShopCard,
        ShopList,
    },
 
};
</script>