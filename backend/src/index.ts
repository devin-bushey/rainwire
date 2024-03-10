import express from 'express';
import cors from 'cors';

require('dotenv').config({ path: '../.env' });
const port = process.env.PORT || 5000;
const app = express();

import dbo from './database/conn';

import healthchecker from './controller/healthchecker';
import { victoriaRouter } from './controller/victoriaController';
import { rifflandiaRouter } from './controller/rifflandiaController';
import { jamBaseRouter } from './controller/jamBaseController';

app.use(cors());
app.use(express.json());
app.use('/', healthchecker);

app.use(victoriaRouter);
app.use(rifflandiaRouter);
app.use(jamBaseRouter);

app.listen(port, async () => {
  // perform a database connection when server starts
  await dbo.connectToServer(function (err: any) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
