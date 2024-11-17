const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const CartService = require("../services/cart.service");
const ZaloPayService = require("../services/zalopay.service");

exports.create = async (req, res, next) => {
    if (!req.body?.userid || !req.body?.productid || !req.body?.storeid || !req.body?.state) {
        return next(new ApiError(400, "user or product or store or state are empty"));
    }

    try {
        const cartService = new CartService(MongoDB.client);
        const zalopayService = new ZaloPayService();

        const document = await cartService.create(req.body);

        const orderInfo = {
            app_id: zalopayService.appId,
            app_user: req.body.userid,
            app_time: Date.now(),
            amount: req.body.amount,
            app_trans_id: `${Date.now()}`,
            embed_data: '{}',
            item: '[]',
            description: 'Thanh toán đơn hàng',
        };

        const payment = await zalopayService.createOrder(orderInfo);
        return res.send({ document, payment });
    } catch (error) {
        return next(new ApiError(500, "error when create cart"));
    }
};