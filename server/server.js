const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { todoSchema } = require("./schema");
const cors=require('cors');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 5000;

app.use("/graphql", graphqlHTTP({ graphiql: true, schema: todoSchema }));

app.listen(PORT, () => console.log(`Server is runnig on port: ${PORT}`));
