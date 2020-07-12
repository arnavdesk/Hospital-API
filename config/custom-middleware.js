module.exports.handleError = function (err, request, response, next) {
    if (err) {
        console.log(err);
        return response.json(request.code, {
            status :request.code,
            message: request.info,
        });
    }
    else {
        next();
    }
};