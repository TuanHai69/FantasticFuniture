const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const CodeuseService = require("../services/codeuse.service");

exports.create = async (req, res, next) => {
    if (!req.body?.userid || !req.body?.codeid) {
        return next(new ApiError(400, "user or product or state are empty"))
    }

    try {
        const codeuseService = new CodeuseService(MongoDB.client);
        const document = await codeuseService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "error when create codeuse")
        );
    }
}

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const codeuseService = new CodeuseService(MongoDB.client);
        const { day } = req.query;
        if (day) {
            documents = await codeuseService.findByDay(day);
        } else {
            documents = await codeuseService.find({});
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
        const codeuseService = new CodeuseService(MongoDB.client);
        const document = await codeuseService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Can't find this codeuse"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take codeuse with id=${req.params.id}`
            )
        );
    }
}

exports.findByuser = async (req, res, next) => {
    let documents = [];

    try {
        const codeuseService = new CodeuseService(MongoDB.client);
        documents = await codeuseService.findByUser(req.params.id);
        if (documents.length === 0) {
            return next(new ApiError(404, "Can't find this codeuse"));
        }
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take codeuse with id=${req.params.id}`
            )
        );
    }
    return res.send(documents);
}
exports.findByCode = async (req, res, next) => {
    let documents = [];

    try {
        const codeuseService = new CodeuseService(MongoDB.client);
        documents = await codeuseService.findByCode(req.params.id);
        if (documents.length === 0) {
            return next(new ApiError(404, "Can't find this codeuse"));
        }
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take codeuse with id=${req.params.id}`
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
        const codeuseService = new CodeuseService(MongoDB.client);
        const document = await codeuseService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Codeuse not found"));
        }
        return res.send({ message: "Codeuse update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error happen when update Codeuse has id=${req.params.id}`)
        );
    }
}

exports.delete = async (req, res, next) => {
    try {
        const codeuseService = new CodeuseService(MongoDB.client);
        const document = await codeuseService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Can't find the codeuse"));
        }
        return res.send({ message: "Codeuse were deleted" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Can't delete codeuse with id=${req.params.id}`
            )
        )
    }
}