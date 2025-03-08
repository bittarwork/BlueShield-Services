const http = require("http");
const app = require("./app"); //
const connectDB = require("./config/db");
require("dotenv").config();

const PORT = process.env.PORT;

// Attempt to connect to the database
connectDB()
    .then(() => {
        // If the connection to the database is successful, create the HTTP server
        const server = http.createServer(app); // Create an HTTP server using the Express app
        server.listen(PORT, () => {
            // Start the server and listen on the specified port
            console.log(`🚀 Server running on port ${PORT}`); // Log a message to confirm that the server is running
        });
    })
    .catch((error) => {
        // If there is an error connecting to the database, log the error and terminate the process
        console.error("❌ Failed to connect to the database:", error); // Log the error message
        process.exit(1); // Exit the process with an error code
    });
