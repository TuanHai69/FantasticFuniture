const { ObjectId } = require("mongodb");

class BranchService {
    constructor(client) {
        this.Branch = client.db().collection("branchs");
    }

    extractBranchData(payload) {
        const branch = {
            name: payload.name,
            birthday: payload.birthday,
            address: payload.address,
            phonenumber: payload.phonenumber,
            email: payload.email,
            description: payload.description,
            userid: payload.userid,
            storecount: payload.storecount,
            state: payload.state,
        };

        Object.keys(branch).forEach(
            (key) => branch[key] === undefined && delete branch[key]
        );
        return branch;
    }

    async create(payload) {
        const branch = this.extractBranchData(payload);
        const result = await this.Branch.findOneAndUpdate(
            branch,
            { $set: branch },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Branch.find(filter);
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
        return await this.Branch.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractBranchData(payload);
        const result = await this.Branch.findOneAndUpdate(
            filter,
            { $set: update },
            { ReturnDocument: "after" }
        );
        return result;
    }
    async delete(id) {
        const result = await this.Branch.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
}

module.exports = BranchService;
