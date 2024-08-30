const { ObjectId } = require("mongodb");

class AccountsService {
    constructor(client) {
        this.Account = client.db().collection("accounts");
    }

    extractAccountsData(payload) {
        const account = {
            username: payload.username,
            name: payload.name,
            picture: payload.picture,
            birthday: payload.birthday,
            gender: payload.gender,
            password: payload.password,
            address: payload.address,
            phonenumber: payload.phonenumber,
            email: payload.email,
            role: payload.role,
        };

        Object.keys(account).forEach(
            (key) => account[key] === undefined && delete account[key]
        );
        return account;
    }

    async create(payload) {
        const account = this.extractAccountsData(payload);
        const result = await this.Account.findOneAndUpdate(
            account,
            { $set: account },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Account.find(filter);
        return await cursor.toArray();
    }

    async findByName(keyword) {
        return await this.find({
            name: { $regex: new RegExp(keyword), $options: "i" },
        });
    }
    async findById(id) {
        return await this.Account.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
    async loginCheck(keyword) {
        const filter = {
            $or: [
                { email: keyword },
                { username: keyword }
            ],
            // password: password
        };
    
        const account = await this.Account.findOne(filter);
        return account;
    }
    async update(id, payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractAccountsData(payload);
        const result = await this.Account.findOneAndUpdate(
            filter,
            { $set: update },
            { ReturnDocument: "after" }
        );
        return result;
    }
    async delete(id) {
        const result = await this.Account.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
}

module.exports = AccountsService;
