const { ObjectId } = require("mongodb");

class OrderService {
    constructor(client) {
        this.Order = client.db().collection("orders");
    }

    extractOrderData(payload) {
        const order = {
            userid: payload.userid,
            price: payload.price,
            note: payload.note,
            storeid: payload.storeid,
            date: payload.date,
            state: payload.state,
        };

        Object.keys(order).forEach(
            (key) => order[key] === undefined && delete order[key]
        );
        return order;
    }

    async create(payload) {
        const order = this.extractOrderData(payload);
        const result = await this.Order.findOneAndUpdate(
            order,
            { $set: order },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Order.find(filter);
        return await cursor.toArray();
    }
    async findByUserIdAndStoreId(userid, storeid) {
        const filter = {
            userid: userid,
            storeid: storeid
        };
    
        const documents = await this.Order.find(filter);
        return await documents.toArray();
    }
    
    async findByUser(keyword) {
        return await this.find({
            userid: { $regex: new RegExp(keyword), $options: "i" },
        });
    }
    async findByStore(keyword) {
        return await this.find({
            storeid: { $regex: new RegExp(keyword), $options: "i" },
        });
    }
    async findByState(keyword) {
        return await this.find({
            state: { $regex: new RegExp(keyword), $options: "i" },
        });
    }
    async findById(id) {
        return await this.Order.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractOrderData(payload);
        const result = await this.Order.findOneAndUpdate(
            filter,
            { $set: update },
            { ReturnDocument: "after" }
        );
        return result;
    }
    async delete(id) {
        const result = await this.Order.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
}

module.exports = OrderService;
