const checkAuthorization = (request, response, next) => {
    if (!request.session.user)
        response.redirect("/login");
    else
        next();
}

const checkNeedForLogin = (request, response, next) => {
    if (request.session.user)
        response.redirect("/");
    else
        next();
}

module.exports = { checkAuthorization, checkNeedForLogin };