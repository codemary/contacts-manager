const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,   // validation
        maxlength: 20,  // validation
        trim: true      // sanitisation
    },
    password: {
        type: String,
        required: true
    }
})


module.exports = {
    UserSchema: UserSchema,
    User: mongoose.model('User', UserSchema)
}