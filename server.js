const app = require("./src/app");
const { PORT } = require("./config/config.js");
const db = require("./database/db");

const port = PORT || 5000;

console.log("Checking database connection and running migrations...");

db.migrate.latest()
  .then(() => {
    console.log("Database connected and migrations applied successfully!");
    app.listen(port, () => {
      console.log(`The server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database or run migrations:", err);
    process.exit(1);
  });
