<template>
  <div class="container mt-4 fixed-col">
    <h2>Categories</h2>
    <hr>
    <div class="row m-3 ">
      <div class="col-md-4" v-for="(category, index) in displayedCategories" :key="category.id">
        <div class="card mb-4 booode" @click="navigateToStore(category._id)">
          <img :src="storePicture(category.picture)" class="card-img-top shoplistcard" :alt="category.name">
          <div class="card-body">
            <h5 class="card-title">{{ category.name }}</h5>
            <div class="card-address">{{ category.address }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center">
      <button v-if="displayedCategories.length < categories.length" @click="loadMore" class="btn btn-primary mb-4">Hiển
        thị thêm</button>
    </div>
  </div>
</template>

<script>
import StoreService from "@/services/store.service"; // Đảm bảo đường dẫn đúng

export default {
  name: 'CategoryList',
  data() {
    return {
      categories: [],
      displayedCategories: [],
      itemsToShow: 9
    }
  },
  async created() {
    await this.fetchCategories();
    this.displayedCategories = this.categories.slice(0, this.itemsToShow);
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await StoreService.getAll();
        this.categories = response;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    loadMore() {
      const nextItems = this.displayedCategories.length + 6;
      if (nextItems <= this.categories.length) {
        this.displayedCategories = this.categories.slice(0, nextItems);
      } else {
        this.displayedCategories = this.categories;
      }
    },
    storePicture(picture) {
      if (picture) {
        return `data:image/jpeg;base64,${picture}`;
      }
      return 'https://th.bing.com/th?id=OIP.XqGBZKSVcAqsEghNyEn1wAHaE8&w=306&h=204&c=8&rs=1&qlt=90&r=0&o=6&dpr=1.1&pid=3.1&rm=2.jpg';
    },
    navigateToStore(storeId) {
      this.$router.push(`/shop/${storeId}`);
    }
  }
}
</script>

<style scoped>
.fixed-col {
    background-color: rgba(245, 245, 245, 0.8); 
    border: 2px solid #000000;
    padding: 10px;
    border-radius: 10px;
}
.booode {
  border: 2px solid #000000;
  padding: 10px;
  border-radius: 10px;
}
</style>