import createApiClient from "./api.service";

class VNPayService {
    constructor(baseURL = "/api/vnpay") {
        this.api = createApiClient(baseURL);
    }

    async createPayment(data) {
        return (await this.api.post("/create-payment", data)).data;
    }

    async verifyPayment(params) {
        return (await this.api.get("/callback", { params })).data; 
    }
}

export default new VNPayService();
