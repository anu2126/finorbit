import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import './Request.scss'
import {
  reset,
  requestReceive,
  updateRequest,
  payReset,
} from '../../features/request/requestSlice'
import Loader from '../../components/Loader/Loader'
import { toast } from 'react-toastify'

import { optionsDate, optionsTime, IndianRupee } from '../utils/helpOptions'

const RequestReceived = () => {
  const dispatch = useDispatch()

  const { received, isLoading, reqSuccess } = useSelector(
    (state) => state.request
  )

  useEffect(() => {
    dispatch(requestReceive())
    if (reqSuccess) {
      dispatch(payReset())
    }
  }, [dispatch, reqSuccess])

  useEffect(() => {
    return () => {
      dispatch(reset())
    }
  }, [dispatch])

  // const handleClick = (transaction) => {
  //   const newRequest = {
  //     _id: transaction?._id,
  //     sender: transaction?.receiver._id,
  //     receiver: transaction?.sender._id,
  //     amount: transaction?.amount,
  //     transactionType: 'deposit',
  //     reference: 'payment reference',
  //     status: 'accepted',
  //   }
  //   dispatch(updateRequest(newRequest))
  // }
  const handleClick = (transaction, actionType) => {
    let updatedStatus = 'pending'
    let transactionType = ''
  
    if (actionType === 'accept') {
      updatedStatus = 'accepted'
      transactionType = 'deposit'
      toast.success('Request accepted and payment processed')
    } else if (actionType === 'deny') {
      updatedStatus = 'denied'
      toast.error('Request has been denied')
    } else if (actionType === 'later') {
      updatedStatus = 'pending'
      toast.success('Request marked as pay later')
    }
  
    const newRequest = {
      _id: transaction?._id,
      sender: transaction?.receiver._id,
      receiver: transaction?.sender._id,
      amount: transaction?.amount,
      transactionType,
      reference: 'payment reference',
      status: updatedStatus,
    }
    dispatch(updateRequest(newRequest))
  }
  

  if (isLoading || reqSuccess) {
    return <Loader />
  }

  return (
    <TableContainer component={Paper} className='table'>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell className='tableCell tableHead'>Request from</TableCell>
            <TableCell className='tableCell tableHead'>Received At</TableCell>
            <TableCell className='tableCell tableHead'>Status</TableCell>
            <TableCell className='tableCell tableHead'>Amount</TableCell>
            <TableCell className='tableCell tableHead'>Description</TableCell>
            <TableCell className='tableCell tableHead'>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {received.map((transaction) => (
            <TableRow key={transaction?._id}>
              <TableCell className='tableCell'>
                <div className='cellWrapper'>
                  {transaction?.sender?.image ? (
          
                  <img
                    src={transaction?.sender?.image}
                    alt={transaction?.sender?.name}
                    className='image'
                  />
                  ):(
                  <img
                    src={'/avatar.png'}
                    alt={transaction?.sender?.name}
                    className='image'
                  />
                  )
          }
                  {transaction?.sender?.name}
                </div>
              </TableCell>
              <TableCell className='tableCell date'>
                {new Date(transaction?.createdAt).toLocaleString(
                  'en-IN',
                  optionsDate
                )}
                <div className='time'>
                  at{' '}
                  {new Date(transaction?.createdAt).toLocaleString(
                    'en-IN',
                    optionsTime
                  )}
                </div>
              </TableCell>
              <TableCell className='tableCell'>
                <span
                  className={`${transaction?.status === 'pending' && 'pending'}
        ${transaction?.status === 'accepted' && 'accepted'}
        ${transaction?.status === 'cancel' && 'cancel'}`}>
                  {transaction?.status}
                </span>
              </TableCell>
              <TableCell className='tableCell'>
                {IndianRupee?.format(transaction?.amount)}
              </TableCell>
              <TableCell className='tableCell'>
                {transaction?.description}
              </TableCell>
              <TableCell className='tableCell'>
                {/* {transaction?.status === 'pending' ? (
                  <button
                    className='accept'
                    onClick={() => handleClick(transaction)}>
                    Accept and pay
                  </button>
                ) : (
                  <button className='paid' disabled>
                    Paid
                  </button>
                )} */}
                {transaction?.status === 'pending' ? (
  <div className='actionButtons'>
    <button
      className='accept' 
      onClick={() => handleClick(transaction, 'accept')}>
      Accept and pay
    </button>
    <button
      className='later'
      onClick={() => handleClick(transaction, 'later')}>
      Pay later
    </button>
    <button
      className='deny'
      onClick={() => handleClick(transaction, 'deny')}>
      Deny
    </button>
  </div>
) : (
  <button className='paid' disabled>
    {transaction?.status === 'accepted' ? 'Paid' : transaction?.status}
  </button>
)}

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RequestReceived
