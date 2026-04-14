import axios from "axios"
import type { Coin } from "../models/Coin"

export class CoinsService {
    private readonly url = "https://api.coingecko.com/api/v3/coins/markets"

    async getTop100(): Promise<Coin[]> {
        const response = await axios.get<Coin[]>(this.url, {
            params: {
                vs_currency: "usd",
                order: "market_cap_desc",
                per_page: 100,
                page: 1,
                sparkline: false
            }
        })
        return response.data
    }
}

export const coinsService = new CoinsService()
