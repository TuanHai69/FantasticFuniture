import createApiClient from "./api.service";

class CodedService {
    constructor(baseURL = "/api/coded") {
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

    async findByCode(id) {
        return (await this.api.get(`/code/${id}`)).data;
    }
}

export default new CodedService();
