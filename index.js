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

mongoose.connect('mongodb://localhost:27017/bookings-db')
    .then(() => {
        console.log(`Connected to MongoDB`);
        app.listen(PORT);
    }).catch(error => {
        console.log(`Could not connect to MongoDB: ${error}`);
    });

// Uncomment this if using a cloud DB (like MongoDB Atlas)
// mongoose.connect(`${process.env.MONGO_URL}`)
//     .then(() => {
//         app.listen(PORT);
//     }).catch(err => {
//         console.log(err);
//     });