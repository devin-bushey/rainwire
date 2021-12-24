const request = require('request');
const cheerio = require('cheerio');

//import request from 'request';
//import cheerio from 'cheerio';

//import axios from 'axios';

function getTicketJSON() {
    request('http://www.vertigorecords.ca/showtickets/index.html', (error, response, html) => {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        const ticketsRawData = $('#contentarea');

        //console.log(tickets.text());

        let ticketList = new Array();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        var ticketsString = '{ "tickets":[ ';

        var lines = ticketsRawData.text().split('\n');
        for(var i = 0;i < lines.length;i++){

            if (months.some(month => lines[i].substring(0,3).includes(month)) && lines[i].length > 10){
                //console.log(lines[i]);
                var dateMonth = lines[i].substring(0,3).trim();
                var dateDay = lines[i].substring(4,6).trim();
                var bandName = lines[i].substring(lines[i].indexOf(':') + 2, lines[i].indexOf('$')).trim();
                var price = lines[i].substring(lines[i].indexOf('$')).trim();
                var isSoldOut = false;

                if (price.includes('==')){
                    price = lines[i].substring(lines[i].indexOf('$'), lines[i].indexOf('=')).trim();
                    isSoldOut = false;
                }

                if (price.includes('(')){
                    price = lines[i].substring(lines[i].indexOf('$'), lines[i].indexOf('(')).trim();
                }

                //console.log(dateMonth + ", " + dateDay + ", " + bandName + ", " + price + ", " + isSoldOut);
                
                ticketsString += '{ "month": "' + dateMonth + '" , "day": ' + dateDay  + ' , "band": "' + bandName + '" , "price": "' + price + '" , "soldout": ' + isSoldOut + '},';
                //ticketList.push(jsonString);
                
            }
        }

        ticketsString = ticketsString.substring(0, ticketsString.length - 1); // remove last comma
        ticketsString += ']}';

        const ticketsJSON = JSON.parse(ticketsString);

        //console.log(ticketsString);
        //console.log(JSON.stringify(ticketsJSON));

        return ticketsJSON;

    }
    else{
        console.log('error');
        console.log(response.statusCode);
        return null;
    }
})
}
