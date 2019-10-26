const path = require('path');
const express = require('express');
const {get} = require('got');
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

app.get('/random', async (req, res, next) => {
    let response;
    let body;

    try {
        response = await getComicData();
        body = JSON.parse(response.body);
    } catch (error) {
        next(error);
    }

    const latest = body.num;
    const random = Math.floor(Math.random() * latest) + 1;

    res.redirect(`/${random}`);
});

app.get('/:comic?', async (req, res, next) => {
    const number = req.params.comic;

    let response;
    let body;

    try {
        response = await getComicData(number);
        body = JSON.parse(response.body);
    } catch (error) {
        next(error);
    }

    body.month = zeroPad(body.month);
    body.day = zeroPad(body.day);

    if (number === undefined) {
        body.isLatest = true;
    }

    res.render('comic', body);
});

app.use((err, req, res) => {
    res.locals.safe_title = err.message; // eslint-disable-line camelcase
    res.locals.message = err.message;

    if (process.env.DEBUG !== undefined) {
        res.locals.trace = err;
    }

    if (err.message === 'Response code 404 (Not Found)') {
        err.status = 404;
    }

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
