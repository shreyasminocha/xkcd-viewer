import express from 'express';
import logger from 'morgan';

import randomComic from './routes/random-comic.mjs';
import comic from './routes/comic.mjs';
import errorHandling from './routes/error-handling.mjs';

const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('./static'));
app.use(logger('dev'));

app.get('/random', randomComic);
app.get('/:comic?', comic);

app.use(errorHandling);

app.listen(process.env.PORT || 3000);
