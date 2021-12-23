import fetch from 'node-fetch';
import cheerio from 'cheerio';

// function to get the raw data
const getRawData = (URL) => {
   return fetch(URL)
      .then((response) => response.text())
      .then((data) => {
         return data;
      });
};

// URL for data
const URL = "https://redcat.ca/";

// start of the program
const getTicketList = async () => {
   const ticketsRawData = await getRawData(URL);
   //console.log(ticketsRawData);

   const parsedData = cheerio.load(ticketsRawData);
   //console.log(parsedData);

   const ticketDataList = parsedData(".ticket")[0]
   .children[1].children;

   console.log(ticketDataList);

};

// invoking the main function
getTicketList();