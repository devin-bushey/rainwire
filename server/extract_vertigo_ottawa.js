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
const URL = "http://www.vertigorecords.ca/showtickets/index.html";

// start of the program
const getTicketList = async () => {
   const ticketsRawData = await getRawData(URL);
   //console.log(ticketsRawData);

   const $ = cheerio.load(ticketsRawData);
   //console.log(parsedData);

   const ticketDataList = $('#contentarea')[0]
   .children;

   //console.log($('#contentarea')[0].children)

   ticketDataList.forEach(element => {
       if (element.name == "p"){

        const record = element.children.filter((column) => column.name === "b");
        console.log(record);
            //console.log("found");
            //console.log(element);
            //console.log(element.children[0].data)
       }
   });

   /* const ticketDataList = parsedData(".ticket")[0]
   .children[1].children; */

   //console.log($('.ticket').text);
   //console.log(ticketDataList);



   /* console.log(ticketDataList);

   ticketDataList.forEach((row) => {
    const columns = row.children.filter((column) => column.name === "h3");

    // extracting year
    const yearColumn = columns[0];
    if (yearColumn) {
       year = yearColumn.children[0];
       if (year) {
          year = year.children[0].data;
       }
    }

    console.log(row);

    }); */

};

// invoking the main function
getTicketList();