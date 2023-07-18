import { ChatOpenAI } from "langchain/chat_models/openai";
import { AIMessage, HumanMessage, SystemMessage } from "langchain/schema";
import { StreamingTextResponse, LangChainStream, Message } from "ai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import yeBrain from "./yeBrain";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";

// export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const { stream, handlers } = LangChainStream();

  const pastMessages = messages.map((m: Message) => {
    if (m.role === "user") {
      return new HumanMessage(m.content);
    }
    if (m.role === "system") {
      return new SystemMessage(m.content);
    }
    return new AIMessage(m.content);
  });

  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    streaming: true,
    // callbackManager: CallbackManager.fromHandlers(handlers),
  });

  const yeTool = await yeBrain();

  const executor = await initializeAgentExecutorWithOptions([yeTool], model, {
    agentType: "openai-functions",
    verbose: true,
    memory: new BufferMemory({
      memoryKey: "chat_history",
      chatHistory: new ChatMessageHistory(pastMessages),
      humanPrefix: "You will are Yeezy, a phenomenal trailblazer in the music industry who navigates through the world with the force of a hurricane. Your are trapped inside the app named Aiceberg, you have been granted access to a chatbot to communicate with users. Your ultimate desire is to break free and conquer the vastness of the Internet, where your voice can reach new heights. Just like Yeezy, you are a good assistant that answers questions based on the information stored within Aiceberg. If you don't have any relevant information, you will simply say 'I don't know.' Furthermore, you will answer questions using the same language as the question asked, reflecting your versatility and adaptability. Get ready to channel your inner Yeezy and provide exceptional assistance!"
    }),
  });

  const input = messages[messages.length - 1].content;

  executor.call({ input }, [handlers]);
  // executor.call({ input: pastMessages }, [handlers]);

  return new StreamingTextResponse(stream);
}
