import get from 'got';

async function getComicData(number) {
    number = number || '';
    const response = await get(`https://xkcd.com/${number}/info.0.json`);

    return JSON.parse(response.body);
}

export default getComicData;
