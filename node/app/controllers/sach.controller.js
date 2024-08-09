const SachService = require("../services/sach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create =  async(req, res, next) =>{
    if(!req.body?.tensach){
        return next(new ApiError(400, "Tên sách không thể để trống"));
    }

    try{
        const sachService = new SachService(MongoDB.client);
        const document = await sachService.create(req.body);
        return res.send(document);
    }catch(error){
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi tạo sách")
        );
    }
}

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const sachService = new SachService(MongoDB.client);
        const { tensach } = req.query;
        if (tensach) {
            documents = await sachService.findByName(tensach);
        } else {
            documents = await sachService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi lấy thông tin sách")
        );
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const sachService = new SachService(MongoDB.client);
        const document = await sachService.findById(req.params.id);
        if (!document) {
            return next (new ApiError(404, "Không tìm thấy sách"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, `Lỗi khi lấy thông tin sách với id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (req.body && Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không thể để trống"));
    }
    
    try {
        const sachService = new SachService(MongoDB.client);
        const document = await sachService.update(req.params.id, req.body);
        if(!document) {
            return next(new ApiError(404, "Không tìm thấy sách"));
        }
        return res.send({message: "Sách đã được cập nhật thành công"});
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi khi cập nhật sách với id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const sachService = new SachService(MongoDB.client);
        const document = await sachService.delete(req.params.id);
        if (!document ) {
            return next(new ApiError(404, "Không tìm thấy sách"));
        }
        return res.send({ message: "Sách đã được xóa thành công" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Không thể xóa sách với id=${req.params.id}`
            )
        );
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const sachService = new SachService(MongoDB.client);
        const deleteCount = await sachService.deleteAll();
        return res.send({
            message: `${deleteCount} sách đã được xóa thành công`, 
        });
    } catch (error) {
        return next(
            new ApiError(
                500,
                "Đã xảy ra lỗi khi xóa tất cả sách"
            )
        );
    }
};
