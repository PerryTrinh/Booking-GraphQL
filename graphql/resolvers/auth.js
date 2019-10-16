const bcrypt = require('bcryptjs');

const User = require('../../models/user');

module.exports = {
    createUser: async args => {
        // Check if user is already in database
        const userExists = await User.findOne({ email: args.userInput.email })
            .catch(error => {
                console.log(`Error fetching user by email: ${error}`);
                throw error;
            });

        if (userExists) {
            throw new Error(`User with email ${args.userInput.email} already exists in database`);
        }
        const hashedPass = await bcrypt.hash(args.userInput.password, 12)
            .catch(error => {
                console.log(`Error hashing password: ${error}`);
                throw error;
            });

        const user = new User({
            email: args.userInput.email,
            password: hashedPass
        });

        const result = await user.save().catch(error => {
            console.log(`Unable to create user: ${error}`);
            throw error;
        });

        return { 
            ...result._doc, 
            _id: result.id, 
            password: null 
        };
    }
};