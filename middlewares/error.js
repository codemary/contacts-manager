function handler(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    // render the error page
    res.status(err.status || 500); // if error.status is undefined, set status 5000
    res.send(err);
}

module.exports = {
    handler: handler,
}