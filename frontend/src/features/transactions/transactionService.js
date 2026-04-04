import axios from 'axios'
import { API_URL } from '../constants'

const config = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
})

// Send Money
const sendMoney = async (transactionData, token) => {
  const response = await axios.post(`${API_URL}/api/transfer`, transactionData, config(token))
  return response.data
}

// Get All Transactions for a User
const getTransactions = async (userId, token) => {
  const response = await axios.get(`${API_URL}/api/get_transactions/${userId}`, config(token))
  return response.data
}

// Get Sent Transactions
const getMoneySend = async (token) => {
  const response = await axios.get(`${API_URL}/api/get_money_send`, config(token))
  return response.data
}

// Get Received Transactions
const getMoneyReceive = async (token) => {
  const response = await axios.get(`${API_URL}/api/get_money_receive`, config(token))
  console.log("5",response);
  
  return response.data
}

// Add Money to Account
const addMoney = async (data, token) => {
  const response = await axios.post(`${API_URL}/api/deposit`, { amount: data.amount }, config(token))
  return response.data
}

const transactionService = {
  sendMoney,
  getTransactions,
  getMoneySend,
  getMoneyReceive,
  addMoney,
}

export default transactionService
