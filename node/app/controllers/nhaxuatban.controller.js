const NhaXuatBanService = require("../services/nhaxuatban.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create =  async(req, res, next) =>{
    if(!req.body?.tennxb){
        return next(new ApiError(400, "Name can not be empty"));
    }

    try{
        const nhaxuatbanService = new NhaXuatBanService(MongoDB.client);
        const document = await nhaxuatbanService.create(req.body);
        return res.send(document);
    }catch(error){
        return next(
            new ApiError(500, "An error occurred while creating the publisher")
        );
    }
}
exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const nhaxuatbanService = new NhaXuatBanService(MongoDB.client);
        const { tennxb } = req.query;
        if (tennxb) {
            documents = await nhaxuatbanService.findByName(tennxb);
        } else {
            documents = await nhaxuatbanService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving publishers")
        );
    }
    return res.send(documents);
};
exports.findOne = async (req, res, next) => {
    try {
        const nhaxuatbanService = new NhaXuatBanService(MongoDB.client);
        const document = await nhaxuatbanService.findById(req.params.id);
        if (!document) {
            return next (new ApiError(404, "Publisher not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, `Error retrieving publisher with id=${req.params.id}`
            )
        );
    }
};
exports.update = async (req, res, next) => {
    if (req.body && Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    
    try {
        const nhaxuatbanService = new NhaXuatBanService(MongoDB.client);
        const document = await nhaxuatbanService.update(req.params.id, req.body);
        if(!document) {
            return next(new ApiError(404, "Publisher not found"));
        }
        return res.send({message: "Publisher was updated successfully"});
    } catch (error) {
        return next(
            new ApiError(500, `Error updating publisher with id=${req.params.id}`)
        );
    }
};
exports.delete = async (req, res, next) => {
    try {
        const nhaxuatbanService = new NhaXuatBanService(MongoDB.client);
        const document = await nhaxuatbanService.delete(req.params.id);
        if (!document ) {
            return next(new ApiError(404, "Publisher not found"));
        }
        return res.send({ message: "Publisher was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Could not delete publisher with id=${req.params.id}`
            )
        );
    }
};
exports.deleteAll = async (_req, res, next) => {
    try {
        const nhaxuatbanService = new NhaXuatBanService(MongoDB.client);
        const deleteCount = await nhaxuatbanService.deleteAll();
        return res.send({
            message: `${deleteCount} publishers were deleted successfully`, 
        });
    } catch (error) {
        return next(
            new ApiError(
                500,
                "An error occurred while removing all publishers"
            )
        );
    }
};
