"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const config_1 = require("./config");
const app = express();
app.listen(config_1.default.port, () => {
    console.warn(`listen on port 3000;\nclick http://localhost:${config_1.default.port} to visit server;`);
});
