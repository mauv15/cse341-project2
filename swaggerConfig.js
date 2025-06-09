// swaggerConfig.js
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const options = {
  swaggerOptions: {
    withCredentials: true 
  }
};

module.exports = [swaggerUi.serve, swaggerUi.setup(swaggerDocument, options)];
