const NhanVienService = require("../services/nhanvien.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create =  async(req, res, next) =>{
    if(!req.body?.hotennv){
        return next(new ApiError(400, "Họ tên nhân viên không thể để trống"));
    }

    try{
        const nhanvienService = new NhanVienService(MongoDB.client);
        const document = await nhanvienService.create(req.body);
        return res.send(document);
    }catch(error){
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi tạo nhân viên")
        );
    }
}

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const nhanvienService = new NhanVienService(MongoDB.client);
        const { hotennv } = req.query;
        if (hotennv) {
            documents = await nhanvienService.findByName(hotennv);
        } else {
            documents = await nhanvienService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi lấy thông tin nhân viên")
        );
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const nhanvienService = new NhanVienService(MongoDB.client);
        const document = await nhanvienService.findById(req.params.id);
        if (!document) {
            return next (new ApiError(404, "Không tìm thấy nhân viên"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, `Lỗi khi lấy thông tin nhân viên với id=${req.params.id}`
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
        const nhanvienService = new NhanVienService(MongoDB.client);
        const document = await nhanvienService.findByEmailAndPassword(email, matkhau);
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
        const nhanvienService = new NhanVienService(MongoDB.client);
        const document = await nhanvienService.update(req.params.id, req.body);
        if(!document) {
            return next(new ApiError(404, "Không tìm thấy nhân viên"));
        }
        return res.send({message: "Nhân viên đã được cập nhật thành công"});
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi khi cập nhật nhân viên với id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const nhanvienService = new NhanVienService(MongoDB.client);
        const document = await nhanvienService.delete(req.params.id);
        if (!document ) {
            return next(new ApiError(404, "Không tìm thấy nhân viên"));
        }
        return res.send({ message: "Nhân viên đã được xóa thành công" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Không thể xóa nhân viên với id=${req.params.id}`
            )
        );
    }
};
