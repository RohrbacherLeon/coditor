const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise')

router.get('/tags', (req, res) => {
    Exercise.getAllValuesOf('tags', (err, tags) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(tags));
    })
});

module.exports = router;