//Class: DAAA/FT/1B/01
//Admission Number: p2214449
//Name: Tan Wen Tao Bryan
var config = require('../config/config.js');
var jwt = require('jsonwebtoken');

var dbConfig = require('./databaseConfig');
var actor = {
    //Login Page for Admin
    loginStaff: function (email, password, callback) {
        var dbConn = dbConfig.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                var sql = 'select * from staff where email=? and password=?';
                dbConn.query(sql, [email, password], function (err, result) {
                    dbConn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);

                    } else {
                        var token = "";
                        if (result.length == 1) {
                            token = jwt.sign({ id: result[0].staff_id, last_name: result[0].last_name }, config, {
                                expiresIn: 86400//expires in 24 hrs
                            });
                            //delete password after server provides jwt token
                            delete result[0]["password"];
                            return callback(null, token, result)
                        }
                        else {
                            var err2 = new Error("Email or Password does not match.");
                            err2.statusCode = 403;
                            return callback(err2, null, null)
                        }
                    }
                });

            }

        });
    },

    //Home Page (Display Default Search Results)
    getFilms: function (callback) {
        var dbConn = dbConfig.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null);
            }
            else { //no err, connection to db successful
                //prints all films results
                var sql = `select f.film_id, f.title, f.release_year, f.rating from film f`;
                dbConn.query(sql, [], function (err, result) {
                    dbConn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(err, result);
                    }
                });
            }
        });
    },

    //Search for Films By Category
    //Return all categories
    getCategory: function (callback) {
        var dbConn = dbConfig.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null);
            }
            else { //no err, connection to db successful
                //prints all category names in dropdown
                var sql = `select name, category_id from category order by name ASC`;
                dbConn.query(sql, [], function (err, result) {
                    dbConn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        console.log(result)
                        return callback(err, result);
                    }
                });
            }
        });
    },

    //Get search results by category, title, price
    getSearchResults: function (category, title, maxRental, callback) {
        var dbConn = dbConfig.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null);
            }
            else { //no err, connection to db successful
                //joining film_category and film table and film_category and category table
                var sql = `select f.film_id, f.title, f.rating, f.release_year `
                //if all do not contain any inputs, select all films
                if (category == "" && title == "" && maxRental == "") {
                    sql += `from film f`;
                    var params = [];
                }
                //if category contains input, select all films from that category
                else if (category != "" && title == "" && maxRental == "") {
                    sql += `from film f, category c, film_category fc 
                    where fc.film_id=f.film_id and fc.category_id=c.category_id and c.category_id=?`
                    var params = [category];
                }
                //if title contains input, select all films containing that title or substring (case supported)
                else if (category == "" && title != "" && maxRental == "") {
                    sql += `from film f where f.title like ?`
                    var params = ['%' + title + '%'];
                }
                //
                else if (category == "" && title == "" && maxRental != "") {
                    sql += `from film f where rental_rate between 0 and ?`
                    var params = [maxRental];
                }
                else if (category != "" && title != "" && maxRental == "") {
                    sql += `from film f, category c, film_category fc 
                    where fc.film_id=f.film_id and fc.category_id=c.category_id and c.category_id=? and f.title like ?`
                    var params = [category, '%' + title + '%'];
                }
                else if (category != "" && title == "" && maxRental != "") {
                    sql += `from film f, category c, film_category fc 
                    where fc.film_id=f.film_id and fc.category_id=c.category_id and c.category_id=? and rental_rate between 0 and ?`
                    var params = [category, maxRental];
                }
                else if (category == "" && title != "" && maxRental != "") {
                    sql += `from film f where f.title like ? and rental_rate between 0 and ?`
                    var params = ['%' + title + '%', maxRental];
                }
                else {
                    sql += `from film f, category c, film_category fc where fc.film_id=f.film_id 
                    and fc.category_id=c.category_id and c.category_id=? and f.title like ? and rental_rate between 0 and ?`
                    var params = [category, '%' + title + '%', maxRental]
                }
                dbConn.query(sql, params, function (err, result) {
                    dbConn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },

    //Get Details for Details Page
    //Details (title, category, release year, description, rating, actors)
    getDetails: function (film_id, callback) {
        var dbConn = dbConfig.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null);
            }
            else { //no err, connection to db successful
                //joining film_category, film, film_actor, actor and category table
                var sql = `select f.film_id, f.title, f.rating, c.name, f.release_year, f.description, a.first_name, a.last_name from film f, category c, film_category fc, film_actor fa, actor a 
                    where fc.film_id=f.film_id and fc.category_id=c.category_id and fa.film_id=f.film_id and a.actor_id=fa.actor_id and f.film_id=?`
                dbConn.query(sql, [film_id], function (err, result) {
                    dbConn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },

    //Add A New Actor (Admin Only)
    insertActor: function (first_name, last_name, callback) {
        var dbConn = dbConfig.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else { //no err, connection to db successful
                //insert first_name & last_name in actor table
                var sql = "Insert into actor(first_name, last_name) values(?,?)";
                dbConn.query(sql, [first_name, last_name], function (err, result) {
                    dbConn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    else {
                        console.log(result);
                        return callback(null, result);
                    }
                });
            }
        });
    },

    //Dropdown for stores address
    getStores: function (callback) {
        var dbConn = dbConfig.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null);
            }
            else { //no err, connection to db successful
                //prints category name in dropdown
                var sql = `select a.address,s.store_id from address a, store s where a.address_id=s.address_id`;
                dbConn.query(sql, [], function (err, result) {
                    dbConn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        console.log(result)
                        return callback(err, result);
                    }
                });
            }
        });
    },

    //Add A New Customer (Admin Only)
    insertCustomer: function (store_id, first_name, last_name, email, address, district, city_id, postal_code, phone, callback) {
        var dbConn = dbConfig.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else { //no err, connection to db successful
                //insert values for the address table
                var sqlStatement1 = "Insert into address(address, district, city_id, postal_code, phone) values (?,?,?,?,?);"
                dbConn.query(sqlStatement1, [address, district, city_id, postal_code, phone], function (err1, result1) {
                    if (err1) {
                        return callback(err1, null);
                    }
                    else {
                        //result printed for address is the addressID
                        let address_id = result1.insertId;
                        //insert values for customer table
                        var sqlStatement2 = `Insert into customer(store_id,first_name, last_name, email, address_id) values (?,?,?,?,?)`;
                        dbConn.query(sqlStatement2, [store_id, first_name, last_name, email, address_id], function (err2, result2) {
                            if (err2) {
                                //delete the newly inserted address if insertion of a customer fails
                                var sqlStatement3 = `delete from address where address_id = ?`
                                dbConn.query(sqlStatement3, [address_id], function (err3, result3) {
                                    dbConn.end();
                                    if (err3) {
                                        return callback(err3, null);
                                    }
                                    else {
                                        return callback(err2, null);
                                    }
                                });
                            } else {
                                dbConn.end();
                                return callback(null, result2.insertId);
                            }
                        });
                    }
                });
            }
        })
    },

    //Post A Rating
    insertRating: function (first_name, last_name, title, score, comments, callback) {
        var dbConn = dbConfig.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else { //no err, connection to db successful
                //get the customer_id from the customer_table using the first_name and last_name
                var sqlStatement1 = "select customer_id from customer where first_name=? and last_name=?"
                dbConn.query(sqlStatement1, [first_name, last_name], function (err1, result1) {
                    if (err1) {
                        return callback(err1, null);
                    }
                    else {
                        //checks if customer exists in database
                        if (result1.length > 0) {
                            //store customer_id of result1
                            var customer_id = result1[0].customer_id;
                            //get the film_id from the film table using the film_title
                            var sqlStatement2 = `select film_id from film where title = ?`;
                            dbConn.query(sqlStatement2, [title], function (err2, result2) {
                                if (err2) {
                                    return callback(err2, null)
                                }
                                else {
                                    //checks if film exists in database
                                    if (result2.length > 0) {
                                        //store film_id of result2
                                        var film_id = result2[0].film_id;
                                        //check if rating more than or equal to 0 and less than or equal to 5
                                        if (score >= 0 && score <= 5) {
                                            //insert the ratings and reviews into the ratings table using the customer_id and film_id as foreign keys
                                            var sqlStatement3 = `insert into ratings(customer_id, film_id, score, comments) values (?,?,?,?)`
                                            dbConn.query(sqlStatement3, [customer_id, film_id, score, comments], function (err3, result3) {
                                                dbConn.end();
                                                if (err3) {
                                                    return callback(err3, null);
                                                }
                                                else {
                                                    return callback(null, result3);
                                                }
                                            });
                                        }
                                        else {
                                            return callback({ error: "ratings must be between 0 and 5" }, null)
                                        }
                                    }
                                    else {
                                        return callback({error: "film not found"}, null)
                                    }
                                }
                            });
                        }
                        else {
                            return callback({ error: "customer does not exist in database" }, null);
                        }
                    }
                })
            }
        });
    },

    //Get Reviews for Details Page
    getReviews: function (film_id, callback) {
        var dbConn = dbConfig.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null);
            }
            else { //no err, connection to db successful
                //Retrieve information for Details Page
                var sql = `select f.film_id, c.first_name, c.last_name, r.score, r.comments, date_format(r.last_update, "%Y/%m/%d") as last_update from film f, customer c, ratings r 
                    where c.customer_id=r.customer_id and r.film_id=f.film_id and f.film_id=?`
                dbConn.query(sql, [film_id], function (err, result) {
                    dbConn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    }
};
module.exports = actor;