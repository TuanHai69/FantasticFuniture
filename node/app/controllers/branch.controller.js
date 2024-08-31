const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const BranchService = require("../services/branch.service");

exports.create = async (req, res, next) => {
    if (!req.body?.name || !req.body?.address || !req.body?.userid || !req.body?.phonenumber) {
        return next(new ApiError(400, "user or address or name or phonenumber are empty"))
    }

    try {
        const branchService = new BranchService(MongoDB.client);
        const document = await branchService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "error when create branch")
        );
    }
}

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const branchService = new BranchService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await branchService.findByName(name);
        } else {
            documents = await branchService.find({});
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
        const branchService = new BranchService(MongoDB.client);
        const document = await branchService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Can't find this branch"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take branch with id=${req.params.id}`
            )
        );
    }
}

exports.findByuser = async (req, res, next) => {
    let documents = [];

    try {
        const branchService = new BranchService(MongoDB.client);
        documents = await branchService.findByUser(req.params.id);
        if (documents.length === 0) {
            return next(new ApiError(404, "Can't find this branch"));
        }
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take branch with id=${req.params.id}`
            )
        );
    }
    
}

exports.update = async (req, res, next) => {
    if (req.body && Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data update can't be empty"));
    }

    try {
        const branchService = new BranchService(MongoDB.client);
        const document = await branchService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "branch not found"));
        }
        return res.send({ message: "branch update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error happen when update branch has id=${req.params.id}`)
        );
    }
}

exports.delete = async (req, res, next) => {
    try {
        const branchService = new BranchService(MongoDB.client);
        const document = await branchService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Can't find the branch"));
        }
        return res.send({ message: "branch were deleted" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Can't delete branch with id=${req.params.id}`
            )
        )
    }
}