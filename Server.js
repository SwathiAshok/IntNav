var express = require("express");
var math = require("mathjs");
var app = express();
var bodyParser = require("body-parser");
var router = express.Router();

var mongoose    =   require("mongoose");
mongoose.connect('mongodb://localhost:27017/demoDb');

//DB for APs
var mongoOp = require("./models/mongo");

//DB for Meeting Rooms
var mongoLoc = require("./models/mongo1");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

router.get("/",function(req,res){
    res.json("IN Backend");
});

//AP GET PUT POST DELETE
router.route("/AP")
    .get(function(req,res){
        var response = {};
        mongoOp.find({},function(err,data){
            if(err) {
                response = {"error" : true , "message" : "Error fetching data"};
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
                response = {"error" : true , "message" : "Error adding data"};
            } else {
                response = {"error" : false, "message" : "Data added"};
            }
            res.json(response);
        });
    });

router.route("/AP/:BSSID")
    .get(function(req,res){
        var response = {};
        mongoOp.findOne({ BSSID : req.params.BSSID },function(err,data){
            if(err || data == null) {
                response = {"error" : "Error fetching data"};
            } else {
                try{
                    response = {"xco" : data.xco, "yco" : data.yco};
                }catch(e){
                    response = {"error" : "Error fetching data"};
                }
            }
            res.json(response);
            console.log(req.params.BSSID);
        });
    })

router.route("/AP/:id")
    .put(function(req,res){
        var response = {};
        mongoOp.findById(req.params.id,function(err,data){
            if(err) {
                response = {"error" : "Error fetching data"};
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
                    data.zco = req.body.zco;
                }
                data.save(function(err){
                    if(err) {
                        response = {"error" : "Error fetching data"};
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
                response = {"error" : "Error fetching data"};
            } else {
                mongoOp.remove({_id : req.params.id},function(err){
                    if(err) {
                        response = {"error" : "Error fetching data"};
                    } else {
                        response = {"error" : false,"message" : "Data associated with "+req.params.id+"is deleted"};
                    }
                    res.json(response);
                });
            }
        });
    })

//Triangulation???
router.route("/CAL")
    .post(function(req,res){
    
        var d1 = req.body.d[0];
        var d2 = req.body.d[1];
        var d3 = req.body.d[2];
       
        var x1 = req.body.x[0];
        var x2 = req.body.x[1];
        var x3 = req.body.x[2];
        
        var y1 = req.body.y[0];
        var y2 = req.body.y[1];
        var y3 = req.body.y[2];

        console.log([d1,d2,d3,x1,x2,x3,y1,y2,y3]);

        // var A=2*(x2-x1);
        // var B=2*(y2-y1);
        // var D=2*(x3-x2);
        // var E=2*(y3-y2);
        // var C = math.pow(d1,2) - math.pow(d2,2) - math.pow(x1,2) - math.pow(x2,2) - math.pow(y1,2) - math.pow(y2,2);
        // var F = math.pow(d2,2) - math.pow(d3,2) - math.pow(x2,2) - math.pow(x3,2) - math.pow(y2,2) - math.pow(y3,2);

        // console.log([A,B,C,D,E,F]);

        // var x=math.abs(((C*D)-(F*A))/((B*D)-(E*A)));
        // var y=math.abs(((A*E)-(D*B))/((C*E)-(F*B)));

        // var y=((u-v)*(x3-x2))/((y1-y2)*(x3-x2)-(y3-y2)*(x1-x2));
        // var x=u-(y*(y3-y2)/(x3-x2));
        
        var u= (math.pow(d2,2)-math.pow(d3,2)-math.pow(x2,2)+math.pow(x3,2)-math.pow(y2,2)+math.pow(y3,2))/2;
        var v= (math.pow(d2,2)-math.pow(d1,2)-math.pow(x2,2)+math.pow(x1,2)-math.pow(y2,2)+math.pow(y1,2))/2;


        var y = (((v * (x3-x2) - u * (x1-x2)) / (((y1 - y2)*(x3 - x2))-((y3 - y2)*(x1 - x2)))));
        var x = (u - y * (y3 - y2) ) / (x3 - x2);

        console.log(u,v);

        // var x = (math.pow(d2,2)-math.pow(d1,2)+math.pow(x1,2)-math.pow(x2,2))/(2*(x1-x2));
        // var y = math.sqrt(math.abs(math.pow(d1,2)-math.pow(x1,2)+math.pow(x,2)-2*x*x1+y1));
        
        console.log({"xi":x,"yi":y});

        res.json({"xi":x,"yi":y});
        
    })

//Meeting Rooms GET PUT POST DELETE
router.route("/LOC")
    .get(function(req,res){
        var response = {};
        mongoLoc.find({},function(err,data){
            if(err) {
                response = {"error" : true , "message" : "Error fetching data"};
            } else {
                response = data;
            }
            res.json(response);
        });
    })
    .post(function(req,res){
        var db = new mongoLoc();
        var response = {};
        db.Room = req.body.Room;
        db.xco = req.body.xco;
        db.yco = req.body.yco;
        db.zco = req.body.zco;
        
        db.save(function(err){
            if(err) {
                response = {"error" : true , "message" : "Error adding data"};
            } else {
                response = {"error" : false, "message" : "Data added"};
            }
            res.json(response);
        });
    });

router.route("/LOC/:Room")
    .get(function(req,res){
        var response = {};
        mongoLoc.findOne({ Room : req.params.Room },function(err,data){
            if(err || data == null) {
                response = {"error" : "Error fetching data"};
            } else {
                try{
                    response = {"xco" : data.xco, "yco" : data.yco};
                }catch(e){
                    response = {"error" : "Error fetching data"};
                }
            }
            res.json(response);
            console.log(req.params.Room);
        });
    })

router.route("/LOC/:id")
    .put(function(req,res){
        var response = {};
        mongoLoc.findById(req.params.id,function(err,data){
            if(err) {
                response = {"error" : "Error fetching data"};
            } else {
                if(req.body.Room !== undefined) {
                    data.Room = req.body.Room;
                }
                if(req.body.xco !== undefined) {
                    data.xco = req.body.xco;
                }
                if(req.body.yco !== undefined) {
                    data.yco = req.body.yco;
                }
                 if(req.body.zco !== undefined) {
                    data.zco = req.body.zco;
                }
                data.save(function(err){
                    if(err) {
                        response = {"error" : "Error fetching data"};
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
        mongoLoc.findById(req.params.id,function(err,data){
            if(err) {
                response = {"error" : "Error fetching data"};
            } else {
                mongoLoc.remove({_id : req.params.id},function(err){
                    if(err) {
                        response = {"error" : "Error fetching data"};
                    } else {
                        response = {"error" : false,"message" : "Data associated with "+req.params.id+"is deleted"};
                    }
                    res.json(response);
                });
            }
        });
    })

app.use('/',router);

app.listen(3000);
console.log("Listening to PORT 3000");
