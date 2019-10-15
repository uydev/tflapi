var Client = require('node-rest-client').Client;
var client = new Client();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://olvin:pass@cluster0-tiaxv.azure.mongodb.net/test?retryWrites=true&w=majority";

MongoClient.connect(url, function(err, db) {

    stations = [
        'EUS',
        'KGX',
    ];

    stations.forEach (function(station) {
        client.get(`http://transportapi.com/v3/uk/places.json?query=${station}&type=train_station&app_id=85fb3840&app_key=a8a830e9b14115edf769ea14e6978415`, function (data, response) {
            console.log(data);

            if (err) throw err;
            var dbo = db.db("olvin");
            var myobj = {
                request_time: data['request_time'],
                source: data['source'],
                acknowledgements: data['acknowledgements'],
                member: data['member'],
            };

            dbo.collection("tfl").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log(`1 document inserted for ${station}`);
                db.close();
            });
        });
    });
});