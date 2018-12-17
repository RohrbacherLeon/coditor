const Exercise = require('../models/Exercise')

exports.getExoByLang = (req, res) => {
    Exercise.getAllValuesOf('language',function(err, languages){
        let locale = req.params.lang;
        res.render('BrowsingView', {languages, locale});
    })
}