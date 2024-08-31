const { ObjectId } = require("mongodb");

class StoreService {
    constructor(client) {
        this.Store = client.db().collection("stores");
    }

    extractStoreData(payload) {
        const store = {
            name: payload.name,
            birthday: payload.birthday,
            pucture: payload.picture,
            address: payload.address,
            phonenumber: payload.phonenumber,
            email: payload.email,
            description: payload.description,
            opentime: payload.opentime,
            userid: payload.userid,
            branchid: payload.branchid,
            state: payload.state,
        };

        Object.keys(store).forEach(
            (key) => store[key] === undefined && delete store[key]
        );
        return store;
    }

    async create(payload) {
        const store = this.extractStoreData(payload);
        const result = await this.Store.findOneAndUpdate(
            store,
            { $set: store },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Store.find(filter);
        return await cursor.toArray();
    }

    async findByName(keyword) {
        return await this.find({
            name: { $regex: new RegExp(keyword), $options: "i" },
        });
    }
    async findByBranch(keyword) {
        return await this.find({
            branchid: { $regex: new RegExp(keyword), $options: "i" },
        });
    }
    async findByUser(keyword) {
        return await this.find({
            userid: { $regex: new RegExp(keyword), $options: "i" },
        });
    }
    async findById(id) {
        return await this.Store.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractStoreData(payload);
        const result = await this.Store.findOneAndUpdate(
            filter,
            { $set: update },
            { ReturnDocument: "after" }
        );
        return result;
    }
    async delete(id) {
        const result = await this.Store.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
}

module.exports = StoreService;
