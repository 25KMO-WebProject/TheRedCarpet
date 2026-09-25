import { pool } from "./db.js";

const getAllGroupsModel = async () => {
    const result = await pool.query('Select * FROM "group"');
    return result;
};

const getGroupFromIdModel = async (id) => {
    const result = await pool.query('Select * FROM "group" WHERE id = $1', [id]);
    return result.rows;
}

export {
    getAllGroupsModel,
    getGroupFromIdModel
};