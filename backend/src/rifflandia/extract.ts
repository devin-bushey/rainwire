require('dotenv').config({ path: './config.env' });
import dbo from '../db/conn';
import _ from 'lodash';

import { extract_rifflandia } from './extract_rifflandia';
import { addSimpleDataToCollection } from '../db/addSimpleDataToCollection';
import { RIFFLANDIA_SIMPLE } from './constants';

export const extractRifflandia = async () => {
  const db_connect = dbo.getDb();

  let tickets: any[] = [];

  const tickets_rifflandia_park = await extract_rifflandia('the-park');
  const tickets_rifflandia_electric = await extract_rifflandia('electric-avenue');

  tickets_rifflandia_park.forEach(function (obj: any) {
    tickets.push(obj);
  });
  tickets_rifflandia_electric.forEach(function (obj: any) {
    tickets.push(obj);
  });

  // create simple data collection, does not included spotify data
  return await addSimpleDataToCollection(RIFFLANDIA_SIMPLE, tickets, db_connect);
};
