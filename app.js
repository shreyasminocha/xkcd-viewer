'use strict';

const express = require('express');
const path = require('path');
const get = require('got').get;
const logger = require('morgan');
const zeroPad = require('zero-pad');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'static')));
app.use(logger('dev'));

function getComicData(number) {
    number = number || '';
    return get(`https://xkcd.com/${number}/info.0.json`);
}

// routes

app.get('/random', async (req, res, next) => {
    try {
        const response = await getComicData();
        let body = JSON.parse(response.body);

        const latest = body.num;
        const random = Math.floor(Math.random() * latest) + 1;

        res.redirect(`/${random}`);
    } catch (err) {
        next(err);
    }
});

app.get('/:comic?', async (req, res, next) => {
    const number = req.params.comic;

    try {
        const response = await getComicData(number);
        let body = JSON.parse(response.body);

        body.month = zeroPad(body.month);
        body.day = zeroPad(body.day);

        res.render('comic', body);
    } catch (err) {
        next(err);
    }
});

app.use((err, req, res, next) => {
    res.locals.safe_title = err.message;
    res.locals.message = err.message;

    if (process.env.DEBUG !== undefined) {
        res.locals.trace = err;
    }

    if (err.message === 'Response code 404 (Not Found)') {
        err.status = 404;
    }

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
