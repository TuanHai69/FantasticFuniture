<template>
    <!-- console.log(LocalStorageHelper.getItem('id')); -->
    <!-- <nav class="navbar navbar-expand navbar-dark bg-dark">
        <a href="#" class="navbar-brand" @click="checkLoginStatus">Cửa hàng nội thất B-House</a>
        <div class="mr-auto navbar-nav">
            <li class="nav-item">
                <router-link :to="{ name: 'sachview' }" class="nav-link">
                    Sách
                    
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'nhaxuatbanview' }" class="nav-link">
                    Nhà xuất bản
                    
                </router-link>
            </li>
            <li class="nav-item" v-if="chucvu === 'staff' || chucvu === 'admin' || chucvu === 'client'">
                <router-link :to="{ name: 'theogioimuonsachview' }" class="nav-link">
                    Hàng đợi mượn Sách
                    
                </router-link>
            </li>
            <li class="nav-item" v-if="chucvu === 'staff' || chucvu === 'admin'">
                <router-link :to="{ name: 'nhanvienview' }" class="nav-link">
                    Nhân viên
                    
                </router-link>
            </li>
            <li class="nav-item" v-if="isLoggedIn && chucvu === 'client'">
                <router-link :to="{ name: 'docgia.edit', params: { id: userId } }" class="nav-link">
                    Tài khoản
                    <i class="fas fa-user"></i>
                </router-link>
            </li>

            <li class="nav-item" v-if="isLoggedIn">
                <a href="#" class="nav-link" @click="logout">
                    Logout
                    <i class="fas fa-sign-out-alt"></i>
                </a>
            </li>

            <li class="nav-item" v-if="!isLoggedIn">
                <router-link :to="{ name: 'docgia.signup' }" class="nav-link">
                    Signup
                    <i class="fas fa-sign-in-alt"></i>
                </router-link>
            </li>
            <li class="nav-item" v-if="!isLoggedIn">
                <router-link :to="{ name: 'login' }" class="nav-link">
                    Login
                    <i class="fas fa-sign-in-alt"></i>
                </router-link>
            </li>

        </div>

    </nav> -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <a class="navbar-brand" href="#">Cửa hàng nội thất B-House</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                    <router-link :to="{ name: 'home' }" class="nav-link">
                        Home
                        
                    </router-link>
                    <!-- <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a> -->
                </li>
                <li class="nav-item active">
                    <router-link :to="{ name: 'shop' }" class="nav-link">
                        Cửa hàng
                        
                    </router-link>
                    <!-- <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a> -->
                </li>
                <li class="nav-item active">
                    <router-link :to="{ name: 'product' }" class="nav-link">
                        Sản phẩm
                        
                    </router-link>
                    <!-- <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a> -->
                </li>
                <li class="nav-item active">
                    <router-link :to="{ name: 'shopcard', params: { id: 121113 } }" class="nav-link">
                        Chi tiết
                        
                    </router-link>
                </li>
                <li class="nav-item active">
                    <router-link :to="{ name: 'productitem', params: { id: 1213 } }" class="nav-link">
                        Product
                        
                    </router-link>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Dropdown
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="#">Action</a>
                        <a class="dropdown-item" href="#">Another action</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#">Something else here</a>
                    </div>
                </li>
                <!-- <li class="nav-item">
                    <a class="nav-link disabled" href="#">Disabled</a>
                </li> -->
            </ul>
            <form class="form-inline my-2 my-lg-0 ml-auto ms-auto">
                <div class="input-group search-group">
                    <input class="form-control search-input" type="search" placeholder="Search" aria-label="Search">
                    <button class="btn btn-outline-success search-button" type="submit">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </form>
            <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                    <router-link :to="{ name: 'login' }" class="nav-link">
                        Login
                        
                    </router-link>
                </li>
            </ul>
            <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                    <router-link :to="{ name: 'register' }" class="nav-link">
                        Register
                        
                    </router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>


<script>
import LocalStorageHelper from '@/services/local.service';
export default {
    data() {
        return {
            isLoggedIn: false,
            userId: LocalStorageHelper.getItem('id'),
            chucvu: ''
        };
    },
    created() {
        this.checkLoginStatus();
    },
    methods: {
        checkLoginStatus() {
            if (LocalStorageHelper.getItem('id')) {
                this.isLoggedIn = true;
                this.chucvu = LocalStorageHelper.getItem('chucvu'); // Đọc lại giá trị của chucvu
            } else {
                this.isLoggedIn = false;
                this.chucvu = ''; // Đặt lại giá trị của chucvu
            }
        },
        logout() {
            LocalStorageHelper.clear();
            this.isLoggedIn = false;
            this.$router.push({ name: "sachview" });
        },
    },
};
</script>
