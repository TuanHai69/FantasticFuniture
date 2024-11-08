import createApiClient from "./api.service";

class PriceService {
    constructor(baseURL = "/api/price") {
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

    async findByProduct(productid) {
        return (await this.api.get(`/product/${productid}`)).data;
    }

    async findByProductWithNoEndDate(productid) {
        return (await this.api.get(`/product/${productid}/no-end-date`)).data;
    }

    async findByProductWithinDateRange(productid, date) {
        return (await this.api.get(`/product/${productid}/date-range`, { params: { date } })).data;
    }
}

export default new PriceService();
