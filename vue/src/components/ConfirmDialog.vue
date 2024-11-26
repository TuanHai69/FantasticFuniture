<template>
    <div v-if="show" class="modal-overlay">
        <div class="modal-container">
            <h3>{{ title }}</h3>
            <p>{{ message }}</p>
            <div class="modal-buttons">
                <button class="btn btn-secondary" @click="confirm('skip')">Bỏ qua sản phẩm này</button>
                <button class="btn btn-primary" @click="confirm('goto')">Đi đến sản phẩm này</button>
                <button class="btn btn-danger" @click="confirm('skipAll')">Bỏ qua toàn bộ</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            required: true,
        },
        title: {
            type: String,
            default: 'Xác nhận',
        },
        message: {
            type: String,
            default: 'Bạn có muốn tiếp tục?',
        },
        productName: {
            type: String,
            default: '',
        },
    },
    computed: {
        displayMessage() {
            return `${this.message} (${this.productName})`;
        },
    },
    methods: {
        confirm(action) {
            this.$emit('confirm', action);
        },
    },
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    text-align: center;
}

.modal-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.modal-buttons button {
    flex: 1;
    margin: 0 5px;
}
</style>