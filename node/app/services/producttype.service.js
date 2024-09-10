const { ObjectId } = require("mongodb");

class ProductTypeService {
    constructor(client) {
        this.ProductType = client.db().collection("producttypes");
    }

    extractProductTypeData(payload) {
        const producttype = {
            productid: payload.productid,
            typeid: payload.typeid,
            state: payload.state,
        };

        Object.keys(producttype).forEach(
            (key) => producttype[key] === undefined && delete producttype[key]
        );
        return producttype;
    }

    async create(payload) {
        const producttype = this.extractProductTypeData(payload);
        const result = await this.ProductType.findOneAndUpdate(
            producttype,
            { $set: producttype },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.ProductType.find(filter);
        return await cursor.toArray();
    }

    async findByProduct(keyword) {
        return await this.find({
            productid: { $regex: new RegExp(keyword), $options: "i" },
        });
    }
    async findByType(keyword) {
        return await this.find({
            typeid: { $regex: new RegExp(keyword), $options: "i" },
        });
    }
    async findById(id) {
        return await this.ProductType.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractProductTypeData(payload);
        const result = await this.ProductType.findOneAndUpdate(
            filter,
            { $set: update },
            { ReturnDocument: "after" }
        );
        return result;
    }
    async delete(id) {
        const result = await this.ProductType.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
}

module.exports = ProductTypeService;
