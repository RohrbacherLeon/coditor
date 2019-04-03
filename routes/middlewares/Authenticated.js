function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error_msg", "Veuillez vous connecter.");
        res.redirect("/login");
    }
};

function notAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect("/exercises");
    } else {
        return next();
    }
};

function isTeacher (req, res, next) {
    if ((req.user.type === "teacher" && !req.user.pending) || req.user.type === "admin") {
        return next();
    }
    res.redirect("/profile");
}

function isAdmin (req, res, next) {
    if (req.user !== undefined && req.user.type !== undefined && req.user.type === "admin") {
        return next();
    }
    res.redirect("/");
}

function isConnectedWithLocalAccount (req, res, next) {
    if (req.user.account === "local") {
        return next();
    }
    res.redirect("/profile");
}

module.exports = {
    ensureAuthenticated,
    notAuthenticated,
    isTeacher,
    isAdmin,
    isConnectedWithLocalAccount
};