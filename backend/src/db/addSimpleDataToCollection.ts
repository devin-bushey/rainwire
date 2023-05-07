export const addSimpleDataToCollection = async (collection_name: string, tickets: any, db_connect: any) => {
  await db_connect.createCollection(collection_name, function (err: any, res: any) {
    if (err) throw err;
    console.log(collection_name + ' created!');
  });

  await db_connect.collection(collection_name).insertMany(tickets, function (err: any, res: { insertedCount: string }) {
    if (err) throw err;
    console.log('Successfully added ' + res.insertedCount + ' records to ' + collection_name);
  });

  return true;
};
