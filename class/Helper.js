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
    },

    decamelize: function (str, separator) {
        separator = typeof separator === "undefined" ? " " : separator;

        return str
            .replace(/([a-z\d])([A-Z])/g, "$1" + separator + "$2")
            .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, "$1" + separator + "$2")
            .toLowerCase();
    },
    camelize: function (text) {
        return text.replace(/^([A-Z])|[\s-_]+(\w)/g, function (match, p1, p2, offset) {
            if (p2) return p2.toUpperCase();
            return p1.toLowerCase();
        });
    }
};