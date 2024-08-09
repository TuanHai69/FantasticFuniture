<template>
    <div class="container mt-4">
        <h2>Categories</h2>
        <div class="row m-3">
            <div class="col-md-3" v-for="(category, index) in displayedCategories" :key="category.id">
                <div class="card mb-4">
                    <img :src="category.image" class="card-img-top shoplistcard" :alt="category.name">
                    <div class="card-body">
                        <h5 class="card-title">{{ category.name }}</h5>
                        <div class="card-address">{{ category.address }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-center mb-4">
            <button v-if="displayedCategories.length < categories.length" @click="loadMore" class="btn btn-primary">Hiển
                thị
                thêm</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CategoryList',
    data() {
        return {
            categories: [
                { id: 1, address: 'Số 213012 ,Ấp AAAAA, Xã BBBBBBBBBB, Huyện CCCCCCC, Tĩnh DDDDDD', name: 'Category 1', image: 'https://donggia.vn/wp-content/uploads/2019/11/thiet-ke-noi-that-phong-khach-chung-cu-dep-2020-12.jpg' },
                { id: 2, address: 'Số 213012 ,Ấp AAAAA, Xã BBBBBBBBBB, Huyện CCCCCCC, Tĩnh DDDDDD', name: 'Category 2', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 3, address: 'Số 213012 ,Ấp AAAAA, Xã BBBBBBBBBB, Huyện CCCCCCC, Tĩnh DDDDDD', name: 'Category 3', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 4, address: 'Số 213012 ,Ấp AAAAA, Xã BBBBBBBBBB, Huyện CCCCCCC, Tĩnh DDDDDD', name: 'Category 4', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 5, address: 'Số 213012 ,Ấp AAAAA, Xã BBBBBBBBBB, Huyện CCCCCCC, Tĩnh DDDDDD', name: 'Category 5', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 6, address: 'Số 213012 ,Ấp AAAAA, Xã BBBBBBBBBB, Huyện CCCCCCC, Tĩnh DDDDDD', name: 'Category 6', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 7, address: 'Số 213012 ,Ấp AAAAA, Xã BBBBBBBBBB, Huyện CCCCCCC, Tĩnh DDDDDD', name: 'Category 7', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 8, address: 'Số 213012 ,Ấp AAAAA, Xã BBBBBBBBBB, Huyện CCCCCCC, Tĩnh DDDDDD', name: 'Category 8', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 9, address: 'Số 213012 ,Ấp AAAAA, Xã BBBBBBBBBB, Huyện CCCCCCC, Tĩnh DDDDDD', name: 'Category 9', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 10, address: 'Số 213012 ,Ấp AAAAA, Xã BBBBBBBBBB, Huyện CCCCCCC, Tĩnh DDDDDD', name: 'Category 10', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 11, address: 'Số 213012 ,Ấp AAAAA, Xã BBBBBBBBBB, Huyện CCCCCCC, Tĩnh DDDDDD', name: 'Category 11', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 12, address: 'Số 213012 ,Ấp AAAAA, Xã BBBBBBBBBB, Huyện CCCCCCC, Tĩnh DDDDDD', name: 'Category 12', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 13, address: 'Số 213012 ,Ấp AAAAA, Xã BBBBBBBBBB, Huyện CCCCCCC, Tĩnh DDDDDD', name: 'Category 13', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 14, address: 'Số 213012 ,Ấp AAAAA, Xã BBBBBBBBBB, Huyện CCCCCCC, Tĩnh DDDDDD', name: 'Category 14', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 15, address: 'Số 213012 ,Ấp AAAAA, Xã BBBBBBBBBB, Huyện CCCCCCC, Tĩnh DDDDDD', name: 'Category 15', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 16, address: 'Số 213012 ,Ấp AAAAA, Xã BBBBBBBBBB, Huyện CCCCCCC, Tĩnh DDDDDD', name: 'Category 16', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 17, address: 'Số 213012 ,Ấp AAAAA, Xã BBBBBBBBBB, Huyện CCCCCCC, Tĩnh DDDDDD', name: 'Category 17', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 18, address: 'Số 213012 ,Ấp AAAAA, Xã BBBBBBBBBB, Huyện CCCCCCC, Tĩnh DDDDDD', name: 'Category 18', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 19, address: 'Số 213012 ,Ấp AAAAA, Xã BBBBBBBBBB, Huyện CCCCCCC, Tĩnh DDDDDD', name: 'Category 19', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 20, address: 'Số 213012 ,Ấp AAAAA, Xã BBBBBBBBBB, Huyện CCCCCCC, Tĩnh DDDDDD', name: 'Category 20', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                { id: 20, address: 'Số 213012 ,Ấp AAAAA, Xã BBBBBBBBBB, Huyện CCCCCCC, Tĩnh DDDDDD', name: 'Category 20', image: 'https://th.bing.com/th?q=%e1%ba%a2nh+Shop+Th%e1%bb%9di+Trang+Nh%e1%ba%adt&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247.jpg' },
                // Thêm các danh mục khác
            ],
            displayedCategories: [],
            itemsToShow: 20
        }
    },
    created() {
        this.displayedCategories = this.categories.slice(0, this.itemsToShow);
    },
    methods: {
        loadMore() {
            const nextItems = this.displayedCategories.length + 8;
            if (nextItems <= this.categories.length) {
                this.displayedCategories = this.categories.slice(0, nextItems);
            } else {
                this.displayedCategories = this.categories;
            }
        }
    }
}
</script>