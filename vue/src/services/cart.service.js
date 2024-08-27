import createApiClient from "./api.service";

class CartService {
    constructor(baseURL = "/api/cart") {
        this.api = createApiClient(baseURL);
    }

    async getAll() {
        return (await this.api.get("/")).data;
    }

    async create(data) {
        return (await this.api.post("/", data)).data;
    }

    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }

    async findByUser(id) {
        return (await this.api.get(`/user/${id}`)).data;
    }

    async findByStore(id) {
        return (await this.api.get(`/store/${id}`)).data;
    }

    async findByUserIdAndStoreId(userid, storeid) {
        return (await this.api.get(`/user/${userid}/store/${storeid}`)).data;
    }
}

export default new CartService();
