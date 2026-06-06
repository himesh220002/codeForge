"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {

  const [userName, setUserName] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    setUserName(storedName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("adminUnlocked");
    window.location.href = "/login"; // redirect to login
  };


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
        <div className="relative">
      <button 
      onClick={() => setOpen(!open)}
      className="px-4 py-2 bg-green-500 rounded">{userName}</button>
      {open && (
            <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-lg">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          )}
          </div>
    ) : (
      <Link href="/login" className="hover:underline">Login</Link>
    ) }
    </nav>
  );
}