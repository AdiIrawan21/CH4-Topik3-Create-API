const express = require("express");
const port = 3000;
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// Swagger
const swaggerUi = require("swagger-ui-express");
const apiDocumentation = require('./apidocs.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocumentation));
// End Swagger

const v1Router = require('./routes/v1/index');
app.use('/v1', v1Router);


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
