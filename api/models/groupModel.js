import { pool } from "./db.js";

const getAllGroupsModel = async (idaccount) => {
    const result = await pool.query(
        `SELECT 
            "group".*,
        (
            SELECT COUNT(*) 
            FROM member_list
            WHERE member_list.id_group = "group".id
            ) AS member_count,

            member_list.id_account AS member_accountid,
            join_request.status AS join_request_status
        FROM "group"

        LEFT JOIN member_list
            ON member_list.id_group = "group".id
            AND member_list.id_account = $1

        LEFT JOIN join_request
            ON join_request.id_group = "group".id
            AND join_request.id_account = $1
        `,
        [idaccount]
    );
    return result.rows;
}

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
    const groupResult = result.rows[0]
    
    await pool.query(
        `INSERT INTO member_list
            (id_account, id_group, join_date)
        VALUES ($1, $2, CURRENT_TIMESTAMP)
        `,
        [id_owner, groupResult.id]
    )
    return groupResult
}

const deleteGroupModel = async (idgroup, idowner) => {
    const result = await pool.query('DELETE FROM "group" WHERE id = $1 AND id_owner = $2', [idgroup, idowner]);
    return result;
};

const createJoinRequestModel = async (idgroup, idaccount) => {
    const result = await pool.query(`INSERT INTO join_request (id_account, id_group, status)
        VALUES ($1, $2, 'PENDING')
        RETURNING *
        `,
        [idaccount, idgroup]
    
    );

    return result.rows[0]
};

const getAllJoinRequestsModel = async (id) => {
    const result = await pool.query('SELECT * FROM join_request');
    return result.rows
};

const getGroupJoinRequestsModel = async (idgroup) => {
    const result = await pool.query(
        `SELECT
            join_request.id_group,
            join_request.id_account,
            join_request.status,
            account.username
        FROM join_request
        JOIN account
            ON account.id = join_request.id_account
        WHERE join_request.id_group = $1
            AND join_request.status = 'PENDING'
        ORDER BY join_request.id_account
        `,
        [idgroup]
    )

    return result.rows
};

const approveJoinRequestModel = async (idaccount, idgroup, idowner) => {
    const result = await pool.query(`
        UPDATE join_request
        SET status = 'APPROVED'
        FROM "group"
        WHERE join_request.id_account = $1
            AND join_request.id_group = $2
            AND join_request.status = 'PENDING'
            AND "group".id = join_request.id_group
            AND "group".id_owner = $3
        RETURNING join_request.*
        `,
        [idaccount, idgroup, idowner]
    )

    if (result.rowCount === 0) {
        throw new Error(
            "Pyyntöä ei löytynt tai käyttäjä ei ole ryhmän omistaja"
        )
    }

    await pool.query(`
        INSERT INTO member_list
            (id_account, id_group, join_date)
        SELECT $1, $2, CURRENT_TIMESTAMP
        WHERE NOT EXISTS (
            SELECT 1
            FROM member_list
            WHERE member_list.id_account = $1
                AND member_list.id_group = $2
        )
        `,
        [idaccount, idgroup]
    )
    return result.rows;
};

const rejectJoinRequestModel = async (idaccount, idgroup, idowner) => {
   
    const result = await pool.query(`
        UPDATE join_request
        SET status = 'REJECTED'
        FROM "group"
        WHERE join_request.id_account = $1
            AND join_request.id_group = $2
            AND join_request.status = 'PENDING'
            AND "group".id = join_request.id_group
            AND "group".id_owner = $3
        RETURNING join_request.*
        `,
        [idaccount, idgroup, idowner]
    )

    if (result.rowCount === 0) {
        throw new Error(
            "Pyyntöä ei löytynyt tai käyttäjä ei ole ryhmän omistaja"
        )
    }

    return result.rows;

};


export {
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

};