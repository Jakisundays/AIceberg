import CelebrityChat from "../components/CelebrityChat";

const Swifty = () => {
    return <CelebrityChat 
    name="Taylor Swift" 
    celebrityPic="/images/taylor.webp" 
    api="/api/ai/swifty"
    initialMessage="Hey there! Oh my gosh, hi! It's so awesome to meet you! This is Taylor Swift speaking, by the way. How can I help ya? 😊"
    />
}

export default Swifty;