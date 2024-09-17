const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const StoreService = require("../services/store.service");

exports.create = async (req, res, next) => {
    if (!req.body?.name || !req.body?.address || !req.body?.userid || !req.body?.phonenumber) {
        return next(new ApiError(400, "user or address or name or phonenumber are empty"))
    }

    try {
        const storeService = new StoreService(MongoDB.client);
        const document = await storeService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "error when create store")
        );
    }
}

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const storeService = new StoreService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await storeService.findByName(name);
        } else {
            documents = await storeService.find({});
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
        const storeService = new StoreService(MongoDB.client);
        const document = await storeService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Can't find this store"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take store with id=${req.params.id}`
            )
        );
    }
}

exports.findByuser = async (req, res, next) => {
    let documents = [];

    try {
        const storeService = new StoreService(MongoDB.client);
        documents = await storeService.findByUser(req.params.id);
        if (documents.length === 0) {
            return next(new ApiError(404, "Can't find this store"));
        }
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take store with id=${req.params.id}`
            )
        );
    }
    return res.send(documents);
}

exports.findByBranch = async (req, res, next) => {
    let documents = [];

    try {
        const storeService = new StoreService(MongoDB.client);
        documents = await storeService.findByBranch(req.params.id);
        if (documents.length === 0) {
            return next(new ApiError(404, "Can't find this store"));
        }
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take store with id=${req.params.id}`
            )
        );
    }
    return res.send(documents);
}
exports.findByState = async (req, res, next) => {
    let documents = [];

    try {
        const storeService = new StoreService(MongoDB.client);
        documents = await storeService.findByState(req.params.state);
        if (documents.length === 0) {
            return next(new ApiError(404, "Can't find any store with this state"));
        }
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when retrieving stores with state=${req.params.state}`
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
        const storeService = new StoreService(MongoDB.client);
        const document = await storeService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Store not found"));
        }
        return res.send({ message: "Store update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error happen when update Store has id=${req.params.id}`)
        );
    }
}

exports.delete = async (req, res, next) => {
    try {
        const storeService = new StoreService(MongoDB.client);
        const document = await storeService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Can't find the store"));
        }
        return res.send({ message: "Store were deleted" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Can't delete store with id=${req.params.id}`
            )
        )
    }
}