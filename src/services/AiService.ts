import axios from "axios"
import type { AiPromptData, AiRecommendation } from "../models/AiRecommendation"

const STORAGE_KEY = "cryptonite.nvidia_api_key"

export class AiService {
    private readonly url = "https://integrate.api.nvidia.com/v1/chat/completions"
    private readonly model = "meta/llama-3.1-8b-instruct"

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
        if (!apiKey) throw new Error("NVIDIA API key is not set")

        const prompt = this.buildPrompt(data)
        const response = await axios.post(
            this.url,
            {
                model: this.model,
                messages: [
                    {
                        role: "system",
                        content: "You are a disciplined crypto analyst. Answer in strict JSON only: {\"verdict\":\"buy\"|\"don't buy\",\"explanation\":\"...\"}. Explanation should be 2-4 concise sentences grounded in the metrics provided."
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.5,
                max_tokens: 350
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
            `200d price change %: ${d.price_change_percentage_200d_in_currency}`,
            "",
            "Based on the data above, should a retail investor buy now? Reply in strict JSON."
        ].join("\n")
    }

    private parseRecommendation(coinId: string, text: string): AiRecommendation {
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            try {
                const parsed = JSON.parse(jsonMatch[0])
                const verdict = String(parsed.verdict ?? "").toLowerCase().includes("don") ? "don't buy" : "buy"
                const explanation = String(parsed.explanation ?? text)
                return { coinId, verdict, explanation }
            } catch {
                // fall through
            }
        }
        const lower = text.toLowerCase()
        const verdict: "buy" | "don't buy" = lower.includes("don't buy") || lower.includes("do not buy") ? "don't buy" : "buy"
        return { coinId, verdict, explanation: text.trim() || "No explanation returned." }
    }
}

export const aiService = new AiService()
