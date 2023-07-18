"use client";

import Header from "@/components/Header";
import { useChat } from "ai/react";
import Image from "next/image";

export default function Other() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/ai/yeezy",
      initialMessages: [
        {
          content:
            "Yo, what's up world? It's your boy Yeezy, the one and only creative genius. How can I inspire you today?",
          id: "kanye",
          role: "system",
        },
      ],
    });
  return (
    <div
      className="
        bg-neutral-900 
        rounded-lg 
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
      "
    >
      <Header>
        <div className="mt-2">
          <div
            className="
              flex 
              flex-col 
              md:flex-row 
              items-center 
              gap-x-5
            "
          >
            <div className="relative h-28 w-28 lg:h-38 lg:w-38">
              <Image
                className="object-cover"
                fill
                src="/images/kanye.webp"
                alt="Playlist"
              />
            </div>
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <p className="hidden md:block font-semibold text-sm">
                Chatting with
              </p>
              <h3
                className="
                  text-white 
                  text-2xl 
                  sm:text-3xl 
                  lg:text-5xl 
                  font-bold
                "
              >
                Kanye West
              </h3>
            </div>
          </div>
        </div>
      </Header>
      <div className="w-full h-[63%] sm:h-[69%] lg:h-[68%] xl:h-[72%] 2xl:h-[85%] flex flex-col justify-between px-6 py-4 2xl:py-6 2xl:pt-26 xl:px-24 lg:px-24 md:px-16 sm:px-4 stretch gap-4">
        <div className="overflow-y-auto h-full">
          {messages.length > 0
            ? messages.map((m, i) => {
                if (m.role === "user") {
                  return (
                    <div key={m.id} className="chat chat-end">
                      <div className="chat-image avatar">
                        <div className="w-12 rounded-full">
                          <Image
                            fill
                            alt="user"
                            src="/images/bart.webp"
                            className="rounded-full"
                          />
                        </div>
                      </div>
                      <p className="chat-bubble">{m.content}</p>
                    </div>
                  );
                } else {
                  return (
                    <div key={i} className="chat chat-start">
                      <div className="chat-image avatar">
                        <div className="w-12 rounded-full">
                          <Image
                            src="/images/kanye.webp"
                            fill
                            alt="Kanye West"
                            className="rounded-full"
                          />
                        </div>
                      </div>
                      <div className="chat-bubble">
                        {isLoading && i === messages.length - 1 ? (
                          <span className="loading loading-dots loading-md"></span>
                        ) : (
                          m.content
                        )}
                      </div>
                    </div>
                  );
                }
              })
            : null}
        </div>
        <form onSubmit={handleSubmit} className="self-center w-3/4">
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 mb-1 shadow-xl"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
        </form>
      </div>
    </div>
  );
}
