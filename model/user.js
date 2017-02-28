// load the things we need
import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

// define the schema for our user model
let userSchema = mongoose.Schema({

    local            : {
		 username: 	String,
		 password: 	String,
		 email: 		String,
		 firstname: String,
		 lastname:	String
    }

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
