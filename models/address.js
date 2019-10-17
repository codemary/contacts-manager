const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
    contact: { type: Schema.Types.ObjectId, ref: 'Contact'},
    street :{
        name:  String,
        num: Number,
    },
    city: String,
    state: String,
    country: String,
    post_code: String
})

module.exports = mongoose.model('Address', AddressSchema);