export default function Footer() {
  return (
    <footer className="flex justify-center items-center py-6 bg-gray-800 text-white">
      <p>© {new Date().getFullYear()} MyApp. All rights reserved.</p>
    </footer>
  );
}
