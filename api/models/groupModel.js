import { pool } from "./db.js";

const getAllGroupsModel = async () => {
    const result = await pool.query('Select * FROM "group"');
    return result;
};

const getGroupFromIdModel = async (id) => {
    const result = await pool.query('Select * FROM "group" WHERE id = $1', [id]);
    return result.rows;
}

const getMembersFromGroupIdModel = async(id) => {
    const result = await pool.query(
        `SELECT "account".*
        FROM member_list
        JOIN "account"
            ON member_list.id_account = "account".id
        WHERE member_list.id_group = $1`, [id]
    );
    return result.rows;
}

const getCountofmembersModel = async(id) => {
    const result = await pool.query('SELECT COUNT(*) AS member_count FROM member_list WHERE id_group = $1', [id]);
    return Number(result.rows[0].member_count);
}

export {
    getAllGroupsModel,
    getGroupFromIdModel,
    getMembersFromGroupIdModel,
    getCountofmembersModel
};