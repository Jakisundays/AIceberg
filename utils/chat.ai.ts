import { AIMessage, HumanMessage, SystemMessage } from "langchain/schema";
import { Message } from "ai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "langchain/prompts";

export const processMessages = (messages: Message[]) => {
  const pastMessages = messages.map((m) => {
    if (m.role === "user") {
      return new HumanMessage(m.content);
    }
    if (m.role === "system") {
      return new SystemMessage(m.content);
    }
    return new AIMessage(m.content);
  });

  return pastMessages;
};

export const createChatPrompt = (prompt: string) =>
  ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(prompt),
    new MessagesPlaceholder("chat_history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);


