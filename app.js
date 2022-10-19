const express = require("express");
const http = require("http");
const path = require("path")
const cors = require("cors")
require("./db/mongoConnact");
const {routesInit} = require("./routes/config_route.js");
const { env } = require("process");


const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname,"public")));

app.use(express.json())

routesInit(app)

const server = http.createServer(app);
console.log(env.TEST);



let port = process.env.PORT|| "3000";
server.listen(port);