import { 
    getAllGroupsModel,
    getGroupFromIdModel,
    getMembersFromGroupIdModel,
    getCountofmembersModel,
    getAllJoinRequestsModel,
    getGroupJoinRequestsModel,
    createGroupModel,
    createJoinRequestModel,
    deleteGroupModel,
    approveJoinRequestModel,
    rejectJoinRequestModel,

} from "../models/groupModel.js";

const getAllGroupsController = async (req, res, next ) => {
    console.log("Searching all Groups..")
    try {
        const idaccount = req.user.userId
        const result = await getAllGroupsModel(idaccount);
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

const deleteGroupController = async (req, res, next) => {
    try {
        const idgroup = req.params.id
        const idowner = req.user.userId

        const resultRows = await deleteGroupModel(idgroup, idowner)

        if (resultRows === 0) {
            const error = new Error("No group found or account is not the owner");
            error.status = 404;
            return next(error);
        }

        console.log(`Deleting group with id: ${idgroup}`)

        return res.status(200).json({ id: Number(id) });
    } catch (err) {
        next(err)
    }
}

const createJoinRequestController = async (req, res, next) => {
     console.log("Sending a request...")
    try {
        const idgroup = req.params.id
        const idaccount = req.user.userId;

        const createdJoinRequest = await createJoinRequestModel(
            idgroup,
            idaccount,
        );
        res.status(201).json(createdJoinRequest)
    } catch (err) {
        next(err)
    }
}

const getAllJoinRequestsController = async (req, res, next) => {
    try {
        const result = await getAllJoinRequestsModel();
        res.status(200).json(result || []);
    } catch (err) {
        next(err);
    }
};

const getGroupJoinRequestsController = async (req, res, next) => {
    try {
        const idgroup = req.params.id

        const result = await getGroupJoinRequestsModel();
        res.status(200).json(result || [])
    } catch (err) {
        next(err)
    }

}

const approveJoinRequestController = async (req, res, next) => {
    try {
        const idaccount = req.params.idaccount
        const idgroup = req.params.idgroup
        const idowner = req.user.userId

        const result = await approveJoinRequestModel(idaccount, idgroup, idowner);
        res.status(200).json(result)
    } catch (err) {
        next(err)
    }
}

const rejectJoinRequestController = async (req, res, next) => {
    try {
        const idaccount = req.params.idaccount
        const idgroup = req.params.idgroup
        const idowner = req.user.userId

        const result = await rejectJoinRequestModel(idaccount, idgroup, idowner);
        res.status(200).json(result)
    } catch (err) {
        next(err)
    }
}

export {
    getAllGroupsController,
    getGroupFromIdController,
    getMembersFromGroupIdController,
    getCountofmembersController,
    getAllJoinRequestsController,
    getGroupJoinRequestsController,
    createGroupController,
    createJoinRequestController,
    deleteGroupController,
    approveJoinRequestController,
    rejectJoinRequestController,
}