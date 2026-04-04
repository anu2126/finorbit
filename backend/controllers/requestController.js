const asyncHandler = require('express-async-handler')
const Request = require('../models/requestModal')
const Transaction = require('../models/transactionModal')
const User = require('../models/userModal')
const crypto = require('crypto')

// @desc    send request to another user
// @route   POST /api/request
// @access  Private
const requestAmount = asyncHandler(async (req, res) => {
  const { receiver, amount, description } = req.body
  const moneyreceiver = await User.findById(receiver)

  if (req.user._id == receiver || !moneyreceiver) {
    res.status(400)
    throw new Error('Request not sent')
  }

  if (!receiver || !amount || !description) {
    res.status(400)
    throw new Error('Please include all fields')
  }

  const request = new Request({
    sender: req.user._id,
    receiver,
    amount,
    description,
  })

  await request.save()

  await User.findByIdAndUpdate(
    receiver,
    { $inc: { requestReceived: 1 } },
    { new: true }
  )

  res.status(201).json(request)
})

// @desc    get all requests involving user
// @route   POST /api/get-request
// @access  Private
const getAllRequest = asyncHandler(async (req, res) => {
  try {
    const requests = await Request.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate('sender')
      .populate('receiver')
      .sort({ createdAt: -1 })

    if (requests) {
      return res.status(200).json(requests)
    }
  } catch (error) {
    res.status(404)
    throw new Error(error)
  }
})

// @desc    get all requests sent by user
// @route   POST /api/request-sent
// @access  Private
const getRequestSendTransaction = asyncHandler(async (req, res) => {
  const requests = await Request.find({ sender: req.user._id })
    .sort({ createdAt: -1 })
    .populate([
      { path: 'sender', select: 'name image' },
      { path: 'receiver', select: 'name image' },
    ])

  if (requests) {
    res.status(200).json(requests)
  } else {
    res.status(400)
    throw new Error('No requests sent')
  }
})

// @desc    get all requests received by user
// @route   POST /api/request-received
// @access  Private
const getRequestReceivedTransaction = asyncHandler(async (req, res) => {
  const requests = await Request.find({ receiver: req.user._id })
    .sort({ createdAt: -1 })
    .populate([
      { path: 'sender', select: 'name image' },
      { path: 'receiver', select: 'name image' },
    ])

  if (requests) {
    res.status(200).json(requests)
  } else {
    res.status(400)
    throw new Error('No requests received')
  }
})

// @desc    update request status (accepted, denied, or pending)
// @route   POST /api/update-request-status
// @access  Private
const updateRequestStats = asyncHandler(async (req, res) => {
  const { _id, sender, receiver, amount, transactionType, reference, status } =
    req.body

  try {
    if (status === 'accepted') {
      // First check if sender has sufficient balance
      const senderUser = await User.findById(sender)
      if (!senderUser) {
        res.status(404)
        throw new Error('Sender not found')
      }
      
      if (senderUser.balance < amount) {
        res.status(400)
        throw new Error('Insufficient balance')
      }

      // Start a session for transaction
      const session = await User.startSession()
      session.startTransaction()

      try {
        // Create transaction
        const transaction = await Transaction.create({
          sender,
          receiver,
          amount,
          transactionType,
          transactionId: crypto.randomBytes(5).toString('hex'),
          reference,
        })

        // Update sender's balance
        const updatedSender = await User.findByIdAndUpdate(
          sender,
          { $inc: { balance: -amount } },
          { new: true, session }
        )

        // Update receiver's balance
        const updatedReceiver = await User.findByIdAndUpdate(
          receiver,
          { $inc: { balance: amount } },
          { new: true, session }
        )

        // Update request status
        const updatedRequest = await Request.findByIdAndUpdate(
          _id,
          { status: 'accepted' },
          { new: true, session }
        )

        // Commit the transaction
        await session.commitTransaction()
        session.endSession()

        return res.status(201).json({
          transaction,
          updatedRequest,
          senderBalance: updatedSender.balance,
          receiverBalance: updatedReceiver.balance
        })
      } catch (error) {
        // If any error occurs, abort the transaction
        await session.abortTransaction()
        session.endSession()
        throw error
      }
    } else if (status === 'pending') {
      // Update request status to pending
      const updatedRequest = await Request.findByIdAndUpdate(
        _id,
        { status: 'pending' },
        { new: true }
      )

      if (!updatedRequest) {
        res.status(404)
        throw new Error('Request not found')
      }

      return res.status(200).json({
        message: 'Request marked as pay later',
        updatedRequest
      })
    } else if (status === 'denied') {
      // Update request status to denied
      const updatedRequest = await Request.findByIdAndUpdate(
        _id,
        { status: 'denied' },
        { new: true }
      )

      if (!updatedRequest) {
        res.status(404)
        throw new Error('Request not found')
      }

      return res.status(200).json({
        message: 'Request denied',
        updatedRequest
      })
    } else {
      res.status(400)
      throw new Error('Invalid status')
    }
  } catch (error) {
    res.status(400)
    throw new Error(error.message || 'Error updating request status')
  }
})

module.exports = {
  requestAmount,
  getAllRequest,
  updateRequestStats,
  getRequestSendTransaction,
  getRequestReceivedTransaction,
}
