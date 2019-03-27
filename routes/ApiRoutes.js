const express = require("express");
const router = express.Router();
const Exercise = require("../models/Exercise");

router.get("/tags", (req, res) => {
    Exercise.getAllValuesOf("tags", (err, tags) => {
        if (err) console.log(err);
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(tags));
    });
});

router.get("/exercises", (req, res) => {
    Exercise.find({}, (err, exercises) => {
        if (err) console.log(err);

        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(exercises));
    });
});

router.get("/exercises/:lang", (req, res) => {
    Exercise.byLanguage(req.params.lang, (err, exercices) => {
        if (err) console.log(err);
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(exercices));
    });
});

router.get("/tags/filter", (req, res) => {
    if (req.query.tags) {
        console.log(req.query.tags);
        Exercise.byTags(req.query.tags, req.query.lang, (err, exercises) => {
            if (err) console.log(err);
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(exercises));
        });
    } else {
        Exercise.byLanguage(req.query.lang, (err, tags) => {
            if (err) console.log(err);
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(tags));
        });
    }
});

module.exports = router;