function errorHandling(error, request, response) {
    response.locals.safe_title = error.message; // eslint-disable-line camelcase
    response.locals.message = error.message;

    if (process.env.DEBUG !== undefined) {
        response.locals.trace = error;
    }

    if (error.message === 'Response code 404 (Not Found)') {
        error.status = 404;
    }

    response.status(error.status || 500);
    response.render('error');
}

export default errorHandling;
