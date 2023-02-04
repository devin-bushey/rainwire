export function addSimpleDataToCollection(collection_name: string, tickets: any, db_connect: any) {
  try {
    db_connect.createCollection(collection_name, function (err: any, res: any) {
      if (err) throw err;
      console.log(collection_name + ' created!');
    });

    db_connect.collection(collection_name).insertMany(tickets, function (err: any, res: { insertedCount: string }) {
      if (err) throw err;
      console.log('Successfully added ' + res.insertedCount + ' records to ' + collection_name);
    });
  } catch (err) {
    console.log('Error with ' + collection_name + ' at createCollection');
    console.log(err);
  }
}
