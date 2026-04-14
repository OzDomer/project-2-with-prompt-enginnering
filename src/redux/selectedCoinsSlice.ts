import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

const STORAGE_KEY = "cryptonite.selected"
export const MAX_SELECTED = 5

function loadFromStorage(): string[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) return parsed.slice(0, MAX_SELECTED)
        return []
    } catch {
        return []
    }
}

function saveToStorage(ids: string[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

interface SelectedCoinsState {
    ids: string[]
}

const initialState: SelectedCoinsState = {
    ids: loadFromStorage()
}

const selectedCoinsSlice = createSlice({
    name: "selectedCoins",
    initialState,
    reducers: {
        add: (state, action: PayloadAction<string>) => {
            const id = action.payload
            if (state.ids.includes(id)) return
            if (state.ids.length >= MAX_SELECTED) return
            state.ids.push(id)
            saveToStorage(state.ids)
        },
        remove: (state, action: PayloadAction<string>) => {
            state.ids = state.ids.filter(i => i !== action.payload)
            saveToStorage(state.ids)
        },
        swap: (state, action: PayloadAction<{ removeId: string; addId: string }>) => {
            const { removeId, addId } = action.payload
            state.ids = state.ids.filter(i => i !== removeId)
            if (!state.ids.includes(addId) && state.ids.length < MAX_SELECTED) {
                state.ids.push(addId)
            }
            saveToStorage(state.ids)
        }
    }
})

export const { add, remove, swap } = selectedCoinsSlice.actions
export default selectedCoinsSlice.reducer
