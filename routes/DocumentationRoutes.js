const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("doc/DocGeneralView.twig");
});

router.get("/js", (req, res) => {
    res.render("doc/DocJsView.twig");
});

router.get("/php", (req, res) => {
    res.render("doc/DocPhpView.twig");
});

module.exports = router;