const express = require('express');
const { fetchUsers, fetchUserSkills, createUserSkill, deleteUserSkill } = require('../db');

const router = express.Router();

router.get('/', async function (req, res, next) {
    try {
        const users = await fetchUsers()
        res.send(users)
    } catch (error) {
        next()
    }
})

router.get('/:id/userSkills', async function (req, res, next) {
    try {
        const userSkills = await fetchUserSkills(req.params.id)
        res.send(userSkills)
    } catch (error) {
        next()
    }
})

router.post('/:id/userSkills', async function (req, res, next) {
    try {
        const userSkill = await createUserSkill({ userId: req.params.id, skillId: req.body.skillId })
        res.status(201).send(userSkill)
    } catch (error) {
        next()
    }
})

router.delete('/:userId/userSkills/:id', async function (req, res, next) {
    try {
        await deleteUserSkill(req.params.id)
        res.status(204).send()
    } catch (error) {
        next()
    }
})

module.exports = router;