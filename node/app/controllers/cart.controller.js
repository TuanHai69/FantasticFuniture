const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const CartService = require("../services/cart.service");

exports.create = async (req, res, next) => {
    if (!req.body?.userid || !req.body?.productid || !req.body?.storeid || !req.body?.state) {
        return next(new ApiError(400, "user or product or store or state are empty"))
    }

    try {
        const cartService = new CartService(MongoDB.client);
        const document = await cartService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "error when create cart")
        );
    }
}

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const cartService = new CartService(MongoDB.client);
        const { productid } = req.query;
        if (productid) {
            documents = await cartService.findByProduct(productid);
        } else {
            documents = await cartService.find({});
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
        const cartService = new CartService(MongoDB.client);
        const document = await cartService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Can't find this cart"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take cart with id=${req.params.id}`
            )
        );
    }
}

exports.findByuser = async (req, res, next) => {
    let documents = [];

    try {
        const cartService = new CartService(MongoDB.client);
        documents = await cartService.findByUser(req.params.id);
        if (documents.length === 0) {
            return next(new ApiError(404, "Can't find this cart"));
        }
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take cart with id=${req.params.id}`
            )
        );
    }
    return res.send(documents);
}
exports.findByStore = async (req, res, next) => {
    let documents = [];

    try {
        const cartService = new CartService(MongoDB.client);
        documents = await cartService.findByStore(req.params.id);
        if (documents.length === 0) {
            return next(new ApiError(404, "Can't find this cart"));
        }
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take cart with id=${req.params.id}`
            )
        );
    }
    return res.send(documents);
}
exports.findByUserIdAndStoreId = async (req, res, next) => {
    let documents = [];

    try {
        const cartService = new CartService(MongoDB.client);
        documents = await cartService.findByUserIdAndStoreId(req.params.userid, req.params.storeid);
        if (documents.length === 0) {
            return next(new ApiError(404, "Can't find any carts for this user and store"));
        }
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when retrieving carts for user id=${req.params.userid} and store id=${req.params.storeid}`
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
        const cartService = new CartService(MongoDB.client);
        const document = await cartService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Cart not found"));
        }
        return res.send({ message: "Cart update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error happen when update Cart has id=${req.params.id}`)
        );
    }
}

exports.delete = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const document = await cartService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Can't find the cart"));
        }
        return res.send({ message: "Cart were deleted" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Can't delete cart with id=${req.params.id}`
            )
        )
    }
}