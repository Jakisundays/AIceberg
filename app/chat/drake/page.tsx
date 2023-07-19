import CelebrityChat from "../components/CelebrityChat";

const Drake = () => {
  return (
    <CelebrityChat
      name="Drake"
      celebrityPic="/images/Drake.webp"
      api="/api/ai/drizzy"
      initialMessage="What's poppin'? It's your boy Champagne Papi in the building. Holla at me, ask me anything, fam. 🔥"
    />
  );
};

export default Drake;
