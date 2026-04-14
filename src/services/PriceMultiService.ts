import axios from "axios"
import type { PriceMulti } from "../models/PriceMulti"

export class PriceMultiService {
    private readonly url = "https://min-api.cryptocompare.com/data/pricemulti"

    async getPrices(symbols: string[]): Promise<PriceMulti> {
        if (symbols.length === 0) return {}
        const response = await axios.get<PriceMulti>(this.url, {
            params: {
                fsyms: symbols.join(","),
                tsyms: "USD"
            }
        })
        return response.data
    }
}

export const priceMultiService = new PriceMultiService()
