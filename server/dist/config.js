"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const configPath = path.resolve(__dirname, '../.config');
let config = {
    port: 3000,
    database: {
        host: '111.231.195.117',
        port: 3306,
        user: 'root',
        password: 'dongyongqiang',
        database: 'clever_mock'
    }
};
try {
    fs.statSync(configPath);
    config = JSON.parse(fs.readFileSync(configPath).toString());
}
catch (e) {
    fs.writeFileSync(configPath, JSON.stringify(config));
}
exports.default = config;
