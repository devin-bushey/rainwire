import dbo from "./conn";

export const connectToDatabase = async () => {
  let db_connect = dbo.getDb();

  if (!db_connect) {
    console.log("reconnecting to db");
    await dbo.connectToServer(function (err: any) {
      if (err) {
        console.log("reconnecting error");
        console.error(err);
      }
    });
    db_connect = dbo.getDb();
  }

  return db_connect;
};
