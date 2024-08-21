const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const CodedService = require("../services/coded.service");

exports.create = async (req, res, next) => {
    if (!req.body?.userid || !req.body?.code || !req.body?.start || !req.body?.end) {
        return next(new ApiError(400, "content are empty"))
    }

    try {
        const codedService = new CodedService(MongoDB.client);
        const document = await codedService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "error when create coded")
        );
    }
}

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const codedService = new CodedService(MongoDB.client);
        const { code } = req.query;
        if (code) {
            documents = await codedService.findByCode(code);
        } else {
            documents = await codedService.find({});
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
        const codedService = new CodedService(MongoDB.client);
        const document = await codedService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Can't find this coded"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take coded with id=${req.params.id}`
            )
        );
    }
}

exports.findByuser = async (req, res, next) => {
    let documents = [];

    try {
        const codedService = new CodedService(MongoDB.client);
        documents = await codedService.findByUser(req.params.id);
        if (documents.length === 0) {
            return next(new ApiError(404, "Can't find this coded"));
        }
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take coded with id=${req.params.id}`
            )
        );
    }
    return res.send(documents);
}
exports.findByCode = async (req, res, next) => {
    let documents = [];

    try {
        const codedService = new CodedService(MongoDB.client);
        documents = await codedService.findByCode(req.params.id);
        if (documents.length === 0) {
            return next(new ApiError(404, "Can't find this coded"));
        }
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take coded with id=${req.params.id}`
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
        const codedService = new CodedService(MongoDB.client);
        const document = await codedService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Coded not found"));
        }
        return res.send({ message: "Coded update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error happen when update Coded has id=${req.params.id}`)
        );
    }
}

exports.delete = async (req, res, next) => {
    try {
        const codedService = new CodedService(MongoDB.client);
        const document = await codedService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Can't find the coded"));
        }
        return res.send({ message: "Coded were deleted" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Can't delete coded with id=${req.params.id}`
            )
        )
    }
}