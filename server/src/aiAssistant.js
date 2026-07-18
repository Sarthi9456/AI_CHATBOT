// Uses Google Gemini's free-tier API (no credit card required).
// Get a key at https://aistudio.google.com/app/apikey

const apiKey = process.env.GEMINI_API_KEY;
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export const AI_BOT_NAME = "AI Assistant";

/**
 * Ask Gemini to answer a question, given some recent chat history for context.
 * recentMessages: [{ username, text }]
 */
export async function askAI(question, recentMessages = []) {
  if (!apiKey) {
    return "⚠️ AI assistant isn't configured yet — add GEMINI_API_KEY to server/.env to enable it.";
  }

  const contextBlock = recentMessages
    .slice(-10)
    .map((m) => `${m.username}: ${m.text}`)
    .join("\n");

  const prompt = `You are a helpful, friendly AI assistant embedded inside a group chat app.
You can see the recent conversation for context. Keep answers concise (a few sentences unless
the question needs code or a list), and speak directly to the person who asked. If the question
isn't clear from context, just answer it generally.

Recent conversation:
${contextBlock}

Question: ${question}`;

  try {
    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("AI assistant error:", JSON.stringify(data));
      return "⚠️ Something went wrong reaching the AI assistant. Check the server logs.";
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || "I couldn't come up with a response for that.";
  } catch (err) {
    console.error("AI assistant error:", err.message);
    return "⚠️ Something went wrong reaching the AI assistant. Check the server logs.";
  }
}
