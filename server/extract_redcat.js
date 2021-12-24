import fetch from 'node-fetch';
//const fetch = require('node-fetch');

import cheerio from 'cheerio';
//const cheerio = require('cheerio');

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

   const $ = cheerio.load(ticketsRawData);
   //console.log(parsedData);

   const ticketDataList = $('#shopify-section-sidebar')[0].children;

   ticketDataList.forEach(element => {
      //console.log(element.name);
      //console.log(element.name);
      
      if (element.name == "div"){
       //console.log(element);
      }
   });

   console.log(ticketDataList.html());



/*    const ticketDataList = $('.ticket')[0].children;

   ticketDataList.forEach(element => {
      if (element.name == "h3"){
       console.log(element.children[0].data);
      }
   }); */


};

// invoking the main function
getTicketList();