var cors = require('cors');
var mongoose = require('mongoose');
var express = require("express");
var app = express();
var path = require("path");
var http = require("http");
var btoa = require('btoa');

qs = require('querystring');
var r = require("rethinkdb");
const uuidV1 = require('uuid/v1');


var Passport = require('passport')
var Strategy = require('passport-local').Strategy
var CookieParser = require('cookie-parser')
var BodyParser = require('body-parser')
var Session = require('express-session')
var Repo = require('./common/repo')
const exphbs = require('express-handlebars')

var sessiondata;

var Schema = mongoose.Schema;
var schemaName = new Schema({
    'title': String,
    'currency': String,
    'product_sku': String,
    'content': String,
    'StartingBid': Number,
    'currentBid': Number,
    'UpperLimitBid': Number,
    'BidIncrementedBy': Number,
    'EndBidDate': Date,
    'endOfAuctionMethod': Number,
    'owner': String,
    'isBidEnds': String
}, {
    collection: 'auction'
});

var Auction = mongoose.model('Auction', schemaName);
//mongoose.connect('mongodb://localhost:27017/dbName');
//mongoose.connect('mongodb://test:test@ds027425.mlab.com:27425/expense');
mongoose.connect('mongodb://obdev:123456@ds133311.mlab.com:33311/closeoutpromo');


const Queue = require('rethinkdb-job-queue')
    //139.59.35.45
    //172.16.230.196
const cxnOptions = {
    host: '139.59.35.45',
    port: 28016,
    db: 'rfqQueue'
}

const qOptions = {
    name: 'RFQRequest',
    masterInterval: 1000000,
    changeFeed: true,
    concurrency: 50,
    removeFinishedJobs: false
}

var connection = null;
r.connect({ host: cxnOptions.host, port: cxnOptions.port, db: 'test' }, function(err, conn) {
    if (err) throw err;
    connection = conn;
})

const q = new Queue(cxnOptions, qOptions)
let currentHost = q.host

//
// Set our custom strategy in passport, plus user serialization.
Passport.use(new Strategy((username, password, cb) => {
    Repo.users.findByUsername(username, (err, user) => {
        if (err) {
            cb(err)
        } else if (!user) {
            cb(null, false)
        } else if (user.password !== password) {
            cb(null, false)
        } else {
            cb(null, user)
        }
    })
}))

Passport.serializeUser((user, cb) => {
    cb(null, user.id)
})

Passport.deserializeUser((id, cb) => {
        Repo.users.findById(id, (err, user) => {
            if (err) {
                return cb(err)
            } else {
                cb(null, user)
            }
        })
    })
    //

app.use(CookieParser())
app.use(BodyParser.urlencoded({ extended: true }))
app.use(Session({ secret: 'magically', resave: false, saveUninitialized: false }))
app.use(Passport.initialize())
app.use(Passport.session())

app.use(express.static(__dirname + '/search'));
app.use(express.static(__dirname + '/productdetail'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/search/" + '/index.html');
});


app.get('/product', authenticationMiddleware(), function(req, res) {
    res.sendFile(path.join(__dirname, './productdetail', '/Index.html'));
});

//app.get('/profile', authenticationMiddleware(), renderProfile)

app.get('/productdetail', authenticationMiddleware(), function(req, res) {
    var query = require('url').parse(req.url, true).query;
    var id = sessiondata;
    if (id == undefined || id == '')
        id = query.sku;
    sessiondata = '';
    if (id != 0)
        res.redirect('/product?sku=' + id);
    else
        res.redirect('/');

});

app.post('/logincheck', Passport.authenticate('local', {
    successRedirect: '/productdetail',
    failureRedirect: '/'
}))


app.get('/login/:id', function(req, res) {
    sessiondata = req.params.id;
    res.sendFile(path.join(__dirname, './productdetail', '/login.html'));
});


app.post('/api/inserttorithink', function(req, res) {
    const job = q.createJob({ data: JSON.parse(req.body.data) })
    q.addJob(job).then((savedJobs) => {
            console.log(savedJobs[0]) // Logs 'flash@fast.net'
        }).catch(err => console.error(err))
        // var body = '';
        // req.on('data', function(data) {
        //     body += data;
        // });
        // req.on('end', function() {
        //     var POST = qs.parse(body);
        //     console.log(POST.data);
        //     const job = q.createJob({ data: JSON.parse(POST.data) })
        //     q.addJob(job).then((savedJobs) => {
        //         console.log(savedJobs[0]) // Logs 'flash@fast.net'
        //     }).catch(err => console.error(err))
        // });
        // var POST = qs.parse(body);
});

let bidData = null
app.post('/api/save/', cors(), function(req, res) {
    var POST = req.body;
    bidData = {
        //'_id': uuidV1(),
        'title': POST.title,
        'currency': '$',
        'product_sku': POST.product_sku,
        'content': POST.title,
        'StartingBid': POST.StartingBid,
        'currentBid': POST.StartingBid,
        'UpperLimitBid': POST.UpperLimitBid,
        'BidIncrementedBy': POST.BidIncrementedBy,
        'EndBidDate': POST.EndBidDate,
        'endOfAuctionMethod': POST.endOfAuctionMethod,
        'owner': POST.owner,
        'isBidEnds': 'no'
    }
    var savedata = new Auction(bidData).save(function(err, result) {
        if (err) throw err;
        if (result) {
            bidData.bids = []
            r.table('bidding').insert(bidData).run(connection, function(err, result) {
                if (err) throw err;
                console.log(JSON.stringify(result, null, 2));
            })
            res.json(result)
        }
    })
})

// app.post('/api/save/', cors(), function(req, res) {
//     var body = '';
//     req.on('data', function(data) {
//         body += data;
//     });
//     req.on('end', function() {
//         var POST = qs.parse(body);
//         console.log(POST);
//         var savedata = new Auction({
//             'title': POST.title,
//             'product_sku': POST.product_sku,
//             'content': POST.title,
//             'StartingBid': POST.StartingBid,
//             'UpperLimitBid': POST.UpperLimitBid,
//             'BidIncrementedBy': POST.BidIncrementedBy,
//             'EndBidDate': POST.EndBidDate,
//             'endOfAuctionMethod': POST.endOfAuctionMethod,
//             'owner': POST.owner,
//             'isBidEnds': 'no'
//         }).save(function(err, result) {
//             if (err) throw err;
//             if (result) {
//                 res.json(result)
//             }
//         })
//     });
// })


app.get('/auctions', function(req, res) {
    Auction.find({}).lean().exec(function(err, auctions) {
        if (err) {
            console.log(err)
        }
        res.json(auctions)
    })
})


app.get('/logout', function(req, res) {
    req.logOut()
    res.redirect('/')
});

app.get('/auctionlist', function(req, res) {
    res.sendFile(path.join(__dirname, './productdetail', '/auctionlist.html'));
});

app.get('/isuserloggedin', function(req, res) {
    res.json(req.user);
})

app.get('/myAccount', function(req, res) {
    let data = req.user;
    if (req.user != undefined) {
        let userstring = data.username + "||" + data.password;
        console.log(userstring);
        res.redirect('http://localhost:3000' + req.url + '?id=' + btoa(userstring));
    } else
        res.redirect('/login/0')
});

app.listen(3001);

console.log("Running at Port 3001");

function authenticationMiddleware() {
    return function(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        var query = require('url').parse(req.url, true).query;
        res.redirect('/login/' + query.sku);
    }
}
