const Event = require("../../models/event");
const User = require("../../models/user");

const dateToString = date => new Date(date).toISOString();

const user = async userId => {
  const user = await User.findById(userId).catch(error => {
    throw error;
  });

  return {
    ...user._doc,
    _id: user.id,
    password: null,
    createdEvents: events.bind(this, user._doc.createdEvents)
  };
};

const events = async eventIds => {
  const events = await Event.find({ _id: { $in: eventIds } }).catch(error => {
    throw error;
  });

  return events.map(event => {
    return transformEvent(event);
  });
};

const singleEvent = async eventId => {
  const event = await Event.findById(eventId).catch(error => {
    console.log(`Error finding event with given ID: ${error}`);
    throw error;
  });

  return transformEvent(event);
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

exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;
