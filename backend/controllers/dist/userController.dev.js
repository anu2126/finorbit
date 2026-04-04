"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var jwt = require('jsonwebtoken');

var asyncHandler = require('express-async-handler');

var bcrypt = require('bcrypt');

var User = require('../models/userModal');

var crypto = require('crypto'); // @desc    Register new user
// @route   POST /api/users/register
// @access  Public


var register = asyncHandler(function _callee(req, res) {
  var _req$body, name, email, phone, password, address, identificationType, balance, moneyReceived, moneySend, requestReceived, userExists, salt, hashedPassword, user;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, email = _req$body.email, phone = _req$body.phone, password = _req$body.password, address = _req$body.address, identificationType = _req$body.identificationType, balance = _req$body.balance, moneyReceived = _req$body.moneyReceived, moneySend = _req$body.moneySend, requestReceived = _req$body.requestReceived;

          if (!name || !email || !password || !phone || !address || !identificationType) {
            res.status(400).json({
              message: 'Please add all fields'
            });
          } // Check if user exists


          _context.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 4:
          userExists = _context.sent;

          if (!userExists) {
            _context.next = 8;
            break;
          }

          res.status(400).json({
            message: 'User already exists'
          });
          return _context.abrupt("return");

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(bcrypt.genSalt(10));

        case 10:
          salt = _context.sent;
          _context.next = 13;
          return regeneratorRuntime.awrap(bcrypt.hash(password, salt));

        case 13:
          hashedPassword = _context.sent;
          _context.next = 16;
          return regeneratorRuntime.awrap(User.create({
            name: name,
            email: email,
            balance: balance,
            password: hashedPassword,
            phone: phone,
            address: address,
            identificationType: identificationType,
            moneySend: moneySend,
            moneyReceived: moneyReceived,
            requestReceived: requestReceived,
            identificationNumber: crypto.randomBytes(6).toString('hex'),
            isAdmin: false,
            isVerified: true
          }));

        case 16:
          user = _context.sent;

          if (user) {
            res.status(201).json({
              _id: user.id,
              name: user.name,
              balance: user.balance,
              email: user.email,
              phone: user.phone,
              address: user.address,
              moneySend: user.moneySend,
              moneyReceived: user.moneyReceived,
              requestReceived: user.requestReceived,
              identificationType: user.identificationType,
              identificationNumber: user.identificationNumber,
              isAdmin: user.isAdmin,
              isVerified: user.isVerified,
              token: generateToken(user._id)
            });
          } else {
            res.status(400).json({
              message: 'Invalid user data'
            });
          }

        case 18:
        case "end":
          return _context.stop();
      }
    }
  });
}); // @desc    login user
// @route   POST /api/users/login
// @access  Public

var login = asyncHandler(function _callee2(req, res) {
  var _req$body2, email, password, user, userObj;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          console.log(email, password);
          _context2.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 4:
          user = _context2.sent;
          _context2.t0 = user;

          if (!_context2.t0) {
            _context2.next = 10;
            break;
          }

          _context2.next = 9;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 9:
          _context2.t0 = _context2.sent;

        case 10:
          if (!_context2.t0) {
            _context2.next = 16;
            break;
          }

          userObj = user.toObject();
          delete userObj.password;
          res.status(200).json(_objectSpread({}, userObj, {
            token: generateToken(user._id)
          }));
          _context2.next = 17;
          break;

        case 16:
          res.status(401).json({
            message: 'Invalid credentials'
          });

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // @desc    get current user
// @route   GET /api/users/curent_user
// @access  Protect

var currentUser = asyncHandler(function _callee3(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          user = {
            _id: req.user._id,
            email: req.user.email,
            name: req.user.name
          };
          res.status(200).json(user);

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // @desc    get all users
// @route   GET /api/users/get_users
// @access  Protect

var getUsers = asyncHandler(function _callee4(req, res) {
  var users, newUsers;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(User.find());

        case 2:
          users = _context4.sent;
          newUsers = users.filter(function (user) {
            return user._id.toString() !== req.user._id.toString();
          });

          if (newUsers) {
            res.status(200).json(newUsers);
          } else {
            res.status(404).json({
              message: 'User not found'
            });
          }

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // @desc    verify user
// @route   GET /api/users/verify/:id
// @access  Protect

var verify = asyncHandler(function _callee5(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.params.id, {
            isVerified: req.body.isVerified
          }, {
            "new": true
          }));

        case 2:
          user = _context5.sent;

          if (user) {
            res.status(201).json({
              _id: user._id,
              name: user.name,
              isVerified: user.isVerified
            });
          } else {
            res.status(404).json({
              message: 'User not found'
            });
          }

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
}); // @desc    get uploaded image
// @route   GET /api/users/get_image
// @access  Protect

var getImage = asyncHandler(function _callee6(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.user._id));

        case 2:
          user = _context6.sent;

          if (user.image) {
            res.status(201).json(user.image);
          } else {
            res.status(404).json({
              message: 'No user image'
            });
          }

        case 4:
        case "end":
          return _context6.stop();
      }
    }
  });
});

var generateToken = function generateToken(id) {
  return jwt.sign({
    id: id
  }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = {
  register: register,
  login: login,
  currentUser: currentUser,
  getUsers: getUsers,
  verify: verify,
  getImage: getImage
};
//# sourceMappingURL=userController.dev.js.map
