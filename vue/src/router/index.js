import { createWebHistory, createRouter } from "vue-router";
const routes = [
    {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: () => import("@/views/NotFound.vue"),
    },
    {
        path: "/home",
        name: "home",
        component: () => import("@/views/HomeView.vue"),
        props: true // Truyền các biến trong $route.params vào làm props
    },
    {
        path: "/shop",
        name: "shop",
        component: () => import("@/views/ShopView.vue"),
        props: true // Truyền các biến trong $route.params vào làm props
    },
    {
        path: "/product",
        name: "product",
        component: () => import("@/views/ProductView.vue"),
        props: true // Truyền các biến trong $route.params vào làm props
    },
    {
        path: "/shop/:id", // Thêm dynamic segment :id
        name: "shopcard",
        component: () => import("@/views/ShopHeadCardView.vue"),
        props: true // Truyền các biến trong $route.params vào làm props
    },
    {
        path: "/product/:id", // Thêm dynamic segment :id
        name: "productitem",
        component: () => import("@/views/ProductDetailView.vue"),
        props: true // Truyền các biến trong $route.params vào làm props
    },
    {
        path: "/login", // Thêm dynamic segment :id
        name: "login",
        component: () => import("@/views/LoginView.vue"),
        props: true // Truyền các biến trong $route.params vào làm props
    },
    {
        path: "/register", // Thêm dynamic segment :id
        name: "register",
        component: () => import("@/views/RegisterView.vue"),
        props: true // Truyền các biến trong $route.params vào làm props
    },
    {
        path: "/account", // Thêm dynamic segment :id
        name: "account",
        component: () => import("@/views/AccountView.vue"),
        props: true // Truyền các biến trong $route.params vào làm props
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;