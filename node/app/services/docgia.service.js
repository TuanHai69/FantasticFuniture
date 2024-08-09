const { ObjectId } = require("mongodb");

class DocGiaService {
    constructor(client) {
        this.DocGia = client.db().collection("docgia");
    }

    extractDocGiaData(payload) {
        const docgia = {
            holot: payload.holot,
            ten: payload.ten,
            ngaysinh: payload.ngaysinh,
            gioitinh: payload.gioitinh,
            diachi: payload.diachi,
            sodienthoai: payload.sodienthoai,
            email: payload.email,
            matkhau: payload.matkhau,
        };

        Object.keys(docgia).forEach(
            (key) => docgia[key] === undefined && delete docgia[key]
        );
        return docgia;
    }

    async create(payload) {
        const docgia = this.extractDocGiaData(payload);
        const result = await this.DocGia.findOneAndUpdate(
            docgia,
            { $set: docgia },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.DocGia.find(filter);
        return await cursor.toArray();
    }

    async findByName(keyword) {
        return await this.find({
            $or: [
                { holot: { $regex: new RegExp(keyword), $options: "i" } },
                { ten: { $regex: new RegExp(keyword), $options: "i" } },
                { $expr: { $regexMatch: { input: { $concat: ["$holot", " ", "$ten"] }, regex: new RegExp(keyword), options: "i" } } }
            ],
        });
    }


    async findById(id) {
        return await this.DocGia.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async findByEmailAndPassword(email, matkhau) {
        return await this.DocGia.findOne({ email, matkhau });
    }


    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractDocGiaData(payload);
        const result = await this.DocGia.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.DocGia.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

}

module.exports = DocGiaService;
