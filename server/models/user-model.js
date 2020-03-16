const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const usersSchema = new Schema({
    // document structure & rules
    Name: { type: String },
    Fonction: { type: String },
    Mail: { type: String },

}, {
        // additional settings for Schema constructor function (class)
        timestamps: true,
    });


const Users = mongoose.model("Users", usersSchema);


module.exports = Users;