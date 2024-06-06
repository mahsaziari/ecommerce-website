const express = require('express');
const { fetchSkills } = require('../db');

const router = express.Router();

router.get('/', async function (req, res, next) {
    try {
        const users = await fetchSkills()
        res.send(users)
    } catch (error) {
        next(error)
    }
})

module.exports = router;