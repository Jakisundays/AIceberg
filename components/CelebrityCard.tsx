"use client";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CelebrityCardProps {
  name: string;
  description: string;
  image: string;
  href: string;
  disabled?: boolean;
}

const CelebrityCard = ({
  name,
  description,
  image,
  href,
  disabled = false,
}: CelebrityCardProps) => {
  const authModal = useAuthModal();
  const { user } = useUser();
  const router = useRouter();
  const handleChat = () => {
    if (!user) {
      return authModal.onOpen();
    }
    return router.push(href);
  };

  return (
    <div className="card w-72 bg-neutral-400/5 hover:bg-neutral-400/10 transition shadow-xl">
      <figure className="px-10 pt-10">
        <img src={image} alt="Shoes" className="rounded-xl" />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{name}</h2>
        <p>{description}</p>
        {/* <Link href={href} className="card-actions mt-1"> */}
        <button onClick={handleChat} disabled={disabled} className="btn btn-primary transition">
          {disabled ? "Coming soon" : "Chat now"}
        </button>
        {/* </Link> */}
      </div>
    </div>
  );
};

export default CelebrityCard;
