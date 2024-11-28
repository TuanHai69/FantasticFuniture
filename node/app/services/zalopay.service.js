const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const moment = require('moment');
const qs = require('qs');
const { ObjectId } = require('mongodb');

const config = {
    app_id: "2553",
    key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
    key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

class ZaloPayService {
    constructor(client) {
        this.TempData = client.db().collection("tempData");
    }

    async createPayment(zaloPayData, updatedCart, updatedOrder, newComment) {
        const embed_data = {
            redirecturl: "http://localhost:3001/cart"
        };

        const items = [{}];
        const transID = Math.floor(Math.random() * 1000000);
        const order = {
            app_id: config.app_id,
            app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
            app_user: "user123",
            app_time: Date.now(),
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            amount: zaloPayData.amount,
            description: `thanh toán cho đơn hàng ${zaloPayData.description}`,
            bank_code: "",
            callback_url: "https://de5e-115-76-173-102.ngrok-free.app/callback" // Update this to your correct callback URL
        };

        const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
        order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        try {
            const result = await axios.post(config.endpoint, null, { params: order });
            if (result.data.return_code === 1) {
                // Lưu trữ dữ liệu tạm thời
                await this.TempData.insertOne({
                    app_trans_id: order.app_trans_id,
                    updatedCart,
                    updatedOrder,
                    newComment
                });
            }
            return result.data;
        } catch (error) {
            throw new Error("Payment processing failed.");
        }
    }

    async handleCallback(dataStr, reqMac) {
        let result = {};
        let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

        if (reqMac !== mac) {
            result.return_code = -1;
            result.return_message = "mac not equal";
        } else {
            let dataJson = JSON.parse(dataStr);
            result.return_code = 1;
            result.return_message = "success";
            result.dataJson = dataJson; // Trả về dữ liệu để xử lý ở controller
        }

        return result;
    }

    async getTempData(app_trans_id) {
        return await this.TempData.findOne({ app_trans_id });
    }

    async deleteTempData(app_trans_id) {
        return await this.TempData.deleteOne({ app_trans_id });
    }

    static async getOrderStatus(app_trans_id) {
        let postData = {
            app_id: config.app_id,
            app_trans_id: app_trans_id,
        };

        let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1;
        postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        let postConfig = {
            method: 'post',
            url: 'https://sb-openapi.zalopay.vn/v2/query',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify(postData)
        };

        try {
            const result = await axios(postConfig);
            return result.data;
        } catch (error) {
            throw new Error("Failed to get order status.");
        }
    }
}

module.exports = ZaloPayService;