const pg = require('pg')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')

const client = new pg.Client(process.env.DATABASE_URL || { database: 'acme_talent_agency_db' })

const createTables = () => {
    const SQL = `
        DROP TABLE IF EXISTS user_skill;
        DROP TABLE IF EXISTS skill;
        DROP TABLE IF EXISTS "user";

        CREATE TABLE "user" (
            id UUID PRIMARY KEY,
            username VARCHAR NOT NULL UNIQUE,
            password VARCHAR NOT NULL
        );
        CREATE TABLE skill (
            id UUID PRIMARY KEY,
            name VARCHAR NOT NULL UNIQUE
        );
        CREATE TABLE user_skill (
            id UUID PRIMARY KEY,
            user_id UUID REFERENCES "user"(id) NOT NULL,
            skill_id UUID REFERENCES skill(id) NOT NULL,
            CONSTRAINT unique_user_skill UNIQUE (user_id, skill_id)
        );
    `
    return client.query(SQL);
}

const createUser = async ({ username, password }) => {
    password = await bcrypt.hash(password, 5)
    const SQL = `
        INSERT INTO "user" (id, username, password)
        VALUES ($1, $2, $3)
    `
    return client.query(SQL, [uuidv4(), username, password])
}

const createSkill = (name) => {
    const SQL = `
        INSERT INTO skill (id, name)
        VALUES ($1, $2)
    `
    return client.query(SQL, [uuidv4(), name])
}

const createUserSkill = async ({ userId, skillId }) => {
    const SQL = `
        INSERT INTO user_skill (id, user_id, skill_id)
        VALUES ($1, $2, $3)
        RETURNING *;
    `
    const result = await client.query(SQL, [uuidv4(), userId, skillId])
    return result.rows
}

const fetchUsers = async () => {
    const SQL = `
        SELECT id, username FROM "user"
    `
    const results = await client.query(SQL)
    return results.rows;
}

const fetchSkills = async () => {
    const SQL = `
        SELECT * FROM skill
    `
    const results = await client.query(SQL)
    return results.rows;
}

const fetchUserSkills = async (userId) => {
    const SQL = `
        SELECT user_skill.id, "user".username, skill.name AS skill
        FROM user_skill 
        JOIN "user" ON "user".id = user_skill.user_id
        JOIN skill ON skill.id = user_skill.skill_id
        WHERE user_id = $1;
    `
    const results = await client.query(SQL, [userId])
    return results.rows;
}

const deleteUserSkill = async (userSkillId) => {
    const SQL = `
        DELETE FROM user_skill WHERE id = $1
    `
    const results = await client.query(SQL, [userSkillId])
    return results.rows;
}

module.exports = {
    client,
    createTables,
    createUser,
    createSkill,
    createUserSkill,
    fetchUsers,
    fetchSkills,
    fetchUserSkills,
    deleteUserSkill
}

