const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQLSchema = require('./graphql/schema/index');
const graphQLResolvers = require('./graphql/resolvers/index');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true
}));

// Change 'mongoose.connect' line to one of the following if you are not using docker:
//      CloudDB: mongoose.connect(`${process.env.MONGO_URL}`, {useNewUrlParser: true})
//      Local: mongoose.connect('http://localhost:27017/bookings-db', {useNewUrlParser: true})
//      Docker: mongoose.connect('mongodb://mongo:27017/bookings-db', {useNewUrlParser: true})

mongoose.connect('mongodb://mongo:27017/bookings-db', {useNewUrlParser: true})
    .then(() => {
        console.log(`Connected to MongoDB`);
        app.listen(PORT);
    }).catch(error => {
        console.log(`Could not connect to MongoDB: ${error}`);
    });