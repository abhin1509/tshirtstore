require('dotenv').config();
const app = require("./app");
const connectWithDb = require('./config/db');

const PORT = process.env.PORT || 3000;

// connect with db
connectWithDb();

app.listen(PORT, () => console.log(`Server is running at port ${PORT}...`));
