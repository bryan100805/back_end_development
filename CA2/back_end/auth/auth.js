//Class: DAAA/FT/1B/01
//Admission Number: p2214449
//Name: Tan Wen Tao Bryan

var jwt=require('jsonwebtoken');

var config=require('../config/config.js');

function verifyToken(req,res,next){

    var token=req.headers['authorization']; //retrieve authorization header’s content

    if(!token || !token.includes('Bearer')){ //process the token

        res.status(403);
        return res.send(JSON.stringify({auth:'false',message:'Not authorized!'}));
    }else{
        token=token.split('Bearer ')[1]; //obtain the token’s value
        jwt.verify(token,config,function(err,decoded){//verify token
            if (err){
                res.status(403);
                return res.end(JSON.stringify({auth:'false',message:'Not authorized!'}));
            }else{
                req.id=decoded.id; //decode the staffid and store in req for use
                req.last_name=decoded.last_name; //decode the lastname and store in req for use
                next();
            }

        });
    }

}

module.exports=verifyToken;
