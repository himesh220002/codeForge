import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
export default function Footer() {
  return (
    <footer className="flex flex-col gap-10 justify-center items-center py-8 bg-gray-950 border-t border-slate-900 text-slate-500 text-xs">
      <div className='flex gap-5 items-center justify-center'>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-purple-200 rounded hover:text-blue-500">
          <FaFacebookF className='text-lg'/>
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-purple-200 rounded hover:text-blue-500">
          <FaTwitter className='text-lg'/>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-purple-200 rounded hover:text-pink-500">
          <FaInstagram className='text-lg'/>
        </a>
      </div>
      <p>© {new Date().getFullYear()} CodeForge. All rights reserved.</p>
    </footer>
  );
}

