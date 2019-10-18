const DataLoader = require('dataloader');

const Event = require("../../models/event");
const User = require("../../models/user");

const dateToString = date => new Date(date).toISOString();

const eventLoader = new DataLoader((eventIds) => {
  return events(eventIds);
});

const userLoader = new DataLoader(userIds => {
  return User.find({_id: {$in: userIds}});
});

const events = async eventIds => {
  const events = await Event.find({ _id: { $in: eventIds } }).catch(error => {
    console.log(`Error fetching event data from database: ${error}`);
    throw error;
  });

  return events.map(event => {
    return transformEvent(event);
  });

};

const singleEvent = async eventId => {
  const event = await eventLoader.load(eventId.toString()).catch(error => {
    console.log(`Error fetching event data from database: ${error}`);
    throw error;
  });

  return event;
};

const user = async userId => {
  const user = await userLoader.load(userId.toString()).catch(error => {
    console.log(`Error fetching user data from database: ${error}`);
    throw error;
  });
  
  return {
    ...user._doc,
    _id: user.id,
    createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
  };
};

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator)
  };
};

const transformBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;