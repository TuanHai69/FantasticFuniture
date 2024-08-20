const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const OrderService = require("../services/order.service");

exports.create = async (req, res, next) => {
    if (!req.body?.userid || !req.body?.storeid || !req.body?.state) {
        return next(new ApiError(400, "user or store or state are empty"))
    }

    try {
        const orderService = new OrderService(MongoDB.client);
        const document = await orderService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "error when create order")
        );
    }
}

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const orderService = new OrderService(MongoDB.client);
        const { userid } = req.query;
        if (userid) {
            documents = await orderService.findByUser(userid);
        } else {
            documents = await orderService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "error when take the data")
        );
    }
    return res.send(documents);
}

exports.findOne = async (req, res, next) => {
    try {
        const orderService = new OrderService(MongoDB.client);
        const document = await orderService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Can't find this order"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take order with id=${req.params.id}`
            )
        );
    }
}

exports.findByuser = async (req, res, next) => {
    let documents = [];

    try {
        const orderService = new OrderService(MongoDB.client);
        documents = await orderService.findByUser(req.params.id);
        if (documents.length === 0) {
            return next(new ApiError(404, "Can't find this order"));
        }
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take order with id=${req.params.id}`
            )
        );
    }
    return res.send(documents);
}
exports.findByStore = async (req, res, next) => {
    let documents = [];

    try {
        const orderService = new OrderService(MongoDB.client);
        documents = await orderService.findByStore(req.params.id);
        if (documents.length === 0) {
            return next(new ApiError(404, "Can't find this order"));
        }
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take order with id=${req.params.id}`
            )
        );
    }
    return res.send(documents);
}
exports.findByUserIdAndStoreId = async (req, res, next) => {
    let documents = [];

    try {
        const orderService = new OrderService(MongoDB.client);
        documents = await orderService.findByUserIdAndStoreId(req.params.userid, req.params.storeid);
        if (documents.length === 0) {
            return next(new ApiError(404, "Can't find any orders for this user and store"));
        }
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when retrieving orders for user id=${req.params.userid} and store id=${req.params.storeid}`
            )
        );
    }
    return res.send(documents);
}


exports.update = async (req, res, next) => {
    if (req.body && Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data update can't be empty"));
    }

    try {
        const orderService = new OrderService(MongoDB.client);
        const document = await orderService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Order not found"));
        }
        return res.send({ message: "Order update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error happen when update Order has id=${req.params.id}`)
        );
    }
}

exports.delete = async (req, res, next) => {
    try {
        const orderService = new OrderService(MongoDB.client);
        const document = await orderService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Can't find the order"));
        }
        return res.send({ message: "Order were deleted" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Can't delete order with id=${req.params.id}`
            )
        )
    }
}