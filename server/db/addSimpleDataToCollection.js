function createCollection(collection_name, tickets, db_connect) {

    try{
        db_connect.createCollection(collection_name, function (err, res) {
            if (err) throw err;
            console.log(collection_name + " created!");
        });
    
        db_connect.collection(collection_name).insertMany(tickets, function (err, res) {
            if (err) throw err;
            console.log("Successfully added " + res.insertedCount + " records to " + collection_name);
        });
    }
    catch(err){
        console.log("Error with " + collection_name + " at createCollection");
        console.log(err);
    }

    
}

module.exports = { createCollection };