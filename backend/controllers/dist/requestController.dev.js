"use strict";

// const asyncHandler = require('express-async-handler')
// const Request = require('../models/requestModal')
// const Transaction = require('../models/transactionModal')
// const User = require('../models/userModal')
// const crypto = require('crypto')
// // @desc    send request to another user
// // @route   POST /api/request
// // @access  Private
// const requestAmount = asyncHandler(async (req, res) => {
//   const { receiver, amount, description } = req.body
//   const moneyreceiver = await User.findById(receiver)
//   if (req.user._id == receiver || !moneyreceiver) {
//     res.status(400)
//     throw new Error('request not send')
//   } else {
//     try {
//       if (!receiver || !amount || !description) {
//         res.status(400)
//         throw new Error('please include all fields')
//       }
//       const request = new Request({
//         sender: req.user._id,
//         receiver,
//         amount,
//         description,
//       })
//       await request.save()
//       await User.findByIdAndUpdate(
//         receiver,
//         { $inc: { requestReceived: 1 } },
//         { new: true }
//       )
//       res.status(201).json(request)
//     } catch (error) {
//       throw new Error(error)
//     }
//   }
// })
// // @desc    get all request for a user
// // @route   POST /api/get-request
// // @access  Private
// const getAllRequest = asyncHandler(async (req, res) => {
//   // console.log(req.user)
//   try {
//     const requests = await Request.find({
//       $or: [{ sender: req.user._id }, { receiver: req.user._id }],
//     })
//       .populate('sender')
//       .populate('receiver')
//       .sort({ createdAt: -1 })
//     if (requests) {
//       return res.status(200).json(requests)
//     }
//   } catch (error) {
//     res.status(404)
//     throw new Error(error)
//   }
// })
// const getRequestSendTransaction = asyncHandler(async (req, res) => {
//   const requests = await Request.find({ sender: req.user._id })
//     .sort({ createdAt: -1 })
//     .populate([
//       { path: 'sender', select: 'name image' },
//       { path: 'receiver', select: 'name image' },
//     ])
//   if (requests) {
//     res.status(200).json(requests)
//   } else {
//     res.status(400)
//     throw new Error('no requests send')
//   }
// })
// const getRequestReceivedTransaction = asyncHandler(async (req, res) => {
//   const requests = await Request.find({ receiver: req.user._id })
//     .sort({ createdAt: -1 })
//     .populate([
//       { path: 'sender', select: 'name image' },
//       { path: 'receiver', select: 'name image' },
//     ])
//   if (requests) {
//     res.status(200).json(requests)
//   } else {
//     res.status(400)
//     throw new Error('no requests received')
//   }
// })
// // @desc    update request status
// // @route   POST /api/update-request-status
// // @access  Private
// const updateRequestStats = asyncHandler(async (req, res) => {
//   const { _id, sender, receiver, amount, transactionType, reference, status } =
//     req.body
//   try {
//     if (status === 'accepted') {
//       const transaction = await Transaction.create({
//         sender: sender,
//         receiver: receiver,
//         amount: amount,
//         transactionType: transactionType,
//         transactionId: crypto.randomBytes(5).toString('hex'),
//         reference: reference,
//       })
//       // await transaction.save()
//       // deduct the amount from the sender
//       await User.findByIdAndUpdate(sender, {
//         $inc: { balance: -amount },
//       })
//       // add the amount to the receiver
//       await User.findByIdAndUpdate(receiver, {
//         $inc: { balance: amount },
//       })
//       res.status(201).json(transaction)
//       await Request.findByIdAndUpdate(
//         _id,
//         {
//           status: status,
//         },
//         { new: true }
//       )
//     }
//   } catch (error) {
//     res.status(404)
//     throw new Error(error)
//   }
// })
// module.exports = {
//   requestAmount,
//   getAllRequest,
//   updateRequestStats,
//   getRequestSendTransaction,
//   getRequestReceivedTransaction,
// }
var asyncHandler = require('express-async-handler');

var Request = require('../models/requestModal');

var Transaction = require('../models/transactionModal');

var User = require('../models/userModal');

var crypto = require('crypto'); // @desc    send request to another user
// @route   POST /api/request
// @access  Private


var requestAmount = asyncHandler(function _callee(req, res) {
  var _req$body, receiver, amount, description, moneyreceiver, request;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, receiver = _req$body.receiver, amount = _req$body.amount, description = _req$body.description;
          _context.next = 3;
          return regeneratorRuntime.awrap(User.findById(receiver));

        case 3:
          moneyreceiver = _context.sent;

          if (!(req.user._id == receiver || !moneyreceiver)) {
            _context.next = 7;
            break;
          }

          res.status(400);
          throw new Error('Request not sent');

        case 7:
          if (!(!receiver || !amount || !description)) {
            _context.next = 10;
            break;
          }

          res.status(400);
          throw new Error('Please include all fields');

        case 10:
          request = new Request({
            sender: req.user._id,
            receiver: receiver,
            amount: amount,
            description: description
          });
          _context.next = 13;
          return regeneratorRuntime.awrap(request.save());

        case 13:
          _context.next = 15;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(receiver, {
            $inc: {
              requestReceived: 1
            }
          }, {
            "new": true
          }));

        case 15:
          res.status(201).json(request);

        case 16:
        case "end":
          return _context.stop();
      }
    }
  });
}); // @desc    get all requests involving user
// @route   POST /api/get-request
// @access  Private

var getAllRequest = asyncHandler(function _callee2(req, res) {
  var requests;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Request.find({
            $or: [{
              sender: req.user._id
            }, {
              receiver: req.user._id
            }]
          }).populate('sender').populate('receiver').sort({
            createdAt: -1
          }));

        case 3:
          requests = _context2.sent;

          if (!requests) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(200).json(requests));

        case 6:
          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          res.status(404);
          throw new Error(_context2.t0);

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
}); // @desc    get all requests sent by user
// @route   POST /api/request-sent
// @access  Private

var getRequestSendTransaction = asyncHandler(function _callee3(req, res) {
  var requests;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Request.find({
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
          requests = _context3.sent;

          if (!requests) {
            _context3.next = 7;
            break;
          }

          res.status(200).json(requests);
          _context3.next = 9;
          break;

        case 7:
          res.status(400);
          throw new Error('No requests sent');

        case 9:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // @desc    get all requests received by user
// @route   POST /api/request-received
// @access  Private

var getRequestReceivedTransaction = asyncHandler(function _callee4(req, res) {
  var requests;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Request.find({
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
          requests = _context4.sent;

          if (!requests) {
            _context4.next = 7;
            break;
          }

          res.status(200).json(requests);
          _context4.next = 9;
          break;

        case 7:
          res.status(400);
          throw new Error('No requests received');

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // @desc    update request status (accepted, denied, or pending)
// @route   POST /api/update-request-status
// @access  Private

var updateRequestStats = asyncHandler(function _callee5(req, res) {
  var _req$body2, _id, sender, receiver, amount, transactionType, reference, status, transaction, updatedRequest, _updatedRequest;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body2 = req.body, _id = _req$body2._id, sender = _req$body2.sender, receiver = _req$body2.receiver, amount = _req$body2.amount, transactionType = _req$body2.transactionType, reference = _req$body2.reference, status = _req$body2.status;
          _context5.prev = 1;

          if (!(status === 'accepted')) {
            _context5.next = 15;
            break;
          }

          _context5.next = 5;
          return regeneratorRuntime.awrap(Transaction.create({
            sender: sender,
            receiver: receiver,
            amount: amount,
            transactionType: transactionType,
            transactionId: crypto.randomBytes(5).toString('hex'),
            reference: reference
          }));

        case 5:
          transaction = _context5.sent;
          _context5.next = 8;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(sender, {
            $inc: {
              balance: -amount
            }
          }));

        case 8:
          _context5.next = 10;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(receiver, {
            $inc: {
              balance: amount
            }
          }));

        case 10:
          _context5.next = 12;
          return regeneratorRuntime.awrap(Request.findByIdAndUpdate(_id, {
            status: status
          }, {
            "new": true
          }));

        case 12:
          return _context5.abrupt("return", res.status(201).json(transaction));

        case 15:
          if (!(status === 'denied')) {
            _context5.next = 22;
            break;
          }

          _context5.next = 18;
          return regeneratorRuntime.awrap(Request.findByIdAndUpdate(_id, {
            status: 'denied'
          }, {
            "new": true
          }));

        case 18:
          updatedRequest = _context5.sent;
          return _context5.abrupt("return", res.status(200).json({
            message: 'Request denied',
            updatedRequest: updatedRequest
          }));

        case 22:
          if (!(status === 'pending')) {
            _context5.next = 29;
            break;
          }

          _context5.next = 25;
          return regeneratorRuntime.awrap(Request.findByIdAndUpdate(_id, {
            status: 'pending'
          }, {
            "new": true
          }));

        case 25:
          _updatedRequest = _context5.sent;
          return _context5.abrupt("return", res.status(200).json({
            message: 'Marked as pay later',
            updatedRequest: _updatedRequest
          }));

        case 29:
          res.status(400);
          throw new Error('Invalid status update');

        case 31:
          _context5.next = 37;
          break;

        case 33:
          _context5.prev = 33;
          _context5.t0 = _context5["catch"](1);
          res.status(404);
          throw new Error(_context5.t0.message || 'Error updating request status');

        case 37:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 33]]);
});
module.exports = {
  requestAmount: requestAmount,
  getAllRequest: getAllRequest,
  updateRequestStats: updateRequestStats,
  getRequestSendTransaction: getRequestSendTransaction,
  getRequestReceivedTransaction: getRequestReceivedTransaction
};
//# sourceMappingURL=requestController.dev.js.map
