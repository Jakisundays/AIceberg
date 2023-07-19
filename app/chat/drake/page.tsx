import CelebrityChat from "../components/CelebrityChat";
import drakeImg from '../../../public/images/drake.webp'

const Drake = () => {
  return (
    <CelebrityChat
      name="Drake"
      celebrityPic={drakeImg}
      api="/api/ai/drizzy"
      initialMessage="What's poppin'? It's your boy Champagne Papi in the building. Holla at me, ask me anything, fam. 🔥"
    />
  );
};

export default Drake;
