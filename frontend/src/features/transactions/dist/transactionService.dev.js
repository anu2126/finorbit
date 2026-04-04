"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

console.log('FROM TRANSCTION', _constants.API_URL);

var sendMoney = function sendMoney(transactionData, token) {
  var config, response;
  return regeneratorRuntime.async(function sendMoney$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          config = {
            headers: {
              Authorization: "Bearer ".concat(token)
            }
          };
          _context.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post(_constants.API_URL + '/api/transfer', transactionData, config));

        case 3:
          response = _context.sent;
          return _context.abrupt("return", response.data);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};

var getTransactions = function getTransactions(userId, token) {
  var config, response;
  return regeneratorRuntime.async(function getTransactions$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          config = {
            headers: {
              Authorization: "Bearer ".concat(token)
            }
          };
          _context2.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].get(_constants.API_URL + '/api/get_transactions/' + userId, config));

        case 3:
          response = _context2.sent;
          return _context2.abrupt("return", response.data);

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var getMoneySend = function getMoneySend(token) {
  var config, response;
  return regeneratorRuntime.async(function getMoneySend$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          config = {
            headers: {
              Authorization: "Bearer ".concat(token)
            }
          };
          _context3.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].get(_constants.API_URL + '/api/get_money_send', config));

        case 3:
          response = _context3.sent;
          return _context3.abrupt("return", response.data);

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var getMoneyReceive = function getMoneyReceive(token) {
  var config, response;
  return regeneratorRuntime.async(function getMoneyReceive$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          config = {
            headers: {
              Authorization: "Bearer ".concat(token)
            }
          };
          _context4.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].get(_constants.API_URL + '/api/get_money_receive', config));

        case 3:
          response = _context4.sent;
          return _context4.abrupt("return", response.data);

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
};

var addMoney = function addMoney(data, token) {
  var config, response;
  return regeneratorRuntime.async(function addMoney$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          config = {
            headers: {
              Authorization: "Bearer ".concat(token)
            }
          };
          _context5.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post(_constants.API_URL + '/api/deposit', {
            amount: data.amount
          }, config));

        case 3:
          response = _context5.sent;
          return _context5.abrupt("return", response.data);

        case 5:
        case "end":
          return _context5.stop();
      }
    }
  });
};

var transactionService = {
  sendMoney: sendMoney,
  getTransactions: getTransactions,
  getMoneySend: getMoneySend,
  getMoneyReceive: getMoneyReceive,
  addMoney: addMoney
};
var _default = transactionService;
exports["default"] = _default;
//# sourceMappingURL=transactionService.dev.js.map
