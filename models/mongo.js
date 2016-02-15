var mongoose    =   require("mongoose");
mongoose.connect('mongodb://localhost:27017/demoDb');
var mongoSchema =   mongoose.Schema;
var userSchema  = {
    "BSSID" : String,
    "xco" : String,
    "yco" : String
};
module.exports = mongoose.model('userLogin',userSchema);;
