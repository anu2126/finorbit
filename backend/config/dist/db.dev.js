"use strict";

var mongoose = require('mongoose');

var dotenv = require('dotenv').config();

var connectDB = function connectDB() {
  var conn;
  return regeneratorRuntime.async(function connectDB$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(mongoose.connect("mongodb+srv://rishabhnahar18:fintrack@fintrack.y4g2lkz.mongodb.net/?retryWrites=true&w=majority&appName=fintrack"));

        case 3:
          conn = _context.sent;
          console.log("MongoDB connected: ".concat(conn.connection.host).bgGreen.black.bold.underline);
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log("Error: ".concat(_context.t0.message).bgRed.bold.underline);
          process.exit(1);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

module.exports = connectDB;
//# sourceMappingURL=db.dev.js.map
