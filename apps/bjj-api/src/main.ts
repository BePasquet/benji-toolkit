import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import { getBjjTechniques } from './bjj.service';

const app = express();

app.use(cors({ origin: '*' }));
app.use(json());

app.get('/techniques', async (_, res) => {
  try {
    const techniques = await getBjjTechniques();

    res.json(techniques.serialized);
  } catch (e) {
    res
      .status(500)
      .json({ message: 'Sorry there was an error please try again later' });
  }
});

const port = process.env.PORT || 3333;

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

server.on('error', console.error);
