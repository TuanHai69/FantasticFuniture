import createApiClient from "./api.service";

class ZaloPayService {
    constructor(baseURL = "http://localhost:3000") {
        this.api = createApiClient(baseURL);
    }

    async createOrder(data) {
        return (await this.api.post("/payment", data)).data;
    }

    async handleCallback(data) {
        return (await this.api.post("/callback", data)).data;
    }

    async getOrderStatus(appTransId) {
        return (await this.api.post(`/order-status/${appTransId}`)).data;
    }
}

export default new ZaloPayService();
