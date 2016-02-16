var express = require("express");
var math = require("mathjs");
var app = express();
var bodyParser = require("body-parser");
var router = express.Router();
var mongoOp = require("./models/mongo");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

router.get("/",function(req,res){
    res.json("IN Backend");
});

router.route("/AP")
    .get(function(req,res){
        var response = {};
        mongoOp.find({},function(err,data){
            if(err) {
                response = "Error fetching data";
            } else {
                response = data;
            }
            res.json(response);
        });
    })
    .post(function(req,res){
        var db = new mongoOp();
        var response = {};
        db.BSSID = req.body.BSSID;
        db.xco = req.body.xco;
        db.yco = req.body.yco;
        db.zco = req.body.zco;
        
        db.save(function(err){
            if(err) {
                response = "Error adding data";
            } else {
                response = "Data added";
            }
            res.json(response);
        });
    });

router.route("/AP/:BSSID")
    .get(function(req,res){
        var response = {};
        mongoOp.findOne({ BSSID : req.params.BSSID },function(err,data){
            if(err) {
                response = "Error fetching data";
            } else {
                response = data;
            }
            res.json(response);
        });
    })

router.route("/AP/:id")
    .put(function(req,res){
        var response = {};
        mongoOp.findById(req.params.id,function(err,data){
            if(err) {
                response = "Error fetching data";
            } else {
                if(req.body.BSSID !== undefined) {
                    data.BSSID = req.body.BSSID;
                }
                if(req.body.xco !== undefined) {
                    data.xco = req.body.xco;
                }
                if(req.body.yco !== undefined) {
                    data.yco = req.body.yco;
                }
                 if(req.body.zco !== undefined) {
                    data.zco = req.body.yco;
                }
                data.save(function(err){
                    if(err) {
                        response = "Error updating data";
                    } else {
                        response = {"error" : false,"message" : "Data is updated for "+req.params.id};
                    }
                    res.json(response);
                })
            }
        });
    })
   .delete(function(req,res){
        var response = {};
        mongoOp.findById(req.params.id,function(err,data){
            if(err) {
                response = "Error fetching data";
            } else {
                mongoOp.remove({_id : req.params.id},function(err){
                    if(err) {
                        response = "Error deleting data";
                    } else {
                        response = {"error" : false,"message" : "Data associated with "+req.params.id+"is deleted"};
                    }
                    res.json(response);
                });
            }
        });
    })

router.route("/CAL")
    .post(function(req,res){
        var ip = new mongoOp();
        var response = {};
       
        ip.x = req.body.x;
        ip.y = req.body.y;
        ip.d = req.body.d;

        Number x

    })

app.use('/',router);

app.listen(3000);
console.log("Listening to PORT 3000");
