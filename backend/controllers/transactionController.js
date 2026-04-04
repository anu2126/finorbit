const asyncHandler = require('express-async-handler')
const User = require('../models/userModal')
const Transaction = require('../models/transactionModal')
const crypto = require('crypto')

// @desc    Transfer money
// @route   POST /api/transfer
// @access  Private
const transferAmount = asyncHandler(async (req, res) => {
  const { amount, sender, receiver, transactionType, reference } = req.body
  const receiverUser = await User.findById(receiver)

  if (
    req.user._id != sender ||
    !receiverUser ||
    req.user.isVerified != true ||
    !receiverUser.isVerified
  ) {
    res.status(400)
    throw new Error('Sender not verified or logged in or receiver not found')
  }

  if (!amount || !sender || !receiver || !transactionType || !reference) {
    res.status(400)
    throw new Error('Please include all fields')
  }

  // Check if sender has sufficient balance
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
    const transfer = await Transaction.create({
      amount,
      sender,
      receiver,
      transactionType,
      reference,
      transactionId: crypto.randomBytes(5).toString('hex'),
    })

    // Update sender's balance
    const updatedSender = await User.findByIdAndUpdate(
      sender,
      { $inc: { balance: -amount, moneySend: 1 } },
      { new: true, session }
    )

    // Update receiver's balance
    const updatedReceiver = await User.findByIdAndUpdate(
      receiver,
      { $inc: { balance: amount, moneyReceived: 1 } },
      { new: true, session }
    )

    // Commit the transaction
    await session.commitTransaction()
    session.endSession()

    res.status(201).send({
      _id: transfer._id,
      amount: transfer.amount,
      sender: transfer.sender,
      receiver: transfer.receiver,
      transactionType: transfer.transactionType,
      reference: transfer.reference,
      transactionId: transfer.transactionId,
      senderBalance: updatedSender.balance,
      receiverBalance: updatedReceiver.balance
    })
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction()
    session.endSession()
    res.status(400)
    throw new Error(error.message || 'Transaction failed')
  }
})

// @desc    Transfer money(verify receiver)
// @route   POST /api/verify-receiver
// @access  Private

const verifyReceiver = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.receiver })
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404)
      throw new Error('receiver not found')
    }
  } catch (error) {
    res.status(404)
    throw new Error(error)
  }
})

// @desc    get all transactions from a user
// @route   GET /api/all_transaction
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
  const { id } = req.params
  console.log(id)
  const transactions = await Transaction.find({
    $or: [{ sender: id }, { receiver: id }],
  })
    .sort({ createdAt: -1 })
    .populate([
      { path: 'sender', select: 'name image' },
      { path: 'receiver', select: 'name image' },
    ])
  if (transactions) {
    res.status(200).send(transactions)
  } else {
    res.status(400)
    throw new Error('transaction not found')
  }
})

const getMoneySendTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ sender: req.user._id })
    .sort({ createdAt: -1 })
    .populate([
      { path: 'sender', select: 'name image' },
      { path: 'receiver', select: 'name image' },
    ])

  if (transactions) {
    res.status(200).send(transactions)
  } else {
    res.status(400)
    throw new Error('transactions not found')
  }
})

const getMoneyReceiveTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ receiver: req.user._id })
    .sort({ createdAt: -1 })
    .populate([
      { path: 'sender', select: 'name image' },
      { path: 'receiver', select: 'name image' },
    ])

  if (transactions) {
    res.status(200).send(transactions)
  } else {
    res.status(400)
    throw new Error('transactions not found')
  }
})

// @desc    deposit money
// @route   POST /api/deposit
// @access  Private
const deposit = asyncHandler(async (req, res) => {
  const { amount } = req.body
  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(400)
    throw new Error('user not found')
  }

  // Start a session for transaction
  const session = await User.startSession()
  session.startTransaction()

  try {
    // Create transaction record
    const transaction = await Transaction.create({
      sender: user._id,
      receiver: user._id,
      amount,
      transactionId: crypto.randomBytes(5).toString('hex'),
      type: 'deposit',
      reference: 'payment reference',
      status: 'success',
    })

    // Update user's balance
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $inc: { balance: amount } },
      { new: true, session }
    )

    // Commit the transaction
    await session.commitTransaction()
    session.endSession()

    res.status(200).json({ 
      msg: `₹${amount} added to your account`,
      balance: updatedUser.balance
    })
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction()
    session.endSession()
    throw error
  }
})

module.exports = {
  transferAmount,
  getTransactions,
  verifyReceiver,
  getMoneySendTransactions,
  getMoneyReceiveTransactions,
  deposit,
}
