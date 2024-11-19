const { ObjectId } = require("mongodb");

class CommentService {
    constructor(client) {
        this.Comment = client.db().collection("comments");
    }

    extractCommentData(payload) {
        const comment = {
            userid: payload.userid,
            productid: payload.productid,
            rate: payload.rate,
            comment: payload.comment,
            state: payload.state,
            like: payload.like,
        };

        Object.keys(comment).forEach(
            (key) => comment[key] === undefined && delete comment[key]
        );
        return comment;
    }

    async create(payload) {
        const comment = this.extractCommentData(payload);
        const result = await this.Comment.findOneAndUpdate(
            comment,
            { $set: comment },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Comment.find(filter);
        return await cursor.toArray();
    }

    async findByProduct(keyword) {
        return await this.find({
            productid: { $regex: new RegExp(keyword), $options: "i" },
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
        return await this.Comment.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractCommentData(payload);
        const result = await this.Comment.findOneAndUpdate(
            filter,
            { $set: update },
            { ReturnDocument: "after" }
        );
        return result;
    }
    async delete(id) {
        const result = await this.Comment.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
    async isLiked(userid, productid) {
        const comment = await this.Comment.findOne({
            userid: userid,
            productid: productid,
            like: true,
        });
        return comment ? [comment] : [];
    }
}

module.exports = CommentService;
