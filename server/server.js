require("dotenv").config();
const connectDB = require("./config/db.js");
const app = require("./app.js");

const PORT = process.env.PORT;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server started successfully on port ${PORT} [${process.env.NODE_ENV}]`);
    });
  })
  .catch((err) => {
    console.error("❌ Server startup failed:", err.message);
    console.error(err.stack);
    process.exit(1);
  });
