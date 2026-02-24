import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

const NVIDIA_API_KEY = "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"

const kimi = new ChatOpenAI({
    model: "moonshotai/kimi-k2.5",
    apiKey: NVIDIA_API_KEY,
    configuration: {
        baseURL: "https://integrate.api.nvidia.com/v1",
    },
});

const res = await kimi.invoke([
    { role: "user", content: "Explain LangChain JS in one paragraph." },
]);

console.log(res.content);
