import { Pixelify_Sans } from "next/font/google";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center bg-pink-100">
      <h1 className={`flex h-screen items-center justify-center ${pixelify.className} text-xl`}>
        Pink Pocket Journal 🎀
      </h1>
    </main>
  );
}