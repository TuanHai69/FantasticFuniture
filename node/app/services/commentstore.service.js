const { ObjectId } = require("mongodb");

class CommentstoreService {
    constructor(client) {
        this.Commentstore = client.db().collection("commentstores");
    }

    extractCommentstoreData(payload) {
        const commentstore = {
            userid: payload.userid,
            storeid: payload.storeid,
            rate: payload.rate,
            commentstore: payload.commentstore,
            state: payload.state,
            like: payload.like,
        };

        Object.keys(commentstore).forEach(
            (key) => commentstore[key] === undefined && delete commentstore[key]
        );
        return commentstore;
    }

    async create(payload) {
        const commentstore = this.extractCommentstoreData(payload);
        const result = await this.Commentstore.findOneAndUpdate(
            commentstore,
            { $set: commentstore },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Commentstore.find(filter);
        return await cursor.toArray();
    }

    async findByStore(keyword) {
        return await this.find({
            storeid: { $regex: new RegExp(keyword), $options: "i" },
        });
    }
    async findByUser(keyword) {
        return await this.find({
            userid: { $regex: new RegExp(keyword), $options: "i" },
        });
    }
    async findByState(keyword) {
        return await this.find({
            state: { $regex: new RegExp(keyword), $options: "i" },
        });
    }
    async findById(id) {
        return await this.Commentstore.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractCommentstoreData(payload);
        const result = await this.Commentstore.findOneAndUpdate(
            filter,
            { $set: update },
            { ReturnDocument: "after" }
        );
        return result;
    }
    async delete(id) {
        const result = await this.Commentstore.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
    async isLiked(userid, storeid) {
        const commentstore = await this.Commentstore.findOne({
            userid: userid,
            storeid: storeid,
            like: true,
        });
        return commentstore ? [commentstore] : [];
    }
}

module.exports = CommentstoreService;
