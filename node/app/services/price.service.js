const { ObjectId } = require("mongodb");

class PriceService {
    constructor(client) {
        this.Price = client.db().collection("prices");
    }

    extractPriceData(payload) {
        const price = {
            daystart: payload.daystart,
            dayend: payload.dayend,
            price: payload.price,
            discount: payload.discount,
            productid: payload.productid,
        };

        Object.keys(price).forEach(
            (key) => price[key] === undefined && delete price[key]
        );
        return price;
    }

    async create(payload) {
        const price = this.extractPriceData(payload);
        const result = await this.Price.findOneAndUpdate(
            price,
            { $set: price },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Price.find(filter);
        return await cursor.toArray();
    }

    async findByProduct(productid) {
        return await this.find({
            productid: { $regex: new RegExp(productid), $options: "i" },
        });
    }

    async findByProductWithNoEndDate(productid) {
        return await this.find({
            productid: { $regex: new RegExp(productid), $options: "i" },
            $or: [{ dayend: null }, { dayend: { $exists: false } }],
        });
    }

    async findById(id) {
        return await this.Price.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractPriceData(payload);
        const result = await this.Price.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.Price.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
}

module.exports = PriceService;
