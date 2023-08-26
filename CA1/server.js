//Class: DAAA/FT/1B/01
//Admission Number: p2214449
//Name: Tan Wen Tao Bryan


var app=require('./controller/app')

var port = 8081;//use another port 8081 for this exercise
var hostname = "localhost";

//---------------------------------------------------------

app.listen(port,hostname, function(){
    console.log(`Server hosted at http://${hostname}:${port}`);
});