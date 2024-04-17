/**
 * GET /
 * Homepage
 */

exports.homepage = function homepage(req, res) {
    const locals = {
        title: "Notes Hub",
        description: "Free NodeJs Notes App",
    };
    res.render("index", { locals, layout: "../views/layouts/front-page" });
};

/**
 * GET /
 * About
 */

exports.about = function homepage(req, res) {
    const locals = {
        title: "About - Notes Hub",
        description: "Free NodeJs Notes App",
    };
    res.render("about", { locals });
};
