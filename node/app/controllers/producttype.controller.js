const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const ProductTypeService = require("../services/producttype.service");

exports.create = async (req, res, next) => {
    if (!req.body?.productid || !req.body?.typeid ) {
        return next(new ApiError(400, "product or type are empty"))
    }

    try {
        const producttypeService = new ProductTypeService(MongoDB.client);
        const document = await producttypeService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "error when create producttype")
        );
    }
}

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const producttypeService = new ProductTypeService(MongoDB.client);
        const { productid } = req.query;
        if (productid) {
            documents = await producttypeService.findByProduct(productid);
        } else {
            documents = await producttypeService.find({});
        }
    } catch (error) {
        return next(new ApiError(500, "Error when fetching data"));
    }
    return res.send(documents.length ? documents : []);
};

exports.findOne = async (req, res, next) => {
    try {
        const producttypeService = new ProductTypeService(MongoDB.client);
        const document = await producttypeService.findById(req.params.id);
        if (!document) {
            return res.send({});
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Error when fetching producttype with id=${req.params.id}`));
    }
};

exports.findByType = async (req, res, next) => {
    let documents = [];
    try {
        const producttypeService = new ProductTypeService(MongoDB.client);
        documents = await producttypeService.findByType(req.params.id);
    } catch (error) {
        return next(new ApiError(500, `Error when fetching producttype with id=${req.params.id}`));
    }
    return res.send(documents.length ? documents : []);
};

exports.findByProduct = async (req, res, next) => {
    let documents = [];
    try {
        const producttypeService = new ProductTypeService(MongoDB.client);
        documents = await producttypeService.findByProduct(req.params.id);
    } catch (error) {
        return next(new ApiError(500, `Error when fetching producttype with id=${req.params.id}`));
    }
    return res.send(documents.length ? documents : []);
};


exports.update = async (req, res, next) => {
    if (req.body && Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data update can't be empty"));
    }

    try {
        const producttypeService = new ProductTypeService(MongoDB.client);
        const document = await producttypeService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "producttype not found"));
        }
        return res.send({ message: "producttype update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error happen when update producttype has id=${req.params.id}`)
        );
    }
}

exports.delete = async (req, res, next) => {
    try {
        const producttypeService = new ProductTypeService(MongoDB.client);
        const document = await producttypeService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Can't find the producttype"));
        }
        return res.send({ message: "producttype were deleted" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Can't delete producttype with id=${req.params.id}`
            )
        )
    }
}