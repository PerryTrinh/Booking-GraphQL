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

mongoose
    .connect(`mongodb+srv://${process.env.MONGO_USER}:${
        process.env.MONGO_PASSWORD
    }@graphql-learning-cluster-borad.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    ).then(() => {
        app.listen(PORT);
    }).catch(err => {
        console.log(err);
    });