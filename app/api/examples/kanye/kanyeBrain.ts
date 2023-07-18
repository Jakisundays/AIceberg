import { OpenAI } from "langchain/llms/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChainTool } from "langchain/tools";
import {
  RecursiveCharacterTextSplitter,
  TokenTextSplitter,
} from "langchain/text_splitter";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { SRTLoader } from "langchain/document_loaders/fs/srt";
import { VectorDBQAChain } from "langchain/chains";
import fs from "fs";
import { HNSWLib } from "langchain/vectorstores/hnswlib";

// export const runtime = "edge";

// const kanyeBioLoader = new PuppeteerWebBaseLoader(
//   "https://www.biography.com/musicians/kanye-west",
//   {
//     launchOptions: {
//       headless: true,
//     },
//     gotoOptions: {
//       waitUntil: "domcontentloaded",
//     },
//   }
// );

// const kanyeMarriageLoader = new PuppeteerWebBaseLoader(
//   "https://people.com/tv/kim-kardashian-kanye-west-divorce-timeline/",
//   {
//     launchOptions: {
//       headless: true,
//     },
//     gotoOptions: {
//       waitUntil: "domcontentloaded",
//     },
//   }
// );

const recursiveSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 100,
});

const tokenSplitter = new TokenTextSplitter({
  encodingName: "gpt2",
  chunkSize: 90,
  chunkOverlap: 0,
});

// const htmlSplitter = RecursiveCharacterTextSplitter.fromLanguage("html", {
//   chunkSize: 175,
//   chunkOverlap: 20,
// });

const model = new OpenAI({ temperature: 0 });
const vectorStorePath = "data.kanyeBible";

const kanyeBrain = async () => {
  const twakLoader = new PDFLoader("docs/TWAK.pdf", {
    splitPages: false,
  });
  const jeenYuhs1Loader = new SRTLoader("docs/jeen-yuhs-E01.srt");
  const jeenYuhs2Loader = new SRTLoader("docs/jeen-yuhs-E02.srt");
  const jeenYuhs3Loader = new SRTLoader("docs/jeen-yuhs-E03.srt");
  try {
    const jeenYuhs1Docs = await jeenYuhs1Loader.loadAndSplit(tokenSplitter);
    const jeenYuhs2Docs = await jeenYuhs2Loader.loadAndSplit(tokenSplitter);
    const jeenYuhs3Docs = await jeenYuhs3Loader.loadAndSplit(tokenSplitter);
    // const kanyeBioDocs = await kanyeBioLoader.loadAndSplit(htmlSplitter);
    // const kanyeMarriageDocs = await kanyeMarriageLoader.loadAndSplit(
    //   htmlSplitter
    // );
    let kanyeBook;
    if (fs.existsSync(vectorStorePath)) {
      console.log("existe vectorDB");
      kanyeBook = await HNSWLib.load(vectorStorePath, new OpenAIEmbeddings());
    } else {
      console.log("no existe vectorDB");
      const tweakDocs = await twakLoader.loadAndSplit(recursiveSplitter);
      const jeenYuhs1Docs = await jeenYuhs1Loader.loadAndSplit(tokenSplitter);
      const jeenYuhs2Docs = await jeenYuhs2Loader.loadAndSplit(tokenSplitter);
      const jeenYuhs3Docs = await jeenYuhs3Loader.loadAndSplit(tokenSplitter);
      kanyeBook = await HNSWLib.fromDocuments(
        [...tweakDocs, ...jeenYuhs1Docs, ...jeenYuhs2Docs, ...jeenYuhs3Docs],
        new OpenAIEmbeddings()
      );
    }
    await kanyeBook.save(vectorStorePath);

    const chain = VectorDBQAChain.fromLLM(model, kanyeBook);

    const kanyeFactsTool = new ChainTool({
      name: "kanye-facts",
      description:
        "Kanye West Facts - useful for when you need interesting facts and information about Kanye West.",
      chain,
    });

    return kanyeFactsTool;
  } catch (e) {
    console.log({ e });
    throw e;
  }
};

export default kanyeBrain;
