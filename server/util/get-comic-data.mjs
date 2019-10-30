import http from 'got';

async function getComicData(number) {
    number = number || '';
    const response = await http.get(`https://xkcd.com/${number}/info.0.json`);

    return JSON.parse(response.body);
}

export default getComicData;
