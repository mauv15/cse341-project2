const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Movies API',
        description: 'Movies API Documentation',
    },
    host: 'http://localhost:3001',
    schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./server.js'];

//this will generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);