const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User Schema
let UserSchema = mongoose.Schema({
    account: String,
    type: {
        type: String,
        required: true,
        default: "student"
    },
    remote_id: Number,
    profile: {
        type: Object
    },
    urlImage: String
});

UserSchema.statics.createUser = function (data, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) console.log(err);

        bcrypt.hash(data.password, salt, (err, hash) => {
            if (err) console.log(err);
            let newUser = new this();
            newUser.account = "local";
            newUser.profile = {
                password: hash,
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email
            };
            if (data.type != null) {
                newUser.type = data.type;
            }
            newUser.urlImage = "/images/iconLocal.png";
            newUser.save(callback);
        });
    });
};

UserSchema.statics.getUserByEmail = function (email, callback) {
    User.findOne({ "profile.email": email, account: "local" }, callback);
};

UserSchema.statics.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
};
var User = mongoose.model("User", UserSchema);

module.exports = User;