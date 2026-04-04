"use strict";

var asyncHandler = require('express-async-handler');

var User = require('../models/userModal');

var Transaction = require('../models/transactionModal');

var crypto = require('crypto'); // @desc    Transfer money
// @route   POST /api/transfer
// @access  Private


var transferAmount = asyncHandler(function _callee(req, res) {
  var _req$body, amount, sender, receiver, transactionType, reference, receiverUser, transfer;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, amount = _req$body.amount, sender = _req$body.sender, receiver = _req$body.receiver, transactionType = _req$body.transactionType, reference = _req$body.reference;
          _context.next = 3;
          return regeneratorRuntime.awrap(User.findById(receiver));

        case 3:
          receiverUser = _context.sent;

          if (!(req.user._id != sender || !receiverUser || req.user.isVerified != true || !receiverUser.isVerified)) {
            _context.next = 9;
            break;
          }

          res.status(400);
          throw new Error('sender not verified or loggedin or receiver not found');

        case 9:
          if (!(!amount || !sender || !receiver || !transactionType || !reference)) {
            _context.next = 12;
            break;
          }

          res.status(400);
          throw new Error('please include all fields');

        case 12:
          _context.next = 14;
          return regeneratorRuntime.awrap(Transaction.create({
            amount: amount,
            sender: sender,
            receiver: receiver,
            transactionType: transactionType,
            reference: reference,
            transactionId: crypto.randomBytes(5).toString('hex')
          }));

        case 14:
          transfer = _context.sent;
          _context.next = 17;
          return regeneratorRuntime.awrap(transfer.save());

        case 17:
          _context.next = 19;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(sender, {
            $inc: {
              balance: -amount
            }
          }));

        case 19:
          _context.next = 21;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(receiver, {
            $inc: {
              balance: amount
            }
          }));

        case 21:
          _context.next = 23;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(sender, {
            $inc: {
              moneySend: 1
            }
          }, {
            "new": true
          }));

        case 23:
          _context.next = 25;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(receiver, {
            $inc: {
              moneyReceived: 1
            }
          }, {
            "new": true
          }));

        case 25:
          if (!transfer) {
            _context.next = 29;
            break;
          }

          res.status(201).send({
            _id: transfer._id,
            amount: transfer.amount,
            sender: transfer.sender,
            receiver: transfer.receiver,
            transactionType: transfer.transactionType,
            reference: transfer.reference,
            transactionId: transfer.transactionId
          });
          _context.next = 31;
          break;

        case 29:
          res.status(404);
          throw new Error('not created transfer');

        case 31:
        case "end":
          return _context.stop();
      }
    }
  });
}); // @desc    Transfer money(verify receiver)
// @route   POST /api/verify-receiver
// @access  Private

var verifyReceiver = asyncHandler(function _callee2(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            _id: req.body.receiver
          }));

        case 3:
          user = _context2.sent;

          if (!user) {
            _context2.next = 8;
            break;
          }

          res.status(200).json(user);
          _context2.next = 10;
          break;

        case 8:
          res.status(404);
          throw new Error('receiver not found');

        case 10:
          _context2.next = 16;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          res.status(404);
          throw new Error(_context2.t0);

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
}); // @desc    get all transactions from a user
// @route   GET /api/all_transaction
// @access  Private

var getTransactions = asyncHandler(function _callee3(req, res) {
  var id, transactions;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id = req.params.id;
          console.log(id);
          _context3.next = 4;
          return regeneratorRuntime.awrap(Transaction.find({
            $or: [{
              sender: id
            }, {
              receiver: id
            }]
          }).sort({
            createdAt: -1
          }).populate([{
            path: 'sender',
            select: 'name image'
          }, {
            path: 'receiver',
            select: 'name image'
          }]));

        case 4:
          transactions = _context3.sent;

          if (!transactions) {
            _context3.next = 9;
            break;
          }

          res.status(200).send(transactions);
          _context3.next = 11;
          break;

        case 9:
          res.status(400);
          throw new Error('transaction not found');

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  });
});
var getMoneySendTransactions = asyncHandler(function _callee4(req, res) {
  var transactions;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Transaction.find({
            sender: req.user._id
          }).sort({
            createdAt: -1
          }).populate([{
            path: 'sender',
            select: 'name image'
          }, {
            path: 'receiver',
            select: 'name image'
          }]));

        case 2:
          transactions = _context4.sent;

          if (!transactions) {
            _context4.next = 7;
            break;
          }

          res.status(200).send(transactions);
          _context4.next = 9;
          break;

        case 7:
          res.status(400);
          throw new Error('transactions not found');

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  });
});
var getMoneyReceiveTransactions = asyncHandler(function _callee5(req, res) {
  var transactions;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(Transaction.find({
            receiver: req.user._id
          }).sort({
            createdAt: -1
          }).populate([{
            path: 'sender',
            select: 'name image'
          }, {
            path: 'receiver',
            select: 'name image'
          }]));

        case 2:
          transactions = _context5.sent;

          if (!transactions) {
            _context5.next = 7;
            break;
          }

          res.status(200).send(transactions);
          _context5.next = 9;
          break;

        case 7:
          res.status(400);
          throw new Error('transactions not found');

        case 9:
        case "end":
          return _context5.stop();
      }
    }
  });
}); // @desc    deposit money
// @route   POST /api/deposit
// @access  Private

var deposit = asyncHandler(function _callee6(req, res) {
  var amount, user;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          amount = req.body.amount;
          console.log(amount);
          _context6.next = 4;
          return regeneratorRuntime.awrap(User.findById(req.user._id));

        case 4:
          user = _context6.sent;

          if (!user) {
            _context6.next = 11;
            break;
          }

          _context6.next = 8;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(user._id, {
            $inc: {
              balance: amount
            }
          }, {
            "new": true
          }));

        case 8:
          res.status(200).json({
            msg: "\u20B9".concat(amount, " added to your account")
          });
          _context6.next = 13;
          break;

        case 11:
          res.status(400);
          throw new Error('user not found');

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  });
});
module.exports = {
  transferAmount: transferAmount,
  getTransactions: getTransactions,
  verifyReceiver: verifyReceiver,
  getMoneySendTransactions: getMoneySendTransactions,
  getMoneyReceiveTransactions: getMoneyReceiveTransactions,
  deposit: deposit
};
//# sourceMappingURL=transactionController.dev.js.map
