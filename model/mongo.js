var mongoose    =   require("mongoose");
mongoose.connect('mongodb://localhost:27017/demoDb');
var mongoSchema =   mongoose.Schema;
var userSchema  = new mongoose.Schema ({
    BSSID : { type : String, required : true, unique : true},
    xco : { type: Number, min:0 , required: true},
    yco : { type: Number, min:0 , required: true},
});
module.exports = mongoose.model('userLogin',userSchema);;
