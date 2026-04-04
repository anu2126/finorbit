import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { setUser } from '../auth/authSlice'
import requestService from './requestService'

// Helper to update localStorage user
const updateUserInLocalStorage = (updates) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const updatedUser = { ...user, ...updates }
  localStorage.setItem('user', JSON.stringify(updatedUser))
  return updatedUser
}

const initialState = {
  request: null,
  send: [],
  received: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  reqReceivedNo: '',
  reqSuccess: false,
  reqLoading: false,
  message: '',
}

export const sendRequest = createAsyncThunk(
  'request/sendRequest',
  async (request, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await requestService.requestMoney(request, token)
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const requestSend = createAsyncThunk(
  'request/requestSend',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await requestService.requestSend(token)
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const requestReceive = createAsyncThunk(
  'request/requestReceived',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await requestService.requestReceived(token)
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const updateRequest = createAsyncThunk(
  'request/requestUpdate',
  async (updatedRequest, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      const response = await requestService.updateRequestStatus(updatedRequest, token)
console.log(response);

      // ✅ If response includes updated balance, update localStorage + Redux
      if (response.senderBalance !== undefined) {
        const updatedUser = updateUserInLocalStorage({ balance: response.senderBalance })
        thunkAPI.dispatch(setUser(updatedUser))
      }

      return response
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    reset: (state) => {
      state.request = null
      state.send = []
      state.received = []
      state.isError = false
      state.isSuccess = false
      state.isLoading = false
      state.reqSuccess = false
      state.reqLoading = false
      state.message = ''
    },
    payReset: (state) => {
      state.reqSuccess = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendRequest.pending, (state) => {
        state.isLoading = true
      })
      .addCase(sendRequest.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.request = action.payload
      })
      .addCase(sendRequest.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(requestSend.pending, (state) => {
        state.isLoading = true
      })
      .addCase(requestSend.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.send = action.payload
      })
      .addCase(requestSend.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(requestReceive.pending, (state) => {
        state.isLoading = true
      })
      .addCase(requestReceive.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.received = action.payload
        state.reqReceivedNo = action.payload.length
      })
      .addCase(requestReceive.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateRequest.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateRequest.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.reqLoading = true
        state.reqSuccess = true
        state.request = action.payload
      })
      .addCase(updateRequest.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset, payReset } = requestSlice.actions
export default requestSlice.reducer
