const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql").graphqlHTTP;
const { buildSchema } = require("graphql");

const app = express();

const products = [
  {
    id: 1,
    name: "Nike Renew Run Running Shoes",
    price: 200.50
  },
  {
    id: 2,
    name: "AIR ZOOM PEGASUS 36 SHIELD Walking Shoes",
    price: 340.50
  },
  {
    id: 3,
    name: "Nike Runallday Running Shoes",
    price: 700.50
  }
];

app.use(bodyParser.json());

var schema = buildSchema(`
  type Product {
    id: ID!
    name: String!
    price: Float!
  }

  input ProductInput {
    name: String!
    price: Float!
  }

  type RootMutation {
    addProduct(productInput: ProductInput): Product
  }

  type RootQuery {
    products: [Product!]!
  }

  schema {
    query: RootQuery,
    mutation: RootMutation
  }
`);

var root = {
  products: () => {
    return products;
  },
  addProduct: (args) => {
    const product = {
      id: Math.floor(Math.random() * 100).toString(),
      name: args.productInput.name,
      price: +args.productInput.price
    }
    products.push(product);
    return product;
  },
};

app.use(
  "/graphql",
  graphqlHttp({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(4201);
