import { 
    getAllGroupsModel,
    getGroupFromIdModel,
    getMembersFromGroupIdModel,
    getCountofmembersModel

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

const getMembersFromGroupIdController = async (req, res, next) => {
    console.log("Searching Group members by group id..");
    try {
        const result = await getMembersFromGroupIdModel(req.params.id)
        res.status(200).json(result || []);
    } catch (err) {
        next(err);
    }
};

const getCountofmembersController = async (req, res, next) => {
     console.log("Counting Group members by group id..");
    try {
        const result = await getCountofmembersModel(req.params.id)
        res.status(200).json({member_count: result || []});
    } catch (err) {
        next(err);
    }
};


export {
    getAllGroupsController,
    getGroupFromIdController,
    getMembersFromGroupIdController,
    getCountofmembersController
}