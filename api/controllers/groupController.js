import { 
    getAllGroupsModel,
    getGroupFromIdModel,
    getMembersFromGroupIdModel,
    getCountofmembersModel,
    createGroupModel

} from "../models/groupModel.js";

const getAllGroupsController = async (req, res, next ) => {
    console.log("Searching all Groups..")
    try {
        const result = await getAllGroupsModel();
        res.status(200).json(result || []);
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

const createGroupController = async (req, res, next) => {
    console.log("Creating a group...")
    try {
        const {
            group_name,
            group_descr
            }= req.body;

        const id_owner = req.user.userId;

        const createdGroup = await createGroupModel(
            group_name,
            group_descr,
            id_owner
        );
        res.status(201).json(createdGroup)
    } catch (err) {
        next(err)
    }
}


export {
    getAllGroupsController,
    getGroupFromIdController,
    getMembersFromGroupIdController,
    getCountofmembersController,
    createGroupController
}