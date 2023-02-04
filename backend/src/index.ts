import healthchecker from './routes/healthchecker';
import express from 'express';
import cors from 'cors';
require('dotenv').config({ path: '../.env' });
const port = process.env.PORT || 5000;
import { connectToServer } from './db/conn';
import { recordRoutes } from './routes/record';

const app = express();

app.use(cors());
app.use(express.json());
app.use(recordRoutes);
app.use('/', healthchecker);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);

  connectToServer(function (err: any) {
    if (err) {
      console.error(err);
    }
  });
});
