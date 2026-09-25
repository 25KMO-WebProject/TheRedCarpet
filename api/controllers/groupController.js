import { 
    getAllGroupsModel,
    getGroupFromIdModel 

} from "../models/groupModel.js";

const getAllGroupsController = async (req, res, next ) => {
    console.log("Searching all Groups..")
    try {
        const result = await getAllGroupsModel();
        res.status(200).json(result.rows || []);
    } catch (err) {
        next(err);
    }
};

const getGroupFromIdController = async (req, res, next) => {
    console.log("Searching Group by id..");
    try {
        const result = await getGroupFromIdModel(req.params.id)
        res.status(200).json(result || []);
    } catch (err) {
        next(err);
    }
};

export {
    getAllGroupsController,
    getGroupFromIdController
}