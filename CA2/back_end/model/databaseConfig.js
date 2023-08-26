//Class: DAAA/FT/1B/01
//Admission Number: p2214449
//Name: Tan Wen Tao Bryan


var mysql = require('mysql');
var dbconnect = {
    getConnection: function () {
        var conn = mysql.createConnection({
            host: "localhost",
            user: "bed_dvd_root",
            password: "pa$$woRD123",
            database: "bed_dvd_db",
        });     
        return conn;
    }
};
module.exports = dbconnect;