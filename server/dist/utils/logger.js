"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log4js = require("log4js");
log4js.configure({
    appenders: {
        console: {
            type: 'console'
        }
    },
    categories: {
        default: {
            appenders: ['console'],
            level: 'info'
        }
    }
});
exports.default = () => {
    return log4js.getLogger();
};
