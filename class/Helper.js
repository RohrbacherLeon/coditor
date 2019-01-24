module.exports = {
    formFlash: function (req) {
        let obj = {};

        if (req.body.last_name) {
            obj.last_name = req.body.last_name;
        }

        if (req.body.first_name) {
            obj.first_name = req.body.first_name;
        }

        if (req.body.email) {
            obj.email = req.body.email;
        }

        req.flash("form", obj);
    }
};
