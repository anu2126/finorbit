import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { setUser } from '../auth/authSlice'
import transactionService from './transactionService'

// Helper to update localStorage user
const updateUserInLocalStorage = (updates) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const updatedUser = { ...user, ...updates }
  localStorage.setItem('user', JSON.stringify(updatedUser))
  return updatedUser
}

const initialState = {
  transaction: null,
  transactions: [],
  send: [],
  received: [],
  moneyAdded: '',
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// --- Async Thunks ---
// export const sendMoney = createAsyncThunk('transaction/send', async (transaction, thunkAPI) => {
//   try {
//     const token = thunkAPI.getState().auth.user.token
//     const response = await transactionService.sendMoney(transaction, token)
//     // console.log(response);

//     // Update localStorage and dispatch setUser if balance changed
//     if (response.senderBalance !== undefined) {
//       console.log("12",response);

//       const updatedUser = updateUserInLocalStorage({ balance: response.senderBalance })

//       thunkAPI.dispatch(setUser(updatedUser))
//     }

//     return response
//   } catch (error) {
//     const message = error.response?.data?.message || error.message || error.toString()
//     return thunkAPI.rejectWithValue(message)
//   }
// })

export const sendMoney = createAsyncThunk('transaction/send', async (transaction, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    const response = await transactionService.sendMoney(transaction, token)

    const loggedInUser = thunkAPI.getState().auth.user
    console.log(loggedInUser);
    

    // ✅ If sender is the logged-in user
    if (response.sender === loggedInUser._id && response.senderBalance !== undefined) {
      const updatedUser = updateUserInLocalStorage({ balance: response.senderBalance })
      thunkAPI.dispatch(setUser(updatedUser))
    }

    // ✅ If receiver is the logged-in user
    if (response.receiver === loggedInUser._id && response.receiverBalance !== undefined) {
      const updatedUser = updateUserInLocalStorage({ balance: response.receiverBalance })
      thunkAPI.dispatch(setUser(updatedUser))
    }

    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})


export const addBalance = createAsyncThunk('transaction/addMoney', async (data, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    const response = await transactionService.addMoney(data, token)

    // Update localStorage and dispatch setUser if balance changed
    if (response.balance !== undefined) {
      const updatedUser = updateUserInLocalStorage({ balance: response.balance })
      thunkAPI.dispatch(setUser(updatedUser))
    }

    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const getTransactions = createAsyncThunk('transaction/getTransactions', async (userId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await transactionService.getTransactions(userId, token)


  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const getSendTransactions = createAsyncThunk('transaction/moneySend', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await transactionService.getMoneySend(token)
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const getReceivedTransactions = createAsyncThunk('transaction/moneyReceived', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    const response = transactionService.getMoneyReceive(token)
    console.log(response);
    // Update localStorage and dispatch setUser if balance changed
    if (response.balance !== undefined) {
      const updatedUser = updateUserInLocalStorage({ balance: response.balance })
      thunkAPI.dispatch(setUser(updatedUser))
    }
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// --- Slice ---
export const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Send Money
      .addCase(sendMoney.pending, (state) => {
        state.isLoading = true
      })
      .addCase(sendMoney.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.transaction = action.payload
      })
      .addCase(sendMoney.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      // Add Balance
      .addCase(addBalance.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addBalance.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.moneyAdded = action.payload
      })
      .addCase(addBalance.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      // Get All Transactions
      .addCase(getTransactions.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.transactions = action.payload
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      // Get Sent Transactions
      .addCase(getSendTransactions.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getSendTransactions.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.send = action.payload
      })
      .addCase(getSendTransactions.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      // Get Received Transactions
      .addCase(getReceivedTransactions.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getReceivedTransactions.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.received = action.payload
      })
      .addCase(getReceivedTransactions.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = transactionSlice.actions
export default transactionSlice.reducer


