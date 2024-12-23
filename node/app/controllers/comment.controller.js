const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const CommentService = require("../services/comment.service");

exports.create = async (req, res, next) => {
    if (!req.body?.userid || !req.body?.productid) {
        return next(new ApiError(400, "user or product are empty"))
    }

    try {
        const commentService = new CommentService(MongoDB.client);
        const document = await commentService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "error when create comment")
        );
    }
}

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const commentService = new CommentService(MongoDB.client);
        const { productid } = req.query;
        if (productid) {
            documents = await commentService.findByProduct(productid);
        } else {
            documents = await commentService.find({});
        }
    } catch (error) {
        return next(new ApiError(500, "Error when fetching data"));
    }
    return res.send(documents.length ? documents : []);
};

exports.findOne = async (req, res, next) => {
    try {
        const commentService = new CommentService(MongoDB.client);
        const document = await commentService.findById(req.params.id);
        if (!document) {
            return res.send({});
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Error when fetching comment with id=${req.params.id}`));
    }
};

exports.findByUser = async (req, res, next) => {
    let documents = [];
    try {
        const commentService = new CommentService(MongoDB.client);
        documents = await commentService.findByUser(req.params.id);
    } catch (error) {
        return next(new ApiError(500, `Error when fetching comment for user with id=${req.params.id}`));
    }
    return res.send(documents.length ? documents : []);
};

exports.findByProduct = async (req, res, next) => {
    let documents = [];
    try {
        const commentService = new CommentService(MongoDB.client);
        documents = await commentService.findByProduct(req.params.id);
    } catch (error) {
        return next(new ApiError(500, `Error when fetching comment for product with id=${req.params.id}`));
    }
    return res.send(documents.length ? documents : []);
};

exports.update = async (req, res, next) => {
    if (req.body && Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data update can't be empty"));
    }

    try {
        const commentService = new CommentService(MongoDB.client);
        const document = await commentService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Comment not found"));
        }
        return res.send({ message: "Comment update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error happen when update Comment has id=${req.params.id}`)
        );
    }
}

exports.delete = async (req, res, next) => {
    try {
        const commentService = new CommentService(MongoDB.client);
        const document = await commentService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Can't find the comment"));
        }
        return res.send({ message: "Comment were deleted" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Can't delete comment with id=${req.params.id}`
            )
        )
    }
}
exports.isLiked = async (req, res, next) => {
    try {
        const { userid, productid } = req.params;
        const commentService = new CommentService(MongoDB.client);
        const document = await commentService.isLiked(userid, productid);
        return res.send(document.length ? document : []);
    } catch (error) {
        return next(new ApiError(500, `Error when checking if comment is liked by user with id=${req.params.userid} for product with id=${req.params.productid}`));
    }
}