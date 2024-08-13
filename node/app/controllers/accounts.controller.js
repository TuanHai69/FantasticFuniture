const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const AccountsService = require("../services/accounts.service");

exports.create = async (req, res, next) => {
    if (!req.body?.username || !req.body?.password) {
        return next(new ApiError(400, "username and password are empty"))
    }

    try {
        const accountsService = new AccountsService(MongoDB.client);
        const document = await accountsService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "error when create account")
        );
    }
}

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const accountsService = new AccountsService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await accountsService.findByName(name);
        }else {
            documents = await accountsService.find({});
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
        const accountsService = new AccountsService(MongoDB.client);
        const document = await accountsService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Can't find this account"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, `Error when take account with id=${req.params.id}`
            )
        );
    }
}

exports.checkLogin = async (req, res, next) => {
    const {username, password } = req.body;
    if (!username || !password) {
        return next(new ApiError(400, "Username and password cant be empty"));
    }

    try {
        const accountsService = new AccountsService(MongoDB.client);
        const document = await accountsService.loginCheck(username,password);
        if (!document) {
            return next(new ApiError(401, "Username or password aren't correct"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "Error happen when we check the password and username")
        );
    }
}

exports.update = async (req, res, next) => {
    if(req.body && Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data update can't be empty"));
    }

    try {
        const accountsService = new AccountsService(MongoDB.client);
        const document = await accountsService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Account not found"));
        }
        return res.send({ message: "Account update successfully"});
    } catch (error) {
        return next(
            new ApiError(500, `Error happen when update account has id=${req.params.id}`)
        );
    }
}

exports.delete = async (req, res, next) => {
    try {
        const accountsService = new AccountsService(MongoDB.client);
        const document = await accountsService.delete(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Can't find the acccount"));
        }
        return res.send({ message: "Account were deleted"});
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Can't delete account with id=${req.params.id}`
            )
        )
    }
}