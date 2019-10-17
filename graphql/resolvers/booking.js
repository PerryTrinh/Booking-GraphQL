const Event = require("../../models/event");
const Booking = require("../../models/booking");
const { transformBooking, transformEvent } = require("./merge");

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthorized request to create event");
    }

    const bookings = await Booking.find().catch(error => {
      console.log(`Cannot fetch bookings: ${error}`);
      throw error;
    });
    return bookings.map(booking => {
      return transformBooking(booking);
    });
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthorized request to create event");
    }

    const eventId = await Event.findOne({ _id: args.eventId }).catch(error => {
      console.log(`Error extracting eventId: ${error}`);
      throw error;
    });

    const booking = new Booking({
      user: req.userId,
      event: eventId
    });

    const result = await booking.save().catch(error => {
      console.log(`Error saving booking event: ${error}`);
      throw error;
    });

    return transformBooking(result);
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthorized request to create event");
    }

    const booking = await Booking.findById(args.bookingId)
      .populate("event")
      .catch(error => {
        console.log(`Error fetching booking with given ID: ${error}`);
        throw error;
      });

    const eventToReturn = transformEvent(booking._doc.event);

    await Booking.deleteOne({ _id: args.bookingId }).catch(error => {
      console.log(`Error deleting booking with given ID: ${error}`);
      throw error;
    });
    return eventToReturn;
  }
};
