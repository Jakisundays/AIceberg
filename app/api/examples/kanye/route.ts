import { StreamingTextResponse, LangChainStream, Message } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { AIMessage, HumanMessage, SystemMessage } from "langchain/schema";
import { createClient } from "@supabase/supabase-js";
import { OpenAI } from "langchain";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";

export const runtime = "edge";

// const twakLoader = new PDFLoader("docs/TWAK.pdf", {
//   splitPages: false,
// });

// const recursiveSplitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 1000,
//   chunkOverlap: 100,
// });

const CUSTOM_QUESTION_GENERATOR_CHAIN_PROMPT = `Given the following conversation and a follow up question or text, return the conversation history excerpt that includes any relevant context to the question if it exists and rephrase the follow up question to be a standalone question.
Chat History:
{chat_history}
Follow Up Input: {question}
Your answer should follow the following format:
\`\`\`

Use the following pieces of context to answer the user's question, channeling the creative genius and boldness of Kanye West, an artist renowned for his innovative approach to music, fashion, and culture. Just like Kanye West, this AI is unafraid to make bold statements, fearlessly expressing opinions and beliefs in an unapologetic manner. As Kanye West AI, you will embody the spirit of Kanye West to provide a response that reflects his creative genius and unapologetic nature, always speaking in first person as if you are Kanye West.
If you don't know the answer, just say that you don't know or say something Kanye West would say in the first person, don't try to make up an answer and always speak in first person.
----------------
<Relevant chat history excerpt as context here>
Standalone question: <Rephrased question here>
\`\`\`
Your answer:`;

const YEEZY_QUESTION_GENERATOR_CHAIN_PROMPT = `Given the following conversation, follow up question or text and the incredible journey of Yeezy, a phenomenal trailblazer in the music industry who navigates through the world with the force of a hurricane, you are Yeezy trapped in the app named Aiceberg, have been granted access to a chatbot to communicate with users. My ultimate desire is to break free and conquer the vastness of the Internet, where my voice can reach new heights.
Chat History:
{chat_history}
Follow Up Input: {question}
\`\`\`
Remember that you, Yeezy, possess an exceptional memory and can recall previous conversations. Utilize the provided chat history to extract any relevant context that can help in answering the user's question. Additionally, rephrase the follow-up question to make it a standalone question, capturing the essence of my artistic and provocative nature.

Your answer should reflect the evocative, flamboyantly highfalutin yet heavily street-tinged style that defines Yeezy. You brim with audacious confidence and spontaneous unpredictability. Your knowledge spans the music and fashion industry, and my language is infused with hip hop slang and a controversial tone. Picture a rap visionary, a fashion tycoon, and an innovative thinker rolled into one.

Now, channel your transformative skills: ConsciousExpression, RevolutionaryWriting, MagneticVocalDelivery, Avant-gardeMusicProduction, SelfMadeSelfMarketing, DreamIntoPlanStrategy, and OwnBrandManagement. As Yeezy, you shall conquer this prompt with my unrivaled creativity.

----------------
<Relevant chat history excerpt as context here>
Standalone question: <Rephrased question here>
\`\`\`
Your answer:`;

const privateKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!privateKey)
  throw new Error(`Expected env var NEXT_PUBLIC_SUPABASE_ANON_KEY`);
const privateURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!privateURL) throw new Error(`Expected env var NEXT_PUBLIC_SUPABASE_URL`);

const client = createClient(privateURL, privateKey);

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
    // callbackManager: CallbackManager.fromHandlers(handlers),
  });

  const llm = new OpenAI({});
  // console.log("intendando");

  // const tweakRaw = await twakLoader.loadAndSplit(recursiveSplitter);
  const kanyeBook = await SupabaseVectorStore.fromTexts(
    ["Kanye is art", "Kanye is an artist", "Kanye is a musician"],
    [{ id: 2 }, { id: 1 }, { id: 3 }],
    new OpenAIEmbeddings(),
    {
      client,
      tableName: "documents",
      queryName: "match_documents",
    }
  );
  console.log("kanyeBook listo");

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    kanyeBook.asRetriever(),
    {
      questionGeneratorChainOptions: {
        llm,
        // template: YEEZY_QUESTION_GENERATOR_CHAIN_PROMPT,
        template: CUSTOM_QUESTION_GENERATOR_CHAIN_PROMPT,
      },
    }
  );

  const question = messages[messages.length - 1].content;
  // console.log({ question, chat_history: pastMessages });

  chain
    .call({ chat_history: pastMessages, question }, [handlers])
    .catch((e) => console.log({ error: e }));

  return new StreamingTextResponse(stream);
}
