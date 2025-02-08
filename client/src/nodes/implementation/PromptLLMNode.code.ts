import { useSettingsStore } from "../../store/settingsStore";


export default async function func({
  query,
}: {
  systemPrompt: string;
  query: string;
}) {
  const apiKey = useSettingsStore.getState().openAiApiKey
  const url = "https://api.openai.com/v1/chat/completions";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const body = {
    model: "gpt-4o-mini", // Replace with 'gpt-4o' if available
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: query },
    ],
    max_tokens: 150, // Adjust as needed
    temperature: 0.7, // Adjust as needed
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(
        `Error: ${response.status} - ${errorDetails.error.message}`
      );
    }

    const data = await response.json();
    console.log("Response:", data);
    return data.choices[0].message.content; // Extract and return the response content
  } catch (error) {
    console.error("Error calling GPT-4o:", error);
    throw error;
  }
}
