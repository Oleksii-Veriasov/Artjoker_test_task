const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const multer = require("multer");
const upload = multer({ dest: 'temp/' });
const fs = require('fs');
const path = require('path');
const csvjson = require('csvjson');
const app = express();
const port = 8080;
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'csvStorage';


let options = {
    headers: "UserName,FirstName,LastName,Age",
    delimiter: ',',
    quote: '"'
};

app.use(bodyParser.urlencoded({ extended: true }));

const mongoClient = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
let dbClient;

mongoClient.connect(function(err, client) {
    if (!client)
        console.log("Error connecting db")
    else
        console.log("Db connected successfully")


    dbClient = client;
    app.locals.collection = client.db(dbName).collection("items");
    app.listen(port, function() {
        console.log("Running node.js server on port " + port);
    });
});

app.post('/api/items', upload.single('csvFile'), (req, res) => {

    if (!req.file) return res.sendStatus(400);
    let data = fs.readFileSync(path.join(process.cwd(), '/temp/', `${req.file.filename}`), { encoding: 'utf8' }, (err, data) => {
        if (err) {
            console.log(err);
            throw new Error(err);
        }
    });


    let myData = csvjson.toObject(data, options);

    const collection = req.app.locals.collection;
    collection.insertMany(myData, (err, result) => {
        if (err) {
            return response.status(500).send(error);
        } else {
            res.send(result.ops);
        }
        fs.unlink(`${process.cwd()}/temp/${req.file.filename}`, function(err) {
            if (err) throw err;
            console.log('File deleted!');
        });
    });
});

app.get("/api/items", (req, res) => {
    const collection = req.app.locals.collection;
    collection.find({}).toArray(function(err, items) {
        if (err) {
            return response.status(500).send(error);
        } else {
            res.send(items);
        }
    });
});


app.get("/api/export", (req, res) => {
    const collection = req.app.locals.collection;
    collection.find().toArray(function(err, result) {
        if (err) return response.status(500).send(error);
        fs.writeFileSync('./temp/temp.json', JSON.stringify(result, null, 2), 'utf-8');
    });
    const data = fs.readFileSync(path.join(__dirname, '/temp/temp.json'), { encoding: 'utf8' });
    let options = {
        delimiter: ",",
        wrap: false,
        headers: "key"
    };
    let stringify = csvjson.toCSV(data, options);

    fs.writeFileSync(path.join(__dirname, '/temp/temp.csv'), stringify);
    res.sendFile(path.join(__dirname, '/temp/temp.csv'));
});

process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});