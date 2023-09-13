const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");
const version = require("../package.json")

const options = {
    swaggerDefinition: {
        info: {
            title: 'basic-server',
            version: version.version,
            description: 'CT Course API Server.',
        },
        host: `${process.env.HOST_NAME}:${process.env.HOST_PORT}`,
        basePath: '/',
        securityDefinitions: {
            bearerAuth: {
                type: 'apiKey',
                name: 'Authorization',
                scheme: 'bearer',
                in: 'header',
            },
        },
    },
    apis: ["routes/*.js"]
};

const swaggerDocs = swaggerJsdoc(options);

module.exports = {
    swaggerServe: swaggerUiExpress.serve,
    swaggerSetup: swaggerUiExpress.setup(swaggerDocs, {
        swaggerOptions: {
            validatorUrl: null
        }
    }),
};
