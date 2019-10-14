const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');

const user = async userId => {
    const user = await User.findById(userId)
        .catch(error => {
            throw error;
        });

    return { 
        ...user._doc, 
        _id: user.id,
        createdEvents: events.bind(this, user._doc.createdEvents)
    };
};

const events = async eventIds => {
    const events = await Event.find({_id: {$in: eventIds}})
        .catch(error => {
            throw error;
        });

    events.map(event => {
        return { 
            ...event._doc, 
            _id: event.id, 
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, event.creator)
        }
    });
    return events;
};

module.exports = {
    events: async () => {
        const events = await Event.find().catch(error => {
            console.log(`Could not fetch MongoDB Events: ${err}`);
            throw error;
        });
        
        return events.map(event => {
            return { 
                ...event._doc, 
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event._doc.creator)
            };
        });
    },
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5da4be6d79e41c35a4a5108f'
        });
        let createdEvent;

        const result = await event.save().catch(error => {
            console.log(`Could not save into MongoDB: ${error}`);
            throw error;
        });

        createdEvent = { 
            ...result._doc, 
            _id: result.id, 
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, result._doc.creator)
        };

        const creator = await User.findById('5da4be6d79e41c35a4a5108f').catch(error => {
            console.log(`Error searching for user with given ID`);
            throw error;
        });

        if (!creator) {
            throw new Error('No user found to associate event with');
        }
        creator.createdEvents.push(event);
        
        await creator.save().catch(error => {
            console.log(`Could not update createdEvents of user for event ${createdEvent._id}`);
            throw error;
        });

        console.log(`Event successfully saved into MongoDB`);
        return createdEvent;
    },
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