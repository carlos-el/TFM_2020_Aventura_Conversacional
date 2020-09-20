const express = require("express");
var notificationsRouter = require('./routes/notification');
var config = require('./config');

const app = express();

app.use(express.json());

// Define the only route
app.use("/notifications", notificationsRouter);

// Define route for catching 404
app.use(function (req, res, next) {
    res.status(404).json({ status: 404, message: "Not Found" })
});

// Define error handler
app.use(function (err, req, res, next) {
    var e_status = err.status || 500
    var e_type = err.type || "Internal Server Error"
    res.status(e_status).json({ status: e_status, type: err.message });
});

console.log(process.env.AMAZON_API_CLIENT_ID)
console.log(process.env.AMAZON_API_CLIENT_ID_SECRET)
// Check that de env varaibles needed are set
if(!process.env.AMAZON_API_CLIENT_ID || !process.env.AMAZON_API_CLIENT_ID_SECRET){
    throw new Error("ENV variables required for token retrieval not set")
}

// Get the port and start the app
var port = config.server.port
app.set('port', port);

app.listen(port, () => {
    console.log("Server is running on PORT " + port);
});
