"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {

  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    setUserName(storedName);
  }, []);


  return (
    <nav className="flex w-full items-center justify-between gap-4 bg-blue-900 px-6 py-4 text-white">
      <h1 className="text-xl font-bold">MyApp</h1>
      <div className="flex items-center gap-4">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/documentation" className="hover:underline">Documentation</Link>
        <Link href="/about" className="hover:underline">About</Link>
        <Link href="/contact" className="hover:underline">Contact</Link>
      </div>

      {userName ? (
      <button className="px-4 py-2 bg-green-500 rounded">{userName}</button>
    ) : (
      <Link href="/login" className="hover:underline">Login</Link>
    ) }
    </nav>
  );
}