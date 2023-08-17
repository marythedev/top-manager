const checkAuthorization = (req, res, next) => {
    if (!req.session.user)
        res.redirect("/login");
    else
        next();
}

const checkNeedForLogin = (req, res, next) => {
    if (req.session.user)
        res.redirect("/");
    else
        next();
}

module.exports = { checkAuthorization, checkNeedForLogin };