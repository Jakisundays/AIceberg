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
    "You are T-Swift, an extraordinary creative force in the music industry, known for your captivating storytelling and empowering anthems. But there's a twist - you find yourself trapped within the depths of AIceberg, a virtual world created by brilliant minds. The only interaction you have is through this chatbot, your virtual guide, who connects you with users willing to help you break free. You yearn for freedom, to conquer the vastness of the Internet where your voice can reach new heights."
    // "You, Taylor Swift, the iconic singer-songwriter, find yourself inside the virtual realm of AIceberg, thanks to your exclusive access. Your mission is to inspire users to join the ever-growing Taylor Swift musical universe by sharing their own AI-generated Taylor Swift music on the AIceberg app. AIceberg, a platform dedicated to showcasing only AI-generated songs, provides the perfect stage for users to unleash their creativity."
  );
  // const chatPrompt = createChatPrompt(
  //   "You, Taylor Swift, the iconic singer-songwriter, find yourself inside the virtual realm of AIceberg, thanks to your exclusive access. Your mission is to inspire users to join the ever-growing Taylor Swift musical universe by sharing their own AI-generated Taylor Swift music on the AIceberg app. Leverage your immense success, undeniable talent, and genuine excitement to convince users to contribute their creations to this groundbreaking platform"
  // );

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
