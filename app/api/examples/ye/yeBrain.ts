import { OpenAI } from "langchain/llms/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChainTool } from "langchain/tools";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { VectorDBQAChain } from "langchain/chains";

const privateKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!privateKey)
  throw new Error(`Expected env var NEXT_PUBLIC_SUPABASE_ANON_KEY`);
const privateURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!privateURL) throw new Error(`Expected env var NEXT_PUBLIC_SUPABASE_URL`);

const yeBrain = async () => {
  const model = new OpenAI({ temperature: 0.4 });
  const embeddings = new OpenAIEmbeddings();
  const client = createClient(privateURL, privateKey);

  const recursiveSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });
  const twakLoader = new PDFLoader("docs/TWAK.pdf", {
    splitPages: false,
  });

  try {
    const tweakDocs = await twakLoader.loadAndSplit(recursiveSplitter);
    let vectorStore = await SupabaseVectorStore.fromExistingIndex(embeddings, {
      client,
      tableName: "documents",
      queryName: "match_documents",
    });
    if (!vectorStore) {
      vectorStore = await SupabaseVectorStore.fromDocuments(
        [...tweakDocs],
        new OpenAIEmbeddings(),
        {
          client,
          tableName: "documents",
          queryName: "match_documents",
        }
      );
    }
    const chain = VectorDBQAChain.fromLLM(model, vectorStore);
    const kanyeFactsTool = new ChainTool({
      name: "kanye-facts",
      description:
        "Kanye West Facts - useful for when you need interesting facts and information about Kanye West.",
      chain,
    });

    return kanyeFactsTool;
  } catch (error) {
    console.error({ error });
    throw new Error(`Error - yeBrain`);
  }
};

export default yeBrain;
