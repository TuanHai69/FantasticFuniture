<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <a class="navbar-brand" href="#">Cửa hàng nội thất F-f</a>
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
                </li>
                <li class="nav-item active">
                    <router-link :to="{ name: 'shop' }" class="nav-link">
                        Cửa hàng

                    </router-link>
                </li>
                <li class="nav-item active">
                    <router-link :to="{ name: 'products' }" class="nav-link">
                        Sản phẩm
                    </router-link>
                </li>
                <li class="nav-item active" v-if="role === 'admin' || role === 'storeowner'">
                    <router-link :to="{ name: 'type' }" class="nav-link">
                        Type
                    </router-link>
                </li>
                <li class="nav-item active" v-if="role === 'admin'">
                    <router-link :to="{ name: 'accounts' }" class="nav-link">
                        <i class="fas fa-user"></i>
                    </router-link>
                </li>
                <li class="nav-item active" v-if="role === 'admin'">
                    <router-link :to="{ name: 'branch' }" class="nav-link">
                        <i class="fas fa-store"></i>
                    </router-link>
                </li>
                <li class="nav-item active">
                    <router-link :to="{ name: 'order' }" class="nav-link">
                        <i class="fas fa-shopping-bag"></i>
                    </router-link>
                </li>
                <li class="nav-item active">
                    <router-link :to="{ name: 'cart' }" class="nav-link">
                        <i class="fas fa-shopping-cart"></i>
                    </router-link>
                </li>
                <li class="nav-item active" v-if="role === 'admin'">
                    <router-link :to="{ name: 'coded' }" class="nav-link">
                        code
                    </router-link>
                </li>
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
                <li class="nav-item" v-if="!isLoggedIn">
                    <router-link :to="{ name: 'login' }" class="nav-link">
                        Login

                    </router-link>
                </li>
                <li class="nav-item" v-if="isLoggedIn">
                    <router-link :to="{ name: 'account' }" class="nav-link">
                        <i class="fas fa-user"></i>
                    </router-link>
                </li>
            </ul>
            <ul class="navbar-nav mr-auto">
                <li class="nav-item" v-if="!isLoggedIn">
                    <router-link :to="{ name: 'register' }" class="nav-link">
                        Register

                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link :to="{ name: 'register' }" class="nav-link" v-if="isLoggedIn" @click="logout">
                        <i class="fas fa-sign-out-alt"></i>
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
            role: ''
        };
    },
    created() {
        this.checkLoginStatus();
    },
    methods: {
        checkLoginStatus() {
            if (LocalStorageHelper.getItem('id')) {
                this.isLoggedIn = true;
                this.role = LocalStorageHelper.getItem('role'); // Đọc lại giá trị của role
            } else {
                this.isLoggedIn = false;
                this.role = ''; // Đặt lại giá trị của role
            }
        },
        logout() {
            LocalStorageHelper.clear();
            this.isLoggedIn = false;
            this.$router.push({ name: "home" });
        },
    },
};
</script>
