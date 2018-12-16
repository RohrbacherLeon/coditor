const Exercise = require('../models/Exercise')
const express    = require('express');
const app        = express();

exports.getExoByLang = (req, res) => {
    Exercise.byLanguage(req.params.lang,function(err, exos){
        res.render('BrowsingView', {datas : exos});
    })
}