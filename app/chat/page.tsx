import CelebrityCard from "@/components/CelebrityCard";
import Header from "@/components/Header";

export default async function Chat() {
  return (
    <section className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header className="from-black">
        <div className="mb-2">
          <h1 className="text-3xl">Choose a celebrity to chat with</h1>
        </div>
      </Header>
      <div className="grid grid-col-2 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 gap-2 mt-6 justify-items-center">
        <CelebrityCard
          name="Kanye West"
          description="When I talk it's like a painting."
          image="/images/kanye.webp"
          href="/chat/kanye"
        />
        <CelebrityCard
          name="Taylor Swift"
          description="Never forget the essence of your spark!"
          image="/images/taylor.webp"
          href="/chat/swifty"
        />
        <CelebrityCard
          name="Drake"
          description="Count your blessings, not problems."
          image="/images/drake.webp"
          href="/chat/drake"
        />
      </div>
    </section>
  );
}
