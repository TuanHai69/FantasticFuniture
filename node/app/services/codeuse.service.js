const { ObjectId } = require("mongodb");

class CodeuseService {
    constructor(client) {
        this.Codeuse = client.db().collection("codeuses");
    }

    extractCodeuseData(payload) {
        const codeuse = {
            userid: payload.userid,
            codeid: payload.codeid,
            day: payload.day,
        };

        Object.keys(codeuse).forEach(
            (key) => codeuse[key] === undefined && delete codeuse[key]
        );
        return codeuse;
    }

    async create(payload) {
        const codeuse = this.extractCodeuseData(payload);
        const result = await this.Codeuse.findOneAndUpdate(
            codeuse,
            { $set: codeuse },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Codeuse.find(filter);
        return await cursor.toArray();
    }
    
    async findByCode(keyword) {
        return await this.find({
            codeid: { $regex: new RegExp(keyword), $options: "i" },
        });
    }
    async findByUser(keyword) {
        return await this.find({
            userid: { $regex: new RegExp(keyword), $options: "i" },
        });
    }
    async findByDay(keyword) {
        return await this.find({
            day: { $regex: new RegExp(keyword), $options: "i" },
        });
    }
    async findById(id) {
        return await this.Codeuse.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractCodeuseData(payload);
        const result = await this.Codeuse.findOneAndUpdate(
            filter,
            { $set: update },
            { ReturnDocument: "after" }
        );
        return result;
    }
    async delete(id) {
        const result = await this.Codeuse.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
}

module.exports = CodeuseService;
