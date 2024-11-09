const { ObjectId } = require("mongodb");

class CartService {
    constructor(client) {
        this.Cart = client.db().collection("carts");
    }

    extractCartData(payload) {
        const cart = {
            userid: payload.userid,
            productid: payload.productid,
            count: payload.count,
            note: payload.note,
            discount: payload.discount,
            day: payload.day,
            storeid: payload.storeid,
            state: payload.state,
        };

        Object.keys(cart).forEach(
            (key) => cart[key] === undefined && delete cart[key]
        );
        return cart;
    }

    async create(payload) {
        const cart = this.extractCartData(payload);
        const result = await this.Cart.findOneAndUpdate(
            cart,
            { $set: cart },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Cart.find(filter);
        return await cursor.toArray();
    }
    async findByUserIdAndStoreId(userid, storeid) {
        const filter = {
            userid: userid,
            storeid: storeid
        };
    
        const documents = await this.Cart.find(filter);
        return await documents.toArray();
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
        return await this.Cart.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractCartData(payload);
        const result = await this.Cart.findOneAndUpdate(
            filter,
            { $set: update },
            { ReturnDocument: "after" }
        );
        return result;
    }
    async delete(id) {
        const result = await this.Cart.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
}

module.exports = CartService;
