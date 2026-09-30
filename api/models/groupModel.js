import { pool } from "./db.js";

const getAllGroupsModel = async () => {
    const result = await pool.query(
        `SELECT "group".*,
        (
            SELECT COUNT(*) 
            FROM member_list
            WHERE member_list.id_group = "group".id
            ) AS member_count
        FROM "group"
        `,
    );
    return result.rows;
};

const getGroupFromIdModel = async (id) => {
    const result = await pool.query('SELECT * FROM "group" WHERE id = $1', [id]);
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

const createGroupModel = async(group_name, group_descr, id_owner, creation_date) => {
    const result = await pool.query(
        `INSERT INTO "group" (group_name, group_descr, id_owner, creation_date)
         VALUES ($1, $2, $3, NOW())
         RETURNING *;
        `,
        [ group_name, group_descr, id_owner]
    );
    return result.rows[0]
}

export {
    getAllGroupsModel,
    getGroupFromIdModel,
    getMembersFromGroupIdModel,
    getCountofmembersModel,
    createGroupModel
};