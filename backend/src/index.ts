const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config({ path: '../.env' });
const port = process.env.PORT || 5000;

const swaggerUI = require('swagger-ui-express');

const dbo = require('./db/conn');

const records = require('./routes/record');

app.use(cors());
app.use(express.json());
app.use(records);
//app.set('/', healthchecker);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);

  dbo.connectToServer(function (err: any) {
    if (err) {
      console.error(err);
    }
  });
});
