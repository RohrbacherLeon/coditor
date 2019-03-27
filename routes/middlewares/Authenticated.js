function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        // req.flash("error_msg','You are not logged in');
        res.redirect("/login");
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
    isTeacher,
    isAdmin,
    isConnectedWithLocalAccount
};