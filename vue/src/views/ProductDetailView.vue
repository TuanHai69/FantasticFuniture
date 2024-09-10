<template>
    <AppHeader />
    <div class="shopcardbg">
        <div class="container-fluid ">
            <div class="page row">
                <div class="offset-1 col-md-10">
                    <div class="d-flex justify-content-center mt-3">
                        <ProductHead :id=id />
                    </div>
                </div>
                <ShopBodyCard :storeid="this.product.storeid" v-if="this.product.storeid"/>
                <ProductCard />
            </div>
        </div>
    </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import ProductHead from "@/components/ProductHead.vue";
import ProductCard from "@/components/ProductCard.vue";
import ShopBodyCard from "@/components/ShopBodyCard.vue";
import ProductService from "@/services/product.service";

export default {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            product: {},
        };
    },
    components: {
        AppHeader,
        ProductHead,
        ProductCard,
        ShopBodyCard,
    },
    mounted() {
        this.fetchProduct();
    },
    methods: {
        async fetchProduct() {
            try {
                const response = await ProductService.get(this.id);
                this.product = response;
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        }

    }

};
</script>