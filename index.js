require("dotenv").config();
const app = require("./app");
const connectWithDb = require("./config/db");
const cloudinary = require("cloudinary").v2;

const PORT = process.env.PORT || 3000;

// connect with db
connectWithDb();

// storage config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.listen(PORT, () => console.log(`Server is running at port ${PORT}...`));
