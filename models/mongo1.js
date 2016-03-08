var mongoose    =   require("mongoose");
var mongoSchema =   mongoose.Schema;
var user  = {
    "Room" : String,
    "xco" : Number,
    "yco" : Number,
    "zco" : Number
};
module.exports = mongoose.model('user',user);;
