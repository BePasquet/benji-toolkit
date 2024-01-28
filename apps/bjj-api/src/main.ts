import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import { getBjjTechniques, parseTechniquesForClient } from './bjj.service';

const app = express();

app.use(cors({ origin: '*' }));
app.use(json());

app.get('/techniques', async (req, res) => {
  const techniques = await getBjjTechniques();
  const result = parseTechniquesForClient(techniques);

  res.json(result);
});

const port = process.env.PORT || 3333;

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

server.on('error', console.error);
