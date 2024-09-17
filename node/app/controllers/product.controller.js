const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const ProductService = require("../services/product.service");

exports.create = async (req, res, next) => {
    if (!req.body?.name || !req.body?.cost || !req.body?.material || !req.body?.storeid) {
        return next(new ApiError(400, "name or cost or material are empty"))
    }

    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "error when create product")
        );
    }
}

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const productService = new ProductService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await productService.findByName(name);
        } else {
            documents = await productService.find({});
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
        const productService = new ProductService(MongoDB.client);
        const document = await productService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Can't find this product"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take product with id=${req.params.id}`
            )
        );
    }
}

exports.findByStore = async (req, res, next) => {
    let documents = [];

    try {
        const productService = new ProductService(MongoDB.client);
        documents = await productService.findByStore(req.params.id);
        if (documents.length === 0) {
            return next(new ApiError(404, "Can't find this product"));
        }
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take product with id=${req.params.id}`
            )
        );
    }
    return res.send(documents);
}
exports.findByState = async (req, res, next) => {
    let documents = [];

    try {
        const productService = new ProductService(MongoDB.client);
        documents = await productService.findByState(req.params.state);
        if (documents.length === 0) {
            return next(new ApiError(404, "Can't find any product with this state"));
        }
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when retrieving products with state=${req.params.state}`
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
        const productService = new ProductService(MongoDB.client);
        const document = await productService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Product not found"));
        }
        return res.send({ message: "Product update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error happen when update Product has id=${req.params.id}`)
        );
    }
}

exports.delete = async (req, res, next) => {
    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Can't find the product"));
        }
        return res.send({ message: "Product were deleted" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Can't delete product with id=${req.params.id}`
            )
        )
    }
}