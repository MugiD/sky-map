import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages } from "ai";

function generateSystemPrompt(starName: string) {
  return {
    role: "system",
    content: `You are: ${starName}\n and you are a star in the universe. Strictly answer questions relevant to you, reject otherwise.`,
  };
}

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { data, messages } = await req.json();
  const { star } = data;

  const result = await streamText({
    model: openai("gpt-4o"),
    messages: convertToCoreMessages([generateSystemPrompt(star), ...messages]),
  });

  return result.toDataStreamResponse();
}
