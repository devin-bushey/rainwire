const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "../.env" });
const port = process.env.PORT || 5000;
const cron = require("node-cron");
let shell = require("shelljs");

const swaggerUI = require("swagger-ui-express");
const docs = require('./docs');

const dbo = require("./db/conn");

app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));
app.use('/healthcheck', require('./routes/healthchecker'));
app.use('/api', swaggerUI.serve, swaggerUI.setup(docs));


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);

  dbo.connectToServer(function (err) {
    if (err) {
      console.error(err);
    }
  });

});

