import express from 'express';
import get from 'got';
import logger from 'morgan';
import zeroPad from 'zero-pad';

const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('./static'));
app.use(logger('dev'));

function getComicData(number) {
    number = number || '';
    return get(`https://xkcd.com/${number}/info.0.json`);
}

app.get('/random', async (request, res, next) => {
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

app.get('/:comic?', async (request, res, next) => {
    const number = request.params.comic;

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

app.use((error, request, res) => {
    res.locals.safe_title = error.message; // eslint-disable-line camelcase
    res.locals.message = error.message;

    if (process.env.DEBUG !== undefined) {
        res.locals.trace = error;
    }

    if (error.message === 'Response code 404 (Not Found)') {
        error.status = 404;
    }

    res.status(error.status || 500);
    res.render('error');
});

export default app;
