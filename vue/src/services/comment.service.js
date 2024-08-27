import createApiClient from "./api.service";

class CommentService {
    constructor(baseURL = "/api/comment") {
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

    async findByProduct(id) {
        return (await this.api.get(`/product/${id}`)).data;
    }
}

export default new CommentService();
