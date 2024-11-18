const ZaloPayService = require('../services/zalopay.service');
const ApiError = require('../api-error');
const CartService = require('../services/cart.service');
const OrderService = require('../services/order.service');
const CommentService = require('../services/comment.service');
const MongoDB = require('../utils/mongodb.util');

exports.createPayment = async (req, res, next) => {
    try {
        const { zaloPayData, updatedCart, updatedOrder, newComment } = req.body;
        const zaloPayService = new ZaloPayService(MongoDB.client);
        const result = await zaloPayService.createPayment(zaloPayData, updatedCart, updatedOrder, newComment);
        return res.status(200).json(result);
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
};

exports.handleCallback = async (req, res, next) => {
    try {
        const { data, mac } = req.body;
        const zaloPayService = new ZaloPayService(MongoDB.client);
        const result = await zaloPayService.handleCallback(data, mac);

        if (result.return_code === 1) {
            const { app_trans_id } = result.dataJson;
            const tempData = await zaloPayService.getTempData(app_trans_id);

            if (tempData) {
                const { updatedCart, updatedOrder, newComment } = tempData;

                console.log(updatedCart);
                console.log(updatedOrder);
                console.log(newComment);

                if (updatedCart) {
                    const cartService = new CartService(MongoDB.client);
                    const kq1 = await cartService.update(updatedCart._id, updatedCart);
                }
                if (updatedOrder) {
                    const orderService = new OrderService(MongoDB.client);
                    const kq2 = await orderService.update(updatedOrder._id, updatedOrder);
                }
                if (newComment) {
                    const commentService = new CommentService(MongoDB.client);
                    const kq3 = await commentService.create(newComment);
                }

                // Xóa dữ liệu tạm thời sau khi sử dụng
                await zaloPayService.deleteTempData(app_trans_id);
            }
        }

        return res.json(result);
    } catch (error) {
        console.error("Error in handleCallback:", error); // Thêm log lỗi
        return next(new ApiError(500, error.message));
    }
};

exports.getOrderStatus = async (req, res, next) => {
    try {
        const app_trans_id = req.params.app_trans_id;
        const result = await ZaloPayService.getOrderStatus(app_trans_id);
        return res.status(200).json(result);
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
};