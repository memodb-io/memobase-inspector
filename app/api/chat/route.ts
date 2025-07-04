import { openai } from "@/lib/openai";
import { jsonSchema, streamText } from "ai";

import { memoBaseClient, getMemobaseUser } from "@/utils/memobase/client";

export const maxDuration = 30;

export async function POST(req: Request) {

  try {
    const user = await (await memoBaseClient()).getOrCreateUser(await getMemobaseUser());

    const context = await user.context(750);

    const { messages, tools } = await req.json();

    const finalSystemPrompt = `You're Memobase Assistant, a helpful assistant that demonstrates the capabilities of Memobase Memory. \n${context}`;
    const result = streamText({
      model: openai(process.env.OPENAI_MODEL!),
      messages,
      // forward system prompt and tools from the frontend
      system: finalSystemPrompt,
      tools: Object.fromEntries(
        Object.entries<{ parameters: unknown }>(tools).map(([name, tool]) => [
          name,
          {
            parameters: jsonSchema(tool.parameters!),
          },
        ])
      ),
    });

    const lastMessage =
      messages[messages.length - 1].content[
        messages[messages.length - 1].content.length - 1
      ].text;

    return result.toDataStreamResponse({
      headers: {
        "x-last-user-message": encodeURIComponent(lastMessage),
      },
      getErrorMessage(error) {
        if (error instanceof Error) {
          return error.message;
        }
        return "Internal Server Error";
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
