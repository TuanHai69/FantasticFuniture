const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const PriceService = require("../services/price.service");

exports.create = async (req, res, next) => {
    if (!req.body?.price || !req.body?.productid || !req.body?.daystart) {
        return next(new ApiError(400, "price, productid, or daystart are empty"));
    }

    try {
        const priceService = new PriceService(MongoDB.client);
        const document = await priceService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "Error when creating price")
        );
    }
}

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const priceService = new PriceService(MongoDB.client);
        const { productid } = req.query;
        if (productid) {
            documents = await priceService.findByProduct(productid);
        } else {
            documents = await priceService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "Error when retrieving prices")
        );
    }
    return res.send(documents);
}

exports.findOne = async (req, res, next) => {
    try {
        const priceService = new PriceService(MongoDB.client);
        const document = await priceService.findById(req.params.id);
        return res.send(document || {});
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when retrieving price with id=${req.params.id}`
            )
        );
    }
}

exports.findByProductWithNoEndDate = async (req, res, next) => {
    let documents = [];

    try {
        const priceService = new PriceService(MongoDB.client);
        documents = await priceService.findByProductWithNoEndDate(req.params.productid);
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when retrieving prices for product with id=${req.params.productid}`
            )
        );
    }
    return res.send(documents);
}

exports.findByProductWithinDateRange = async (req, res, next) => {
    let documents = [];

    try {
        const priceService = new PriceService(MongoDB.client);
        const { productid, date } = req.query;
        documents = await priceService.findByProductWithinDateRange(productid, date);
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when retrieving prices for product with id=${productid} within date range`
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
        const priceService = new PriceService(MongoDB.client);
        const document = await priceService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Price not found"));
        }
        return res.send({ message: "Price updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error when updating price with id=${req.params.id}`)
        );
    }
}

exports.delete = async (req, res, next) => {
    try {
        const priceService = new PriceService(MongoDB.client);
        const document = await priceService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Can't find the price"));
        }
        return res.send({ message: "Price was deleted" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Can't delete price with id=${req.params.id}`
            )
        );
    }
}
