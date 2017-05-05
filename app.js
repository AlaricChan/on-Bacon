var express = require('express')
var path = require('path');
var app = express();
var promise = require('bluebird');
var ejs = require('ejs');

// use DEBUG=express:* node app.js

//connect to mongo db
// Retrieve
var MongoClient = require('mongodb').MongoClient;
var cmdb;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/cmdb", function(err, db) {
  if(!err) {
    db.collection('hwinfo',function(error, collection){
        if(!error) {
            cmdb = collection;
            console.log('db cmdb.options connected')  
        } else {
            console.error(error);
        }
    });    
  } else {
      console.error(err);
  }
});


//setup static file option on route /static
app.use('/static', express.static(path.join(__dirname, 'static')));


//simple template renderer
// It loads files from static directory and renderer it with options 
// available in the request query
app.get('/templates/:filename', function(req, res, next) {
    try {
        res.send(renderFile(req.params.filename, req.query));
    } catch (err) {
        res.status(404).send({errorMessage: err.message});
    }
});

// this route is used for with a cmdb
// find a match to the filename in the database
// render the file with opptions loaded from the db
app.get('/cmdb/:filename', function(req, res, next) {
    promise.try(function(){
        return cmdb.findOne({macaddress: req.query.macaddress});
    })
    .then(function(data){
        return searchKeys(data, req.params.filename);
    })
    .then(function(options){
    res.send(renderFile(req.params.filename, options));
    })
    .catch(function(err){
        res.status(404).send({errorMessage: err.message});
    });
    
});

// start server
var server = app.listen(9999, function() {
    console.log('I am listening on port ', server.address().port);    
});

function renderFile(filename, options) {
    var template = require('fs').readFileSync(path.join(__dirname, 'static/' + filename), 'utf8');
    return ejs.render(template, options);         
}

function searchKeys(myarray, key) {
    return new promise(function(resolve,reject){
        Object.keys(myarray).forEach(function(element) {
            if(key.indexOf(element) >=0) {
                resolve (myarray[element]);
            }
        });
        reject({message:'cannot find options to render '  + key});
    });    
}
