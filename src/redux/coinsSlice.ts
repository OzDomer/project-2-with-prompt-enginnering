import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Coin } from "../models/Coin"

interface CoinsState {
    coins: Coin[]
    loaded: boolean
}

const initialState: CoinsState = {
    coins: [],
    loaded: false
}

const coinsSlice = createSlice({
    name: "coins",
    initialState,
    reducers: {
        populate: (state, action: PayloadAction<Coin[]>) => {
            state.coins = action.payload
            state.loaded = true
        },
        clear: (state) => {
            state.coins = []
            state.loaded = false
        }
    }
})

export const { populate, clear } = coinsSlice.actions
export default coinsSlice.reducer
