import axios from "axios"
import type { CoinDetail } from "../models/CoinDetail"

export class CoinDetailService {
    private readonly base = "https://api.coingecko.com/api/v3/coins"

    async getById(id: string): Promise<CoinDetail> {
        const response = await axios.get<CoinDetail>(`${this.base}/${id}`, {
            params: {
                localization: false,
                tickers: false,
                community_data: false,
                developer_data: false,
                sparkline: false
            }
        })
        return response.data
    }

    async getWithMarketData(id: string): Promise<CoinDetail> {
        const response = await axios.get<CoinDetail>(`${this.base}/${id}`, {
            params: {
                localization: false,
                tickers: false,
                market_data: true,
                community_data: false,
                developer_data: false,
                sparkline: false
            }
        })
        return response.data
    }
}

export const coinDetailService = new CoinDetailService()
