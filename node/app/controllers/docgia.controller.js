const DocGiaService = require("../services/docgia.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.holot || !req.body?.ten) {
        return next(new ApiError(400, "Họ lót và tên không thể để trống"));
    }

    try {
        const docgiaService = new DocGiaService(MongoDB.client);
        const document = await docgiaService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi tạo độc giả")
        );
    }
}

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const docgiaService = new DocGiaService(MongoDB.client);
        const { ten } = req.query;
        if (ten) {
            documents = await docgiaService.findByName(ten);
        } else {
            documents = await docgiaService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi lấy thông tin độc giả")
        );
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const docgiaService = new DocGiaService(MongoDB.client);
        const document = await docgiaService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy độc giả"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, `Lỗi khi lấy thông tin độc giả với id=${req.params.id}`
            )
        );
    }
};

exports.findByEmailAndPassword = async (req, res, next) => {
    const { email, matkhau } = req.body;
    if (!email || !matkhau) {
        return next(new ApiError(400, "Email và mật khẩu không thể để trống"));
    }

    try {
        const docgiaService = new DocGiaService(MongoDB.client);
        const document = await docgiaService.findByEmailAndPassword(email, matkhau);
        if (!document) {
            return next(new ApiError(401, "Email hoặc mật khẩu không đúng"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi kiểm tra email và mật khẩu")
        );
    }
};


exports.update = async (req, res, next) => {
    if (req.body && Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không thể để trống"));
    }

    try {
        const docgiaService = new DocGiaService(MongoDB.client);
        const document = await docgiaService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy độc giả"));
        }
        return res.send({ message: "Độc giả đã được cập nhật thành công" });
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi khi cập nhật độc giả với id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const docgiaService = new DocGiaService(MongoDB.client);
        const document = await docgiaService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy độc giả"));
        }
        return res.send({ message: "Độc giả đã được xóa thành công" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Không thể xóa độc giả với id=${req.params.id}`
            )
        );
    }
};

