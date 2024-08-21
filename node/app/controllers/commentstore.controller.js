const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const CommentstoreService = require("../services/commentstore.service");

exports.create = async (req, res, next) => {
    if (!req.body?.userid || !req.body?.storeid || !req.body?.state) {
        return next(new ApiError(400, "user or product or state are empty"))
    }

    try {
        const commentstoreService = new CommentstoreService(MongoDB.client);
        const document = await commentstoreService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "error when create commentstore")
        );
    }
}

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const commentstoreService = new CommentstoreService(MongoDB.client);
        const { storeid } = req.query;
        if (storeid) {
            documents = await commentstoreService.findByStore(storeid);
        } else {
            documents = await commentstoreService.find({});
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
        const commentstoreService = new CommentstoreService(MongoDB.client);
        const document = await commentstoreService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Can't find this commentstore"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take commentstore with id=${req.params.id}`
            )
        );
    }
}

exports.findByuser = async (req, res, next) => {
    let documents = [];

    try {
        const commentstoreService = new CommentstoreService(MongoDB.client);
        documents = await commentstoreService.findByUser(req.params.id);
        if (documents.length === 0) {
            return next(new ApiError(404, "Can't find this commentstore"));
        }
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take commentstore with id=${req.params.id}`
            )
        );
    }
    return res.send(documents);
}
exports.findByStore = async (req, res, next) => {
    let documents = [];

    try {
        const commentstoreService = new CommentstoreService(MongoDB.client);
        documents = await commentstoreService.findByStore(req.params.id);
        if (documents.length === 0) {
            return next(new ApiError(404, "Can't find this commentstore"));
        }
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take commentstore with id=${req.params.id}`
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
        const commentstoreService = new CommentstoreService(MongoDB.client);
        const document = await commentstoreService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Commentstore not found"));
        }
        return res.send({ message: "Commentstore update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error happen when update Commentstore has id=${req.params.id}`)
        );
    }
}

exports.delete = async (req, res, next) => {
    try {
        const commentstoreService = new CommentstoreService(MongoDB.client);
        const document = await commentstoreService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Can't find the commentstore"));
        }
        return res.send({ message: "Commentstore were deleted" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Can't delete commentstore with id=${req.params.id}`
            )
        )
    }
}