const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const TypeService = require("../services/type.service");

exports.create = async (req, res, next) => {
    if (!req.body?.name || !req.body?.userid ) {
        return next(new ApiError(400, "user or name are empty"))
    }

    try {
        const typeService = new TypeService(MongoDB.client);
        const document = await typeService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "error when create type")
        );
    }
}

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const typeService = new TypeService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await typeService.findByName(name);
        } else {
            documents = await typeService.find({});
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
        const typeService = new TypeService(MongoDB.client);
        const document = await typeService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Can't find this type"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take type with id=${req.params.id}`
            )
        );
    }
}

exports.findByuser = async (req, res, next) => {
    let documents = [];

    try {
        const typeService = new TypeService(MongoDB.client);
        documents = await typeService.findByUser(req.params.id);
        if (documents.length === 0) {
            return next(new ApiError(404, "Can't find this type"));
        }
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take type with id=${req.params.id}`
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
        const typeService = new TypeService(MongoDB.client);
        const document = await typeService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "type not found"));
        }
        return res.send({ message: "type update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error happen when update type has id=${req.params.id}`)
        );
    }
}

exports.delete = async (req, res, next) => {
    try {
        const typeService = new TypeService(MongoDB.client);
        const document = await typeService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Can't find the type"));
        }
        return res.send({ message: "type were deleted" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Can't delete type with id=${req.params.id}`
            )
        )
    }
}