//Class: DAAA/FT/1B/01
//Admission Number: p2214449
//Name: Tan Wen Tao Bryan
var express = require('express');
var bodyParser = require('body-parser');
var userDB = require('../model/user');

var app = express()

//apply middleware to do the request pre-processing on the request
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);//attach body-parser middleware
app.use(bodyParser.json());//parse json data

//Endpoint 1
//GET actor by :id
app.get('/actors/:actor_id', function (req, res) {
    var actor_id = req.params.actor_id;
    userDB.getActor(actor_id, function (err, result) {
        if (err) {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg": "Internal server error"}`);
        }
        else {
            //if result is empty, return res.status(204)
            if (result.length == 0) {
                res.status(204);
                res.type('application/json');
                res.send();
            }
            else {
                res.status(200);
                res.type('application/json');
                res.send(result[0]);
            }
        }
    });
});

//Endpoint 2
//GET/actors limit (default) 20 (offset) 0
app.get('/actors', function (req, res) {
    //set default values for limit and offset, if there is req.query.limit or offset 
    //if not, assign them to their default values
    var limit = req.query.limit ? req.query.limit : 20;
    var offset = req.query.offset ? req.query.offset : 0;
    userDB.getActorslimit(limit, offset, function (err, result) {
        if (!err) {
            res.status(200);
            res.type('application/json');
            res.send(result);
        }
        else {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg": "Internal server error"}`);
        }
    });
});

//Endpoint 3
//POST /actors
app.post('/actors', function (req, res) {
    var { first_name, last_name } = req.body;
    //res.status(400) occur when these keys do not exist
    if (typeof first_name == "undefined" || typeof last_name == "undefined") {
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
            //prints id of result
            res.send(`{"actor_id": ${result.insertId}}`);
        }
    });
});

//Endpoint 4
//PUT /user
app.put('/actors/:actor_id', function (req, res) {
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var actor_id = req.params.actor_id;
    //if both first_name && last_name keys do not exist, return res.status(400)
    if (typeof first_name == "undefined" && typeof last_name == "undefined") {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "missing data"}`);
        return;
    }
    userDB.updateActor(first_name, last_name, actor_id, function (err, result) {
        if (!err) {
            //if actor_id does not exist, return res.status(204)
            if (result.affectedRows == 0) {
                res.status(204);
                res.type('application/json');
                res.send();
            }
            //if it does exist, return res.status(200)
            else {
                res.status(200);
                res.type('application/json');
                res.send(`{"success_msg": "record updated"}`);
            }
        } else {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg": "Internal server error"}`);
        }
    });
});

//Endpoint 5
//DELETE /actors/:id
app.delete('/actors/:actor_id', function (req, res) {
    var actor_id = req.params.actor_id;
    userDB.deleteActor(actor_id, function (err, result) {
        if (err) {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg": "Internal server error"}`);
        } else {
            //if delete is successful, return res.status(200)
            if (result.affectedRows == 1) {
                res.status(200);
                res.type('application/json');
                res.send(`{"success_msg": "actor deleted"}`);
            }
            //if delete is unsuccessful, res.status(204)
            else {
                res.status(204);
                res.type("application/json");
                res.send();
            }
        }
    });
});

//Endpoint 6
//GET film_categories by category_id
app.get('/film_categories/:category_id/films', function (req, res) {
    var category_id = req.params.category_id;
    userDB.getFilmsbyCategory(parseInt(category_id), function (err, result) {
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

//Endpoint 7
//GET the payment detail of a customer between the provided period.
app.get('/customer/:customer_id/payment', function (req, res) {
    var customer_id = req.params.customer_id;
    var start_date = req.query.start_date;
    var end_date = req.query.end_date;
    userDB.getPaymentDetails(customer_id, start_date, end_date, function (err, result) {
        if (err) {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg": "Internal server error"}`);
        }
        else {
            var sum = 0;
            //loops through every detail of result and sum up the amount
            for (i of result) {
                sum += i.amount;
            }
            res.status(200);
            res.type('application/json');
            //if the sum of amount is equal to zero, just shows the sum
            //for any other amount, it will show the round off value by 2 decimal place
            res.send(`{"rental":${JSON.stringify(result)},"total": ${sum == 0 ? sum : sum.toFixed(2)}}`);
        }
    });
});

//Endpoint 8
//POST /customers
app.post('/customers', function (req, res) {
    var { store_id, first_name, last_name, email, address } = req.body;
    //if any of these keys are undefined, return res.status(400)
    if (typeof store_id == "undefined" || typeof first_name == "undefined" || typeof last_name == "undefined" || typeof email == "undefined" || typeof address == "undefined") {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "missing data"}`)
        return;
    }
    //if any of the keys in address key does not exist, return res.status(400)
    else if (typeof address.address_line1 == "undefined" || typeof address.address_line2 == "undefined" || typeof address.district == "undefined" || typeof address.city_id == "undefined" || typeof address.postal_code == "undefined" || typeof address.phone == "undefined") {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "missing data"}`);
        return;
    }
    else {
        userDB.insertCustomer(store_id, first_name, last_name, email, address, function (err, result) {
            if (err) {
                //handles duplicate entry for email, returns res.status(409)
                if (err.code == 'ER_DUP_ENTRY') {
                    res.status(409);
                    res.type('application/json');
                    res.send(`{"error_msg": "email already exist"}`);
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
                res.send(`{"customer_id": ${result.insertId}}`);
            }
        });
    }
});

//Additional Endpoint 1
//POST /staff
app.post('/staff', function (req, res) {
    var { store_id, first_name, last_name, email, username, password, active, address } = req.body;
    //if any of these keys are undefined, return res.status(400)
    if (typeof store_id == "undefined" || typeof first_name == "undefined" || typeof last_name == "undefined" || typeof email == "undefined" || typeof username == "undefined" || typeof password == "undefined" || typeof address == "undefined") {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "missing data"}`);
        return;
    }
    //if any of the keys in address key does not exist, return res.status(400)
    else if (typeof address.address_line1 == "undefined" || typeof address.address_line2 == "undefined" || typeof address.district == "undefined" || typeof address.city_id == "undefined" || typeof address.postal_code == "undefined" || typeof address.phone == "undefined") {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "missing data"}`);
        return;
    }
    else {
        userDB.insertStaff(store_id, first_name, last_name, email, username, password, active, address, function (err, result) {
            if (err) {
                res.status(500);
                res.type('application/json');
                res.send(`{"error_msg": "Internal server error"}`);
            }
            else {
                res.status(201);
                res.type('application/json');
                res.send(`{"staff_id": ${result.insertId}}`);
            }
        });
    }
});

//Additional Endpoint 2
//PUT /staff_members based on staff_id parameter
app.put('/staff_members/:staff_id', function (req, res) {
    var {first_name, last_name, email, active, username, password, address, address2, district, postal_code}=req.body;
    var staff_id = req.params.staff_id;
    //if both first_name, last_name & username keys do not exist, return res.status(400)
    if (typeof first_name == "undefined" && typeof last_name == "undefined" && typeof username == "undefined") {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "missing data"}`);
        return;
    }
    userDB.updateStaff(first_name, last_name, email, active, username, password, address, address2, district, postal_code, staff_id, function (err, result) {
        if (!err) {
            //if staff_id does not exist, return res.status(204)
            if (result.affectedRows == 0) {
                res.status(204);
                res.type('application/json');
                res.send();
            }
            //if it does exist, return res.status(200)
            else {
                res.status(200);
                res.type('application/json');
                res.send(`{"success_msg": "record updated"}`);
            }
        } else {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg": "Internal server error"}`);
        }
    });
});
module.exports = app;