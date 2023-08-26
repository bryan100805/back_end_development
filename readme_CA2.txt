WELCOME TO DVD DATABASE!!
Unzip node_modules file first

TO RUN THE DATABASE:
1) GO TO sql_databases FOLDER --> RUN bed_dvd_db_updated.sql IN SQL WORKBENCH FOR UPDATED DATABASE
2) CODES ARE IN CA2 folder
3) In databaseConfig.js: (Paste this code if it does not exist)

```
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
```
4) Run nodemon server.js in both front_end and back_end folder and you are able to view DVD Website!

WEBSITE NAVIGATION:
Start in Admin Login Page: (login.html)
- Login to be directed to Add a New Actor Page
- Can go to Home or Reviews Page

Add A New Actor Page: (newactor.html)
- Can go to Add A New Customer, Home or Reviews Page
- Logout to go back to Admin Login Page

Add A New Customer Page: (newcustomer.html)
- Can go to Add A New Actor, Home or Reviews Page
- Logout to go back to Admin Login Page

Home Page: (dvd.html)
- Can go to Reviews Page, Admin Login Page
- Search Results (Search for Films)
- If click on For More Info, can go to Details Page

Details Page: (details.html)
- Can go back to Home Page, Reviews Page and Admin Login Page

Reviews Page: (ratings.html)
- Can go to Home Page, Reviews Page and Admin Login Page
