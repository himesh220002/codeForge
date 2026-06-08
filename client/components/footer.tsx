export default function Footer() {
  return (
    <footer className="flex justify-center items-center py-8 bg-gray-950 border-t border-slate-900 text-slate-500 text-xs">
      <p>© {new Date().getFullYear()} CodeForge. All rights reserved.</p>
    </footer>
  );
}

