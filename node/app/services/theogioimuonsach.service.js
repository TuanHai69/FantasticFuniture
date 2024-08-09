const { ObjectId } = require("mongodb");

class TheoGioiMuonSachService {
    constructor(client) {
        this.TheoGioiMuonSach = client.db().collection("theogioimuonsach");    
    }

    extractTheoGioiMuonSachData(payload){
        const theogioimuonsach = {
            madocgia: payload.madocgia,
            masach: payload.masach,
            ngaymuon: payload.ngaymuon,
            ngaytra: payload.ngaytra,
            trangthai: payload.trangthai,
            dongia: payload.dongia,
        };

        Object.keys(theogioimuonsach).forEach(
            (key) => theogioimuonsach[key] === undefined && delete theogioimuonsach[key]
        );
        return theogioimuonsach;
    }

    async create(payload){
        const theogioimuonsach = this.extractTheoGioiMuonSachData(payload);
        const result = await this.TheoGioiMuonSach.findOneAndUpdate(
            theogioimuonsach,
            { $set: theogioimuonsach },
            { returnDocument: "after", upsert: true}
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.TheoGioiMuonSach.find(filter);
        return await cursor.toArray();
    }
    
    async findById(id) {
        return await this.TheoGioiMuonSach.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
    async findtrung(madocgia, masach, ngaymuon) {
        const cursor = await this.TheoGioiMuonSach.find({ madocgia, masach, ngaymuon });
        return await cursor.toArray();
    }

    async findmadocgia(madocgia) {
        const cursor = await this.TheoGioiMuonSach.find({madocgia: madocgia});
        return await cursor.toArray();
    }
    

    async update(id, payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractTheoGioiMuonSachData(payload);
        const result = await this.TheoGioiMuonSach.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.TheoGioiMuonSach.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.TheoGioiMuonSach.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = TheoGioiMuonSachService;
