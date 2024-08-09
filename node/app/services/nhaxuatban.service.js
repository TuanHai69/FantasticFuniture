const { ObjectId } = require("mongodb");

class NhaXuatBanService {
    constructor(client) {
        this.NhaXuatBan = client.db().collection("nhaxuatban");    
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractNhaXuatBanData(payload){
        const nhaxuatban = {
            tennxb: payload.tennxb,
            diachi: payload.diachi,
            sdt: payload.sdt,
            email: payload.email,
        };

        // Remove underfined fields loại bỏ trường không xác định
        Object.keys(nhaxuatban).forEach(
            (key) => nhaxuatban[key] === undefined && delete nhaxuatban[key]
        );
        return nhaxuatban;
    }

    async create(payload){
        const nhaxuatban = this.extractNhaXuatBanData(payload);
        const result = await this.NhaXuatBan.findOneAndUpdate(
            nhaxuatban,
            { $set: nhaxuatban },
            { returnDocument: "after", upsert: true}
        );
        return result.value;
    }
    

    async find(filter) {
        const cursor = await this.NhaXuatBan.find(filter);
        return await cursor.toArray();
    }

    async findByName(tennxb) {
        return await this.find({
            tennxb: { $regex: new RegExp(tennxb), $options: "i" },
        });
    }
    
    async findById(id) {
        return await this.NhaXuatBan.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractNhaXuatBanData(payload);
        const result = await this.NhaXuatBan.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.NhaXuatBan.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.NhaXuatBan.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = NhaXuatBanService;