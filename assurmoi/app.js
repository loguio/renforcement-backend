const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { body, validationResult } = require("express-validator");
const initRoutes = require("./routes");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AssurMoi API",
      version: "1.0.0",
      description: "API documentation for the backend of AssurMoi application",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://exemple.com", "*"],
  }),
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

initRoutes(app);

app.listen(PORT, () => {
  console.log("server running on port", PORT);
});

module.exports = app;
