module.exports.handleError = function (err, request, response, next) {
    if (err) {
        request.code = 401;
        request.info = "Authorization failed! Invalid Authorization key!!"
        return response.json(request.code, {
            status: request.code,
            message: request.info,
        });
    }
    else {
        next();
    }
};


