const express = require("express");
const graphqlHttp = require("express-graphql").graphqlHTTP;
const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLFloat,
  GraphQLString,
  GraphQLSchema,
} = graphql;

const app = express();

// Dummy Products
const products = [
  {
    id: 1,
    name: "Nike Renew Run Running Shoes",
    price: 1200.5,
    categoryId: 2, // Product belongs to category(ID)
  },
  {
    id: 2,
    name: "Graphic Print Men Round Neck Brown T-Shirt",
    price: 640.5,
    categoryId: 1,
  },
  {
    id: 3,
    name: "Nike Runallday Running Shoes",
    price: 900.5,
    categoryId: 2,
  },
  {
    id: 4,
    name: "Skinny Men Blue Jeans",
    price: 700.5,
    categoryId: 1,
  },
];

// Dummy Categories
const categories = [
  {
    id: 1,
    name: "Cloth",
  },
  {
    id: 2,
    name: "Footwear",
  },
];

ProductType = new GraphQLObjectType({
  // Schema for product
  name: "Product",
  fields: () => ({
    id: { type: GraphQLID }, // Type of variable
    name: { type: GraphQLString },
    price: { type: GraphQLFloat },
  }),
});

CategoryType = new GraphQLObjectType({    // Schema for category
  name: "Category",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    products: {                           
      type: new GraphQLList(ProductType),  // Return list of product for parent category id
      // Child Resolver function get parent category values in 'parent' variable
      resolve: (parent, args, context) => {
        return products.filter(product =>  product.categoryId === parent.id );
      },
    }
  })
});

const Mutations = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addProduct: {                         // Add product mutation
      type: ProductType,                  // Type define response schema type 
      args: {                             // args contains no of inputs to resolver function
        name: { type: GraphQLString },    // input variable with data type
        price: { type: GraphQLFloat }
      },
      resolve: (parent, args, context) => {   // Rsolver function for addProduct mutation
        const product = {
          id: Math.floor(Math.random() * 100).toString(),
          name: args.name,                     // Get input parameter in `args`
          price: +args.price
        }
        products.push(product);             // Add new product in products
        return product;                     // Return newly contracted product
      },
    }
  }
});

const Queries = new GraphQLObjectType({
  name: "QueriesType", // GraphQL object name
  fields: {
    products: {
      type: new GraphQLList(ProductType), // products - return list of product
      resolve: () => {
        return products;
      },
    },
    categories: {
      type: new GraphQLList(CategoryType), // products - return list of category
      resolve: () => {
        return categories;
      },
    },
  },
});

app.use(
  "/graphql",
  graphqlHttp({
    schema: new GraphQLSchema({
      query: Queries, // All queries
      mutation: Mutations // All mutations
    }),
    graphiql: true, // true - use the GraphiQL tool
  })
);

app.listen(4201); // PORT Number
