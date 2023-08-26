//Class: DAAA/FT/1B/01
//Admission Number: p2214449
//Name: Tan Wen Tao Bryan


var dbConfig=require('./databaseConfig');
var actor = {

    //Endpoint 1
    //Retrieve actor by their id
    getActor: function (actor_id, callback) {
        var dbConn=dbConfig.getConnection();
        dbConn.connect(function(err){
            if(err){
                console.log(err)
                return callback(err,null);
            }
            else{ //no err, connection to db successful
                //get actor_id, first_name and last_name for actor_id = params 
                var sql="select actor_id, first_name, last_name from actor where actor_id=?";
                dbConn.query(sql,[actor_id],function(err, result){
                    dbConn.end();
                    if (err){
                        console.log(err);
                        return callback(err,null);
                    } else{
                        return callback(err, result);
                    }
                });
            }
        });
    },

    //Endpoint 2
    //Return the list of actors ordered by first_name, limited to 20 records offset 0 by default
    getActorslimit: function (limit, offset, callback) {
        var dbConn=dbConfig.getConnection();
        dbConn.connect(function(err){
            if(err){
                console.log(err)
                return callback(err,null);
            }
            else{ //no err, connection to db successful
                //get information sorted by actor first_name in ascending order limit by query, offset by query
                var sql="select actor_id, first_name, last_name from actor order by first_name ASC limit ? offset ?";
                dbConn.query(sql,[parseInt(limit), parseInt(offset)],function(err, result){
                    dbConn.end();
                    if (err){
                        console.log(err);
                        return callback(err,null);
                    } else{
                        return callback(err, result);
                    }
                });
            }
        });
    },

    //Endpoint 3
    //Insert a new actor
    insertActor: function (first_name, last_name, callback) {
        var dbConn=dbConfig.getConnection();
        dbConn.connect(function(err){
            if(err){
                console.log(err);
                return callback(err,null);
            }
            else{ //no err, connection to db successful
                //insert first_name & last_name in actor table
                var sql="Insert into actor(first_name, last_name) values(?,?)";
                dbConn.query(sql,[first_name, last_name],function(err, result){
                    dbConn.end();
                    if(err){
                        console.log(err);
                        return callback(err,null);
                    }
                    else {
                        console.log(result);
                        return callback(null,result);
                    }
                });
            }
        });
    },

    //Endpoint 4
    //Update actor's first name or last name or both
    updateActor: function (first_name, last_name, actor_id, callback) {
        var dbConn=dbConfig.getConnection();
        dbConn.connect(function(err){
            if(err){
                console.log(err);
                return callback(err,null);
            }
            else{ //no err, connection to db successful
                var sql= "update actor set ";
                //if first_name key do not exist
                if (typeof first_name == "undefined"){
                    //update value of last_name
                    sql+="last_name=? ";
                    var optional=[last_name, parseInt(actor_id)];
                }
                //if last_name key do not exist
                else if (typeof last_name == "undefined"){
                    //update value of first_name
                    sql+="first_name=? ";
                    var optional=[first_name, parseInt(actor_id)];
                }
                else{
                    //or else update values of first_name and last_name
                    sql+="first_name=?, last_name=? ";
                    var optional=[first_name, last_name, parseInt(actor_id)];
                }
                sql+= "where actor_id=?";
                dbConn.query(sql,optional,function(err, result){
                    dbConn.end();
                    if(err){
                        console.log(err);
                        return callback(err,null);
                    }
                    else {
                        console.log(result);
                        return callback(null,result);
                    }
                });
            }
        });
    },

    //Endpoint 5
    //Remove actor from database
    deleteActor: function (actor_id, callback) {
        var dbConn=dbConfig.getConnection();
        dbConn.connect(function(err){
            if(err){
                console.log(err)
                return callback(err,null);
            }
            else{ //no err, connection to db successful
                //delete actor data if actor_id = params
                var sql="delete from actor where actor_id=?";
                dbConn.query(sql,[actor_id],function(err, result){
                    dbConn.end();
                    if (err){
                        console.log(err);
                        return callback(err,null);
                    } else{
                        return callback(err, result);
                    }
                });
            }
        });
    },

    //Endpoint 6
    //Return the film_id, title, rating, release_year and length of all films belonging to a category.
    getFilmsbyCategory: function (category_id, callback) {
        var dbConn=dbConfig.getConnection();
        dbConn.connect(function(err){
            if(err){
                console.log(err)
                return callback(err,null);
            }
            else{ //no err, connection to db successful
                //prints stated data, print category_name key as category and film_length key as duration
                //while joining film_category and film table
                //and film_category and category table
                var sql=`select f.film_id, f.title, c.name as category, f.rating, f.release_year, 
                f.length as duration from film f, category c, film_category fc 
                where fc.film_id=f.film_id and fc.category_id=c.category_id and c.category_id=?`;
                dbConn.query(sql,[category_id],function(err, result){
                    dbConn.end();
                    if (err){
                        console.log(err);
                        return callback(err,null);
                    } else{
                        return callback(err, result);
                    }
                });
            }
        });
    },

    //Endpoint 7
    //Return the payment detail of a customer between the provided period.
    getPaymentDetails: function (customer_id, start_date, end_date, callback) {
        var dbConn=dbConfig.getConnection();
        dbConn.connect(function(err){
            if(err){
                console.log(err)
                return callback(err,null);
            }
            else{ //no err, connection to db successful
                //Payment table joined with rental table via customer_id
                //Rental table joined with inventory table via inventory_id
                //Inventory table joined with film table via film_id
                //formatting date p.payment_date as Year, Month, Day, Hour, Min, Sec &
                //p.payment_date key as payment_date while printing information for payment_date between start_date & end_date
                var sql=`select f.title, p.amount, date_format(p.payment_date, "%Y-%m-%d %H:%i:%s") as payment_date from film f, payment p, rental r, inventory i
                         where p.customer_id=? and p.customer_id=r.customer_id and r.inventory_id=i.inventory_id and i.film_id=f.film_id
                         and p.payment_date between ? and ?`;
                dbConn.query(sql,[parseInt(customer_id), start_date, end_date],function(err, result){
                    dbConn.end();
                    if (err){
                        console.log(err);
                        return callback(err,null);
                    } else{
                        return callback(err, result);
                    }
                });
            }
        });
    }, 
    
    //Endpoint 8
    //Insert a new customer to the database (note: customer’s email address is unique)
    insertCustomer: function (store_id, first_name, last_name, email, address, callback) {
        var dbConn=dbConfig.getConnection();
        dbConn.connect(function(err){
            if(err){
                console.log(err);
                return callback(err,null);
            }
            else{ //no err, connection to db successful
                var {address_line1, address_line2, district, city_id, postal_code, phone}=address;
                //insert values for address table nested object
                var sqlStatement1=`Insert into address(address, address2, district, city_id, postal_code, phone)
                values(?, ?, ?, ?, ?, ?)`;
                dbConn.query(sqlStatement1,[address_line1, address_line2, district, city_id, postal_code, phone],function(err1, result1){
                    if(err1){
                        return callback(err1,null);
                    }
                    else {
                        //result printed for address is the addressID
                        var addressID = result1.insertId;
                        //insert values for customer table
                        var sqlStatement2 = `Insert into customer(store_id, first_name, last_name, email, address_id) values (?,?,?,?,?)`
                        dbConn.query(sqlStatement2, [store_id, first_name, last_name, email, addressID],function(err2,result2){
                            dbConn.end();
                            if(err2){
                                return callback(err2,null);
                            }
                            else{
                                return callback(null, result2);
                            }
                        })
                    }
                });
            }
        });
    },

    //Additional Endpoint #1
    insertStaff: function (store_id, first_name, last_name, email, username, password, active, address, callback) {
        var dbConn=dbConfig.getConnection();
        dbConn.connect(function(err){
            if(err){
                console.log(err);
                return callback(err,null);
            }
            else{ //no err, connection to db successful
                var {address_line1, address_line2, district, city_id, postal_code, phone}=address;
                //insert values for address table nested object
                var sqlStatement1=`Insert into address(address, address2, district, city_id, postal_code, phone)
                values(?, ?, ?, ?, ?, ?)`;
                dbConn.query(sqlStatement1,[address_line1, address_line2, district, city_id, postal_code, phone],function(err1, result1){
                    if(err1){
                        return callback(err1,null);
                    }
                    else {
                        //result printed for address is the addressID
                        var addressID = result1.insertId;
                        //insert values for staff table
                        var sqlStatement2 = `Insert into staff(store_id, first_name, last_name, email, username, password, active, address_id) values (?,?,?,?,?,?,?,?)`
                        dbConn.query(sqlStatement2, [store_id, first_name, last_name, email, username, password, active, addressID],function(err2,result2){
                            dbConn.end();
                            if(err2){
                                return callback(err2,null);
                            }
                            else{
                                return callback(null, result2);
                            }
                        })
                    }
                });
            }
        });
    },

    //Additional Endpoint #2
    updateStaff: function (first_name, last_name, email, active, username, password, address, address2, district, postal_code, staff_id, callback) {
        var dbConn=dbConfig.getConnection();
        dbConn.connect(function(err){
            if(err){
                return callback(err,null);
            }
            else{ //no err, connection to db successful
                //update two tables at once
                var sql=`update staff as s, address as a set `;
                //if first_name key does not exist
                if(typeof first_name == "undefined"){
                    sql+=`s.last_name=?, s.email=?, s.active=?, s.username=?, s.password=?,
                        a.address=?, a.address2=?, a.district=?, a.postal_code=? `
                    var optional= [last_name, email, active, username, password, address, address2, district, postal_code, parseInt(staff_id)];
                }
                //if last_name key does not exist
                else if(typeof last_name == "undefined"){
                    sql+=`s.first_name=?, s.email=?, s.active=?, s.username=?, s.password=?,
                        a.address=?, a.address2=?, a.district=?, a.postal_code=? `
                    var optional= [first_name, email, active, username, password, address, address2, district, postal_code, parseInt(staff_id)];
                }
                //otherwise it will update all these keys
                else{
                    sql+=`s.first_name=?, s.last_name=?, s.email=?, s.active=?, s.username=?, s.password=?,
                    a.address=?, a.address2=?, a.district=?, a.postal_code=? `
                    var optional= [first_name, last_name, email, active, username, password, address, address2, district, postal_code, parseInt(staff_id)];
                }
                //join staff and address through address_id when staff_id=the given value
                sql+=`where s.address_id=a.address_id AND s.staff_id=?;`
                dbConn.query(sql,optional,function(err, result){
                    dbConn.end();
                    if (err){
                        return callback(err,null);
                    } else{
                        return callback(err, result);
                    }
                });
            }
        });
    },

}
module.exports=actor;