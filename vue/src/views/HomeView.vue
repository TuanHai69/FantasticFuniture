<template>
    <AppHeader />
    <div class="homebg">
        <div class="container-fluid ">
            <div class="page row">
                <div class="offset-1 col-md-4 fixed-col mt-4">
                    <h2>Danh mục</h2>
                    <hr>
                    <button v-for="type in types" :key="type._id" class="water-drop-button"
                        @click="handleTypeClick(type)">
                        {{ type.name }}
                    </button>
                </div>
                <div class="col-md-6">
                    <div class="shopbg">
                        <ShopList />
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    </div>
    
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import ShopCard from "@/components/ShopCard.vue";
import ShopList from "@/components/ShopList.vue";
import TypeService from "@/services/type.service";
import Footer from "@/components/Footer.vue";
export default {
    components: {
        AppHeader,
        ShopCard,
        ShopList,
        Footer,
    },
    data() {
        return {
            types: [],
        }
    },
    async mounted() {
        await this.fetchTypes();
    },
    methods: {
        async fetchTypes() {
            try {
                this.types = await TypeService.getAll();
            } catch (error) {
                console.error('Error fetching types:', error);
            }
        },
        handleTypeClick(type) {
            this.$router.push({ name: 'products', params: { id: type._id } });
        },
    },

};
</script>
<style scoped>
.water-drop-button {
    background-color: #1E90FF;
    /* Dodger Blue */
    color: white;
    border: none;
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    /* Water drop shape */
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.water-drop-button:hover {
    transform: scale(1.05);
}

.water-drop-button:active {
    transform: scale(0.95);
}

.fixed-col {
    background-color: rgba(245, 245, 245, 0.8); 
    border: 2px solid #000000;
    /* Màu viền */
    padding: 10px;
    /* Khoảng cách giữa nội dung và viền */
    border-radius: 10px;
    /* Bo tròn các góc viền */
}

</style>