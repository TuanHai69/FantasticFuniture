const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const OrderdetailService = require("../services/orderdetail.service");

exports.create = async (req, res, next) => {
    if (!req.body?.name || !req.body?.cost || !req.body?.material || !req.body?.orderid) {
        return next(new ApiError(400, "name or cost or material are empty"))
    }

    try {
        const orderdetailService = new OrderdetailService(MongoDB.client);
        const document = await orderdetailService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "error when create orderdetail")
        );
    }
}

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const orderdetailService = new OrderdetailService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await orderdetailService.findByName(name);
        } else {
            documents = await orderdetailService.find({});
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
        const orderdetailService = new OrderdetailService(MongoDB.client);
        const document = await orderdetailService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Can't find this orderdetail"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take orderdetail with id=${req.params.id}`
            )
        );
    }
}

exports.findByOrder = async (req, res, next) => {
    let documents = [];

    try {
        const orderdetailService = new OrderdetailService(MongoDB.client);
        documents = await orderdetailService.findByOrder(req.params.id);
        if (documents.length === 0) {
            return next(new ApiError(404, "Can't find this orderdetail"));
        }
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take orderdetail with id=${req.params.id}`
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
        const orderdetailService = new OrderdetailService(MongoDB.client);
        const document = await orderdetailService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Orderdetail not found"));
        }
        return res.send({ message: "Orderdetail update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error happen when update Orderdetail has id=${req.params.id}`)
        );
    }
}

exports.delete = async (req, res, next) => {
    try {
        const orderdetailService = new OrderdetailService(MongoDB.client);
        const document = await orderdetailService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Can't find the orderdetail"));
        }
        return res.send({ message: "Orderdetail were deleted" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Can't delete orderdetail with id=${req.params.id}`
            )
        )
    }
}