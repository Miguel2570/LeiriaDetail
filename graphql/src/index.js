import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = {
  hello: () => "GraphQL LeiriaDetail OK 🚀"
};

const app = express();

app.use("/graphql", graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}));

app.listen(3001, () => {
  console.log("GraphQL running on http://localhost:3001/graphql");
});