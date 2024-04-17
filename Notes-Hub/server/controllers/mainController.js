/**
 * GET /
 * Homepage
 */

exports.homepage = function homepage(req, res) {
    const locals = {
        title: "NodeJs Notes",
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
        title: "About - NodeJs Notes",
        description: "Free NodeJs Notes App",
    };
    res.render("about", { locals });
};
