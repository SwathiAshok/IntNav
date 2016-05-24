var mongoose    =   require("mongoose");
var mongoSchema =   mongoose.Schema;
var userSchema  = {
    "BSSID" : String,
    "xco" : Number,
    "yco" : Number,
    "zco" : Number
};
module.exports = mongoose.model('userLogin',userSchema);
