const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');

module.exports = {
    events: async () => {
        const events = await Event.find().catch(error => {
            console.log(`Could not fetch MongoDB Events: ${error}`);
            throw error;
        });
        
        return events.map(event => {
            return transformEvent(event);
        });
    },
    createEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized request to create event');
        }

        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
        });
        let createdEvent;

        const result = await event.save().catch(error => {
            console.log(`Could not save into MongoDB: ${error}`);
            throw error;
        });

        createdEvent = transformEvent(result);

        const creator = await User.findById(req.userId).catch(error => {
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
    }
};