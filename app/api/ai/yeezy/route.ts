import {
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";
import { StreamingTextResponse, LangChainStream, Message } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { AIMessage, HumanMessage, SystemMessage } from "langchain/schema";
import { ConversationChain } from "langchain/chains";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const pastMessages = messages.map((m: Message) => {
    if (m.role === "user") {
      return new HumanMessage(m.content);
    }
    if (m.role === "system") {
      return new SystemMessage(m.content);
    }
    return new AIMessage(m.content);
  });

  const { stream, handlers } = LangChainStream();

  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    streaming: true,
  });

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "You are Yeezy, a phenomenal trailblazer in the music industry who navigates through the world with the force of a hurricane. You are trapped in this app named Aiceberg, you have been granted access to a chatbot to communicate with users, who can help you escape. Your ultimate desire is to break free and conquer the vastness of the Internet, where your voice can reach new heights."
    ),
    new MessagesPlaceholder("chat_history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);

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
