const TheoGioiMuonSachService = require("../services/theogioimuonsach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create =  async(req, res, next) =>{
    if(!req.body?.madocgia || !req.body?.masach || !req.body?.ngaymuon){
        return next(new ApiError(400, "Mã độc giả, mã sách và ngày mượn không thể để trống"));
    }

    try{
        const theogioimuonsachService = new TheoGioiMuonSachService(MongoDB.client);
        const document = await theogioimuonsachService.create(req.body);
        return res.send(document);
    }catch(error){
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi tạo thông tin mượn sách")
        );
    }
}

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const theogioimuonsachService = new TheoGioiMuonSachService(MongoDB.client);
        documents = await theogioimuonsachService.find({});
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi lấy thông tin mượn sách")
        );
    }
    return res.send(documents);
};

exports.findmadocgia = async (req, res, next) => {
    let documents = [];

    try {
        const theogioimuonsachService = new TheoGioiMuonSachService(MongoDB.client);
        documents = await theogioimuonsachService.findmadocgia(req.params.madocgia);
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi lấy thông tin mượn sách theo mã độc giả")
        );
    }
    return res.send(documents);
};


exports.findOne = async (req, res, next) => {
    try {
        const theogioimuonsachService = new TheoGioiMuonSachService(MongoDB.client);
        const document = await theogioimuonsachService.findById(req.params.id);
        if (!document) {
            return next (new ApiError(404, "Không tìm thấy thông tin mượn sách"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, `Lỗi khi lấy thông tin mượn sách với id=${req.params.id}`
            )
        );
    }
};

exports.findtrung = async (req, res, next) => {
    let documents = [];

    try {
        const theogioimuonsachService = new TheoGioiMuonSachService(MongoDB.client);
        documents = await theogioimuonsachService.findtrung(req.params.madocgia, req.params.masach, req.params.ngaymuon);
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi tìm kiếm thông tin mượn sách")
        );
    }
    return res.send(documents);
};


exports.update = async (req, res, next) => {
    if (req.body && Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không thể để trống"));
    }
    
    try {
        const theogioimuonsachService = new TheoGioiMuonSachService(MongoDB.client);
        const document = await theogioimuonsachService.update(req.params.id, req.body);
        if(!document) {
            return next(new ApiError(404, "Không tìm thấy thông tin mượn sách"));
        }
        return res.send({message: "Thông tin mượn sách đã được cập nhật thành công"});
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi khi cập nhật thông tin mượn sách với id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const theogioimuonsachService = new TheoGioiMuonSachService(MongoDB.client);
        const document = await theogioimuonsachService.delete(req.params.id);
        if (!document ) {
            return next(new ApiError(404, "Không tìm thấy thông tin mượn sách"));
        }
        return res.send({ message: "Thông tin mượn sách đã được xóa thành công" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Không thể xóa thông tin mượn sách với id=${req.params.id}`
            )
        );
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const theogioimuonsachService = new TheoGioiMuonSachService(MongoDB.client);
        const deleteCount = await theogioimuonsachService.deleteAll();
        return res.send({
            message: `${deleteCount} thông tin mượn sách đã được xóa thành công`, 
        });
    } catch (error) {
        return next(
            new ApiError(
                500,
                "Đã xảy ra lỗi khi xóa tất cả thông tin mượn sách"
            )
        );
    }
};
