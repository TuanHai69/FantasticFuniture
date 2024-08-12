<template>
    <AppHeader />
    <div class="homebg">
        <div class="container-fluid">
            <div class="page row">
                <div class="offset-1 col-md-10">
                    <div class="d-flex justify-content-center mt-3">
                        <Register />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import Register from "@/components/Register.vue";

export default {
    components: {
        AppHeader,
        Register
    }
};
</script>
