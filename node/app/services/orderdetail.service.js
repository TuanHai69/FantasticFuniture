const { ObjectId } = require("mongodb");

class OrderdetailService {
    constructor(client) {
        this.Orderdetail = client.db().collection("orderdetails");
    }

    extractOrderdetailData(payload) {
        const orderdetail = {
            orderid: payload.orderid,
            name: payload.name,
            cost: payload.cost,
            count: payload.count,
            picture: payload.picture,
            material: payload.material,
            size: payload.size,
            warranty: payload.warranty,
            payment: payload.payment,
            address: payload.address,
            description: payload.description,
            state: payload.state,
        };

        Object.keys(orderdetail).forEach(
            (key) => orderdetail[key] === undefined && delete orderdetail[key]
        );
        return orderdetail;
    }

    async create(payload) {
        const orderdetail = this.extractOrderdetailData(payload);
        const result = await this.Orderdetail.findOneAndUpdate(
            orderdetail,
            { $set: orderdetail },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Orderdetail.find(filter);
        return await cursor.toArray();
    }

    async findByName(keyword) {
        return await this.find({
            name: { $regex: new RegExp(keyword), $options: "i" },
        });
    }
    async findByOrder(keyword) {
        return await this.find({
            orderid: { $regex: new RegExp(keyword), $options: "i" },
        });
    }
    async findById(id) {
        return await this.Orderdetail.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractOrderdetailData(payload);
        const result = await this.Orderdetail.findOneAndUpdate(
            filter,
            { $set: update },
            { ReturnDocument: "after" }
        );
        return result;
    }
    async delete(id) {
        const result = await this.Orderdetail.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
}

module.exports = OrderdetailService;
