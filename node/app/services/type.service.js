const { ObjectId } = require("mongodb");

class TypeService {
    constructor(client) {
        this.Type = client.db().collection("types");
    }

    extractTypeData(payload) {
        const type = {
            name: payload.name,
            description: payload.description,
            userid: payload.userid,
        };

        Object.keys(type).forEach(
            (key) => type[key] === undefined && delete type[key]
        );
        return type;
    }

    async create(payload) {
        const type = this.extractTypeData(payload);
        const result = await this.Type.findOneAndUpdate(
            type,
            { $set: type },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Type.find(filter);
        return await cursor.toArray();
    }

    async findByName(keyword) {
        return await this.find({
            name: { $regex: new RegExp(keyword), $options: "i" },
        });
    }
    async findByUser(keyword) {
        return await this.find({
            userid: { $regex: new RegExp(keyword), $options: "i" },
        });
    }
    async findById(id) {
        return await this.Type.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractTypeData(payload);
        const result = await this.Type.findOneAndUpdate(
            filter,
            { $set: update },
            { ReturnDocument: "after" }
        );
        return result;
    }
    async delete(id) {
        const result = await this.Type.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
}

module.exports = TypeService;
