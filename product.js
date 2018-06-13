var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ProductSchema   = new Schema({
    title: String,
    price: Number,
    id : String,
    author : String,
});
module.exports = mongoose.model('Product', ProductSchema);
// module.exports = mongoose.model('Product', ProductSchema,'optiponally pass schema name ');

