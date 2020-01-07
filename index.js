const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://kolimayurs:29031991@cluster0-onizc.mongodb.net';
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.sendStatus(200)
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/subscribe', (req, res) => {
	res.header('Access-Control-Allow-Origin', 'https://amp.gmail.dev');
    res.header('AMP-Access-Control-Allow-Source-Origin', 'amp@gmail.dev');
    res.header('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) {
            return res.send(err);
        }
        var dbo = db.db("myDB");
        var myobj = { email: req.body.email };
        dbo.collection("resapi").insertOne(myobj, function(err, result) {
            if (err) {
                return res.send(err);
            }
            res.json(result);
            db.close();
        });
    });

});

app.get('/emails', (req, res) => {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) {
            return res.send(err);
        }
        var dbo = db.db("myDB");
        dbo.collection("resapi").find({}).toArray(function(err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

var port = Number(process.env.PORT || 4000);
app.listen(port, () => {
    console.log('Product server listing from port ' + port);
})