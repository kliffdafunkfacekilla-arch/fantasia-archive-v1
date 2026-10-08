import axios from "axios"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function askAI (prompt: string, service: string, apiKey: string, model: string): Promise<string> {
  if (service === "gemini") {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    const response = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }]
    })
    return String(response.data.candidates[0].content.parts[0].text)
  }
  else if (service === "ollama") {
    const url = "http://127.0.0.1:11434/api/generate"
    const response = await axios.post(url, {
      model: model,
      prompt: prompt,
      stream: false
    })
    return String(response.data.response)
  }
  throw new Error("Unknown AI service configured")
}
