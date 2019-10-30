import http from 'got';

async function randomComic(request, response, next) {
    let randomComic;

    try {
        randomComic = await http.get('https://c.xkcd.com/random/comic', {
            followRedirect: false
        });
    } catch (error) {
        next(error);
    }

    const comicUrl = randomComic.headers.location;
    const comicNumber = Number(
        comicUrl.replace('https://xkcd.com/', '').replace('/', '')
    );

    response.redirect(`/${comicNumber}`);
}

export default randomComic;
