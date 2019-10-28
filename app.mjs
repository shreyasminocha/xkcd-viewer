import express from 'express';
import get from 'got';
import logger from 'morgan';
import zeroPad from 'zero-pad';
import getComicData from './util/get-comic-data.mjs';

const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('./static'));
app.use(logger('dev'));

app.get('/random', async (request, res, next) => {
    let randomComic;

    try {
        randomComic = await get('https://c.xkcd.com/random/comic', {
            followRedirect: false
        });
    } catch (error) {
        next(error);
    }

    const comicUrl = randomComic.headers.location;
    const comicNumber = Number(
        comicUrl.replace('https://xkcd.com/', '').replace('/', '')
    );

    res.redirect(`/${comicNumber}`);
});

app.get('/:comic?', async (request, res, next) => {
    const number = request.params.comic;

    let body;

    try {
        body = await getComicData(number);
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

app.listen(process.env.PORT || 3000);
