//Class: DAAA/FT/1B/01
//Admission Number: p2214449
//Name: Tan Wen Tao Bryan
var express = require('express');
var bodyParser = require('body-parser');
var userDB = require('../model/user');
var verifyToken = require('../auth/auth.js');
var app = express()
var cors = require('cors');
app.options('*', cors());
app.use(cors());

//apply middleware to do the request pre-processing on the request
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);//attach body-parser middleware
app.use(bodyParser.json());//parse json data

//Login Page
app.post('/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    if (typeof email == "undefined" || typeof password == "undefined" || email.length == 0 || password.length == 0) {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "missing data"}`);
        return;
    }
    userDB.loginStaff(email, password, function (err, verifyToken, result) {
        if (!err) {
            res.status(201);
            res.type("json");
            res.json({ success: true, UserData: JSON.stringify(result[0]), token: verifyToken, status: "Sucessfully logged in!" })
        } else {
            if (err.statusCode == 403) {
                res.status(403);
                res.type('json');
                res.send(`{"error_msg":"Invalid Email or Password"}`)
            }
            else {
                res.status(500);
                res.send(`{"error_msg":"Internal Server Error"}`);
            }
        }
    });
});

//Default Show All Results on Home Page
app.get('/films', function (req, res) {
    userDB.getFilms(function (err, result) {
        if (err) {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg": "Internal server error"}`);
        }
        else {
            res.status(200);
            res.type('application/json');
            res.send(result);
        }
    });
});

//Show categories in dropdown
//GET all film_categories
app.get('/film_categories/category', function (req, res) {
    userDB.getCategory(function (err, result) {
        if (err) {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg": "Internal server error"}`);
        }
        else {
            res.status(200);
            res.type('application/json');
            res.send(result);
        }
    });
});

//GET films search results by category, title, maxRental
app.get('/films/results', function (req, res) {
    var { category, title, maxRental } = req.query;
    if (category == null || title == null || maxRental == null) {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg":"Bad Request"}`);
        return;
    }
    userDB.getSearchResults(category, title, maxRental, function (err, result) {
        if (err) {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg": "Internal server error"}`);
            console.log(err)
        }
        else {
            res.status(200);
            res.type('application/json');
            console.log(result)
            res.send({ sucess: true, UserData: result });
        }
    });
});

//GET details
app.get('/details/:film_id', function (req, res) {
    var { film_id } = req.params;
    userDB.getDetails(film_id, function (err, result) {
        if (err) {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg": "Internal server error"}`);
            console.log(err)
        }
        else {
            res.status(200);
            res.type('application/json');
            console.log(result)
            res.send({ sucess: true, UserData: result });
        }
    });
});

//Add A New Actor (Admin Only)
//POST /actors
app.post('/actors', verifyToken, function (req, res) {
    var { first_name, last_name } = req.body;
    //res.status(400) occur when these keys do not exist
    if (typeof first_name == "undefined" || typeof last_name == "undefined" || first_name.length == 0 || last_name.length == 0) {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "missing data"}`);
        return;
    }
    userDB.insertActor(first_name, last_name, function (err, result) {
        if (err) {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg": "Internal server error"}`);
        }
        else {
            res.status(201);
            res.type('application/json');
            res.send({ success: true, UserData: JSON.stringify(result), token: verifyToken, status: 'You have successfully added an actor!' });
        }
    });
});

//Show stores addresses in dropdown
//GET all stores addresses
app.get('/add_customers/address', function (req, res) {
    userDB.getStores(function (err, result) {

        if (err) {

            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg": "Internal server error"}`);
        }
        else {
            res.status(200);
            res.type('application/json');
            res.send(result);
        }
    });
});

//Add A New Customer (Admin Only)
//POST /customers
app.post('/add_customers', verifyToken, function (req, res) {
    var { store_id, first_name, last_name, email, address, district, city_id, postal_code, phone } = req.body;
    //if any of these keys are undefined, return res.status(400)
    if (store_id.length == 0 || first_name.length == 0 || last_name.length == 0 || email.length == 0 || address.length == 0 || district.length == 0 || city_id.length == 0 || postal_code.length == 0 || phone.length == 0) {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "missing data"}`)
        return;
    }
    else {
        userDB.insertCustomer(store_id, first_name, last_name, email, address, district, city_id, postal_code, phone, function (err, result) {
            if (err) {
                //handles duplicate entry for email, returns res.status(409)
                if (err.code == 'ER_DUP_ENTRY') {
                    res.status(409);
                    res.type('application/json');
                    res.send(`{"error_msg": "Duplicated email address"}`);

                }
                else {
                    res.status(500);
                    res.type('application/json');
                    res.send(`{"error_msg": "Internal server error"}`);
                }

            }
            else {
                res.status(201);
                res.type('application/json');
                res.send({ success: true, UserData: JSON.stringify(result), token: verifyToken, status: 'You have successfully added a customer!' });
            }
        });
    }
});

//Insert a new rating
app.post('/add_ratings', function (req, res) {
    var { first_name, last_name, title, score, comments } = req.body;
    //if any of these keys are undefined, return res.status(400)
    if (first_name.length == 0 || last_name.length == 0 || title.length == 0 || score.length == 0 || comments.length == 0) {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "missing data"}`)
        return;
    }
    if (score<0 || score>5) {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "rating must be between 0 and 5"}`)
        return;
    }
    else {
        userDB.insertRating(first_name, last_name, title, score, comments, function (err, result) {
            if (err) {
                res.status(500);
                res.type('application/json');
                res.send(`{"error_msg": "Internal server error"}`);
            }
            else {
                res.status(201);
                res.type('application/json');
                res.send({ success: true, message:'Rating successfully added!' });
            }
        });
    }
});

//Show Ratings by film
app.get('/details/ratings/:film_id', function (req, res) {
    var { film_id } = req.params;
    userDB.getReviews(film_id, function (err, result) {
        if (err) {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg": "Internal server error"}`);
        }
        else {
            res.status(200);
            res.type('application/json');
            console.log(result)
            res.send({ sucess: true, UserData: result });
        }
    });
});

module.exports = app;