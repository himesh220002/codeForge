import Image from "next/image";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className=" mx-auto bg-zinc-50 font-sans dark:bg-black">
      <Navbar />
      <main className="flex w-full mx-auto max-w-7xl space-y-6 flex-col items-center justify-between bg-white dark:bg-black mb-6">
        
        <Hero />
        <div className="flex flex-col items-center gap-2">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
          Welcome to My Next.js App
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Navigate to different pages below:
        </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
