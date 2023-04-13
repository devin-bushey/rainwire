import healthchecker from './routes/healthchecker';
import express from 'express';
import cors from 'cors';
require('dotenv').config({ path: '../.env' });
const port = process.env.PORT || 5000;
import { recordRoutes } from './routes/record';
const app = express();
// get driver connection
import dbo from './db/conn';

app.use(cors());
app.use(express.json());
app.use(recordRoutes);
app.use('/', healthchecker);

app.listen(port, async () => {
  // perform a database connection when server starts
  await dbo.connectToServer(function (err: any) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
