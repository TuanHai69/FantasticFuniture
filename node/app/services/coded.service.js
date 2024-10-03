const { ObjectId } = require("mongodb");

class CodedService {
    constructor(client) {
        this.Coded = client.db().collection("codeds");
    }

    extractCodedData(payload) {
        const coded = {
            userid: payload.userid,
            code: payload.code,
            percent: payload.percent,
            start: payload.start,
            end: payload.end,
            state: payload.state,
        };

        Object.keys(coded).forEach(
            (key) => coded[key] === undefined && delete coded[key]
        );
        return coded;
    }

    async create(payload) {
        const coded = this.extractCodedData(payload);
        const result = await this.Coded.findOneAndUpdate(
            coded,
            { $set: coded },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Coded.find(filter);
        return await cursor.toArray();
    }

    async findByCode(keyword) {
        return await this.find({
            code: keyword,
        });
    }

    async findByUser(keyword) {
        return await this.find({
            userid: keyword,
        });
    }

    async findByState(keyword) {
        return await this.find({
            state: { $regex: new RegExp(keyword), $options: "i" },
        });
    }
    async findById(id) {
        return await this.Coded.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractCodedData(payload);
        const result = await this.Coded.findOneAndUpdate(
            filter,
            { $set: update },
            { ReturnDocument: "after" }
        );
        return result;
    }
    async delete(id) {
        const result = await this.Coded.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
}

module.exports = CodedService;
