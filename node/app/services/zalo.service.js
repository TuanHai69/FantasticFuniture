const axios = require('axios');
const crypto = require('crypto');

class ZaloPayService {
    constructor() {
        this.appId = 'AppID';
        this.key1 = 'key1';
        this.endpoint = 'https://sandbox.zalopay.vn/v001/tpe/createorder';
    }

    generateMac(data) {
        return crypto.createHmac('sha256', this.key1).update(data).digest('hex');
    }

    async createOrder(orderInfo) {
        const dataString = `${orderInfo.app_id}|${orderInfo.app_trans_id}|${orderInfo.app_user}|${orderInfo.amount}|${orderInfo.app_time}|${orderInfo.embed_data}|${orderInfo.item}`;
        orderInfo.mac = this.generateMac(dataString);

        try {
            const response = await axios.post(this.endpoint, orderInfo);
            return response.data;
        } catch (e) {
            console.error(e);
            throw new Error('Error creating ZaloPay order');
        }
    }
}

module.exports = ZaloPayService;