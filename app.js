'use strict';

const express = require('express');
const path = require('path');

const app = express();
const request = require('request');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'static')));

// routes
app.get('/:comic?', (req, res, next) => {
    const number = req.params.comic || '';

    request(`https://www.xkcd.com/${number}/info.0.json`, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            res.render('comic', JSON.parse(body));
        } else {
            next();
        }
    });

});

app.get('/random', (req, res, next) => {
    request('https://www.xkcd.com/info.0.json', (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const latest = JSON.parse(body).num;
            const random = Math.floor(Math.random() * latest) + 1;
            res.redirect(300, `/${random}`);
        } else {
            next();
        }
    });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.locals.title = err.message;

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
