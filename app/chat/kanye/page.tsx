import CelebrityChat from "../components/CelebrityChat";
import kanyeImg from "../../../public/images/kanye.webp";

const Kanye = () => {
  return (
    <CelebrityChat
      name="Kanye"
      celebrityPic={kanyeImg}
      api="/api/ai/yeezy"
      initialMessage="Yo, what's up world? It's your boy Yeezy, the one and only creative genius. How can I inspire you today?"
    />
  );
};

export default Kanye;
