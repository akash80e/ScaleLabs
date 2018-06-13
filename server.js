var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var mongoose = require('mongoose');
var product = require('./product');
var csv = require("csvtojson");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8090;
var router = express.Router();

mongoose.connect('mongodb://localhost:27017/products');

// Middle Route 

router.use(function (req, res, next) {
    // do logging 
    // do authentication 
    console.log('Logging of request will be done here');
    next(); // make sure we go to the next routes and don't stop here
});


router.route('/books').post(function (req, res) {
    //console.log("in add");
    var p = new product();
    p.title = req.body.title;
    p.price = req.body.price;
    p.instock = req.body.instock;
    p.author = req.body.author;
    p.save(function (err) {
        if (err) {
            res.send(err);
        }
        console.log("added");
        res.send({ message: 'Product Created !' })
    })
});

router.route('/books').get(function (req, res) {
    product.find(function (err, products) {
        if (err) {
            res.send(err);
        }
        res.send(products);
    });
});

router.route('/books/:book_id').get(function (req, res) {


    product.findById(req.params.book_id, function (err, prod) {
        if (err)
            res.send(err);
        res.json(prod);
    });
});

router.route('/books/:book_id').put(function (req, res) {

    product.findById(req.params.book_id, function (err, prod) {
        if (err) {
            res.send(err);
        }
        prod.title = req.body.title;
        prod.price = req.body.price;
        prod.instock = req.body.instock;
        prod.author = req.body.author;
        prod.save(function (err) {
            if (err)
                res.send(err);

            res.json({ message: 'Product updated!' });
        });

    });
});

router.route('/books/:title').post(function(req,res){
    product.find({"title":req.params.title}).exec(function(err,instance){
        if (err) {
            res.send(err);
        } else {
            res.json(instance);
        }
    });
});

router.route('/books/:book_id').delete(function (req, res) {


    product.remove({ _id: req.param.book_id }, function (err, prod) {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted' });
    })

});

router.route('/upload').post(function(req,res){
    csv()
    .fromFile('booklist.csv')
    .on('csv',(csvRow)=>{ // this func will be called for each row
        var p = new product();
        p.id = csvRow[0];
        p.name = csvRow[1];
        p.author = csvRow[2];
        p.price = csvRow[3];
        p.save(function (err) {
            if (err)
                res.send(err);

            res.json({ message: 'Product added!' });
        });
        
    });

});


app.use(cors());
app.use('/api', router);
app.listen(port);
console.log('REST API is runnning at ' + port);
