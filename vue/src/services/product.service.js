import createApiClient from "./api.service";

class ProductService {
    constructor(baseURL = "/api/product") {
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

    async findByStore(id) {
        return (await this.api.get(`/store/${id}`)).data;
    }
    async findByState(state) {
        return (await this.api.get(`/state/${state}`)).data;
    }
}

export default new ProductService();
