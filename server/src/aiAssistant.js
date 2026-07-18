import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY;
const client = apiKey ? new Anthropic({ apiKey }) : null;

export const AI_BOT_NAME = "Claude";

/**
 * Ask Claude to answer a question, given some recent chat history for context.
 * recentMessages: [{ username, text }]
 */
export async function askAI(question, recentMessages = []) {
  if (!client) {
    return "⚠️ AI assistant isn't configured yet — add ANTHROPIC_API_KEY to server/.env to enable it.";
  }

  const contextBlock = recentMessages
    .slice(-10)
    .map((m) => `${m.username}: ${m.text}`)
    .join("\n");

  const systemPrompt = `You are a helpful, friendly AI assistant embedded inside a group chat app.
You can see the recent conversation for context. Keep answers concise (a few sentences unless
the question needs code or a list), and speak directly to the person who asked. If the question
isn't clear from context, just answer it generally.`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 600,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Recent conversation:\n${contextBlock}\n\nQuestion: ${question}`,
        },
      ],
    });

    const textBlock = response.content.find((c) => c.type === "text");
    return textBlock ? textBlock.text : "I couldn't come up with a response for that.";
  } catch (err) {
    console.error("AI assistant error:", err.message);
    return "⚠️ Something went wrong reaching the AI assistant. Check the server logs.";
  }
}
