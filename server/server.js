const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "../.env" });
const port = process.env.PORT || 5000;
const cron = require("node-cron");
let shell = require("shelljs");

const dbo = require("./db/conn");

app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);

  dbo.connectToServer(function (err) {
    if (err) {
        console.error(err);
    }
  });

});

/*
// scheduled for every sunday
cron.schedule("0 0 * * 0", function(){

  console.log("Schedule running");
  if (shell.exec("node extract_tickets.js").code !== 0){
      console.log("Error during cron scheduler");
  }

});
*/