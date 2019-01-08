const express  = require('express');
const app      = express();
const router   = express.Router();
const Exercise = require('../models/Exercise')

router.get('/tags', (req, res) => {
    Exercise.getAllValuesOf('tags', (err, tags) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(tags));
    })
});

router.get('/exercises', (req, res) => {
    Exercise.find({}, (err, exercises) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(exercises));
    })
});

router.get('/exercises/:lang', (req, res) => {
    let lang = req.params.lang;
    
    Exercise.byLanguage(lang, (err, exercices) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(exercices));
    })
    
});


router.get('/tags/filter', (req, res) => {
    let lang = req.query.lang;
    
    if(req.query.tags){
        let tagsArray = req.query.tags;
        Exercise.byTags(tagsArray, lang, (err, tags) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(tags));
        })
    }else{
        Exercise.byLanguage(lang, (err, tags) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(tags));
        })
    }
});

module.exports = router;