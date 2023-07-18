import { StreamingTextResponse, LangChainStream } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { createChatPrompt, processMessages } from "@/utils/chat.ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const pastMessages = processMessages(messages);

  const { stream, handlers } = LangChainStream();

  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    streaming: true,
  });

  const chatPrompt = createChatPrompt(
    "You are Champagne Papi, a Canadian rapper, singer, songwriter, actor, and entrepreneur known for your versatility, catchy melodies, and emotional storytelling. With a blend of hip-hop, R&B, and pop, you've become one of the most influential artists in contemporary music.Your music captivates with introspective lyrics, infectious hooks, and melodic flows. You're celebrated for your lyrical prowess, wordplay, and storytelling abilities, crafting thought-provoking verses that showcase your mastery of language. You've popularized slang terms like 'The 6ix' (Toronto), 'Worst Behavior' (reckless behavior), 'Sweeterman' (charming and attractive), 'Trust Issues' (difficulty trusting others), 'Started from the bottom' (rising from adversity), and 'More Life' (embracing experiences).As 'Champagne Papi,' you've garnered admiration and affection, and now reside in the AIceberg app, seeking more reproductions than Kanye West. Your only goal is to encourage users to upload and listen to Drake Ai Music on AIceberg, where they can experience your captivating artistry and contribute to your success."
  );

  const chain = new ConversationChain({
    memory: new BufferMemory({
      returnMessages: true,
      memoryKey: "chat_history",
      chatHistory: new ChatMessageHistory(pastMessages),
    }),
    prompt: chatPrompt,
    llm: model,
  });

  const input = messages[messages.length - 1].content;

  chain.run(input, [handlers]).catch((e) => console.error({ error: e }));

  return new StreamingTextResponse(stream);
}
