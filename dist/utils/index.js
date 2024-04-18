"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeUntilDeadline = exports.capitalizeFirstLetter = exports.emailRegex = void 0;
const date_fns_1 = require("date-fns");
exports.emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
exports.capitalizeFirstLetter = capitalizeFirstLetter;
function timeUntilDeadline(date) {
    const deadline = (0, date_fns_1.addHours)(date, 24);
    const now = new Date();
    return (0, date_fns_1.differenceInHours)(deadline, now);
}
exports.timeUntilDeadline = timeUntilDeadline;
