const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const graphQLSchema = require("./graphql/schema/index");
const graphQLResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");

const app = express();
const PORT = 8000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(isAuth); //Adds metadata on whether request is authorized

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true
  })
);

// Change 'mongoose.connect' line to one of the following if you are not using docker:
//      CloudDB: mongoose.connect(`${process.env.MONGO_URL}`, {useNewUrlParser: true})
//      Local: mongoose.connect('http://localhost:27017/bookings-db', {useNewUrlParser: true})
//      Docker: mongoose.connect('mongodb://mongo:27017/bookings-db', {useNewUrlParser: true})

mongoose
  .connect(`${process.env.MONGO_URL}`, { useNewUrlParser: true })
  .then(() => {
    console.log(`Connected to MongoDB`);
    app.listen(PORT);
  })
  .catch(error => {
    console.log(`Could not connect to MongoDB: ${error}`);
  });
