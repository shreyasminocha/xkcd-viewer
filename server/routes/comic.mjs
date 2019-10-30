import zeroPad from 'zero-pad';
import getComicData from '../util/get-comic-data.mjs';

async function comic(request, response, next) {
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

    response.render('comic', body);
}

export default comic;
