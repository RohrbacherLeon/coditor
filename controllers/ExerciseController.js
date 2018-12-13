const Exercise = require('../models/Exercise')

exports.getExoByLang = (req, res) => {
    let data = [];

    Exercise.byLanguage(req.params.lang,function(err, exos){
        data = exos;
        res.render('BrowsingView', {datas : data});
    })
}