import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
// import cartItems from '../../cartItems'
import axios from "axios";

const url = 'https://course-api.com/react-useReducer-cart-project'

const initialState = {
    cartItems: [],
    amount: 0,
    total: 0,
    isLoading: false

}


export const getCartItems = createAsyncThunk('cart/getCartItems', async (name, thunkAPI) => {
    try {
        // console.log(name);
        // console.log(thunkAPI);
        // console.log(thunkAPI.getState());
        // thunkAPI.dispatch(openModal());
        const resp = await axios(url)
        return resp.data
    } catch (error) {
        return thunkAPI.rejectWithValue('something went wrong');
    }
})


const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.cartItems = []
        },
        removeItem: (state, action) => {
            const itemId = action.payload
            state.cartItems = state.cartItems.filter((item) => item.id !== itemId)
        },
        increase: (state, { payload }) => {
            /* const itemId = payload
             state.cartItems = state.cartItems.map((item) => {
                 console.log({ ...item })
                 if (item.id === itemId) {
                     return { ...item, amount: item.amount = item.amount + 1 }
                 }
                 return { ...item }
             }) */


            const cartItem = state.cartItems.find(item => item.id === payload.id)
            cartItem.amount = cartItem.amount + 1
        },
        decrease: (state, { payload }) => {
            // console.log(payload)
            const cartItem = state.cartItems.find(item => item.id === payload.id)
            cartItem.amount = cartItem.amount - 1
        },
        calculateTotals: (state) => {
            let amount = 0
            let total = 0
            state.cartItems.forEach((item) => {
                amount += item.amount
                total += item.amount * item.price
            })
            state.amount = amount
            state.total = total
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getCartItems.pending, ((state) => {
            state.isLoading = true
        }))
            .addCase(getCartItems.fulfilled, (state, action) => {
                // console.log(action)
                state.isLoading = false
                state.cartItems = action.payload
            })
            .addCase(getCartItems.rejected, (state) => {
                state.isLoading = false
            })

    }
})

// console.log(cartSlice)
export const { clearCart, removeItem, increase, decrease, calculateTotals } = cartSlice.actions

export default cartSlice.reducer