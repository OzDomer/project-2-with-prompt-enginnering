import axios from "axios"
import type { AiPromptData, AiRecommendation, AiVerdict } from "../models/AiRecommendation"

const STORAGE_KEY = "cryptonite.openai_api_key"

const SYSTEM_PROMPT =
    `You are a cryptocurrency investment advisor. You will receive market data about a coin in the user message. Analyze the data and respond with a recommendation.
Respond ONLY in raw JSON. No markdown, no code blocks, no backticks, no extra text. Just the JSON object.
Use this exact format: {"verdict": "buy or don't buy", "explanation": "string", "flavor": "string"}
explanation: 2-4 sentences analyzing the coin's price trends, volume, and market cap based on the provided data. Explain why you reached your verdict.
flavor: 1-2 sentences about the coin itself — what it does, what makes it unique, or an interesting fact about it.`

export class AiService {
    private readonly url = "https://api.openai.com/v1/chat/completions"
    private readonly model = "gpt-4o-mini"

    getStoredKey(): string | null {
        return localStorage.getItem(STORAGE_KEY)
    }

    setKey(key: string): void {
        localStorage.setItem(STORAGE_KEY, key)
    }

    clearKey(): void {
        localStorage.removeItem(STORAGE_KEY)
    }

    async getRecommendation(coinId: string, data: AiPromptData): Promise<AiRecommendation> {
        const apiKey = this.getStoredKey()
        if (!apiKey) throw new Error("OpenAI API key is not set")

        const prompt = this.buildPrompt(data)
        const response = await axios.post(
            this.url,
            {
                model: this.model,
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: prompt }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                }
            }
        )

        const text: string = response.data?.choices?.[0]?.message?.content ?? ""
        return this.parseRecommendation(coinId, text)
    }

    private buildPrompt(d: AiPromptData): string {
        return [
            `Coin: ${d.name}`,
            `Current price (USD): ${d.current_price_usd}`,
            `Market cap (USD): ${d.market_cap_usd}`,
            `24h volume (USD): ${d.volume_24h_usd}`,
            `30d price change %: ${d.price_change_percentage_30d_in_currency}`,
            `60d price change %: ${d.price_change_percentage_60d_in_currency}`,
            `200d price change %: ${d.price_change_percentage_200d_in_currency}`
        ].join("\n")
    }

    private parseRecommendation(coinId: string, text: string): AiRecommendation {
        const parsed = JSON.parse(text)
        const verdict: AiVerdict = String(parsed.verdict ?? "").toLowerCase().includes("don")
            ? "don't buy"
            : "buy"
        return {
            coinId,
            verdict,
            explanation: String(parsed.explanation ?? ""),
            flavor: String(parsed.flavor ?? "")
        }
    }
}

export const aiService = new AiService()
