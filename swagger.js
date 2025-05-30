const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        title: "Item API",
        description: "API for managing items in a MongoDB database",
    },
    host: "localhost:3000",
    schemes: ['https', 'http'],
};

const outputFile = "./swagger.json"; 
const endpointsFiles = ["./routes/index.js",];

swaggerAutogen(outputFile, endpointsFiles, doc);