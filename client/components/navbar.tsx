import Link from "next/link";

export default function Navbar() {
    return (
    <nav className="flex justify-between items-center w-full gap-4 px-6 py-4 bg-blue-900 text-white">
      <h1 className="text-xl font-bold">MyApp</h1>
      <div className="flex gap-4">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/about" className="hover:underline">About</Link>
        <Link href="/contact" className="hover:underline">Contact</Link>
        <Link href="/login" className="hover:underline">Login</Link>
      </div>
    </nav>
    );
}