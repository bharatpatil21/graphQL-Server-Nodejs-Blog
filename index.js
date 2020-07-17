const express = require("express");
const graphqlHttp = require("express-graphql").graphqlHTTP;
const { buildSchema } = require("graphql");

const app = express();

// Dummy Products
const products = [
  {
    id: 1,
    name: "Nike Renew Run Running Shoes",
    price: 1200.50,
    categoryId: 2                     // Product belongs to category(ID)
  },
  {
    id: 2,
    name: "Graphic Print Men Round Neck Brown T-Shirt",
    price: 640.50,
    categoryId: 1
  },
  {
    id: 3,
    name: "Nike Runallday Running Shoes",
    price: 900.50,
    categoryId: 2
  },
  {
    id: 4,
    name: "Skinny Men Blue Jeans",
    price: 700.50,
    categoryId: 1
  }
];



// Dummy Categories
const categories = [
  {
    id: 1,
    name: "Cloth"
  },
  {
    id: 2,
    name: "Footwear"
  }
]

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  ## START: Product - define product schema
  type Product {
    id: ID!
    name: String!
    price: Float!
  }
  ## END: Product

  ## START: Category - define category schema
  type Category {
    id: ID!
    name: String!
    products: [Product!]!
  }
  ## END: Category

  type Queries { 
    ## products - query return array of product                       
    products: [Product!]!
    ## categories - query return array of category with its products                       
    categories: [Category!]!
  }

  ## Add ProductInput schema
  ## START: ProductInput - define ProductInput schema
  input ProductInput {
    name: String!
    price: Float!
  }
  ## END: ProductInput

  ## Add Mutations schema
  type Mutations {
    addProduct(productInput: ProductInput): Product
  }

  ## Add mutation in below schema
  schema {
    query: Queries
    mutation: Mutations
  }
`);

// Return products with category id
const productsByCategory = (id) => {
  return products.filter(product =>  product.categoryId === id );
}

// The root provides a resolver function for each API endpoint
var root = {
  products: () => {           // products -- resolver function return list of products
    return products;
  },
  categories: () => {         // categories -- resolver function return list of category with products
    categories.map(category => {
      category['products'] = productsByCategory(category.id);
    })
    return categories;
  },
  addProduct: (args) => {     // addProduct -- resolver function return new product object
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
    schema: schema,     // query + mutation
    rootValue: root,    // Resolver function for each API endpoint
    graphiql: true,     // true - use the GraphiQL tool
  })
);

app.listen(4201); // PORT Number
