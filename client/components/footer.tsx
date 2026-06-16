import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-[#030014] border-t border-indigo-500/10 text-slate-400 pt-20 pb-10 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[100px] bg-indigo-600/10 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-2xl font-black text-white mb-4 tracking-tighter">
              Cypher <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">AI</span>
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Empowering your career with highly advanced hybrid Retrieval-Augmented Generation (RAG) platform strategies. Semantically match your CV and succeed.
            </p>
            <div className='flex gap-4 items-center'>
              <a href="https://twitter.com" title='Twitter' target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/10 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all group">
                <FaTwitter className='text-lg group-hover:scale-110 transition-transform' />
              </a>
              <a href="https://linkedin.com" title='Linkedin' target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all group">
                <FaLinkedinIn className='text-lg group-hover:scale-110 transition-transform' />
              </a>
              <a href="https://instagram.com" title='Instagram' target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-pink-400 hover:border-pink-500/50 hover:bg-pink-500/10 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all group">
                <FaInstagram className='text-lg group-hover:scale-110 transition-transform' />
              </a>
              <a href="https://github.com" title='Github' target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-500 hover:bg-gray-800 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all group">
                <FaGithub className='text-lg group-hover:scale-110 transition-transform' />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Product</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/job-matcher" className="hover:text-indigo-400 transition-colors">AI Job Matcher</Link></li>
              <li><Link href="/flowDiagrams/atsPipeline" className="hover:text-indigo-400 transition-colors">ATS Pipeline</Link></li>
              <li><Link href="/pricing" className="hover:text-indigo-400 transition-colors">Pricing</Link></li>
              <li><Link href="/changelog" className="hover:text-indigo-400 transition-colors">Changelog</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Resources</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/documentation" className="hover:text-indigo-400 transition-colors">Documentation</Link></li>
              <li><Link href="/blog" className="hover:text-indigo-400 transition-colors">Blog</Link></li>
              <li><Link href="/community" className="hover:text-indigo-400 transition-colors">Community</Link></li>
              <li><Link href="/support" className="hover:text-indigo-400 transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-400 transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-indigo-500/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CypherTech (CodeForge). All rights reserved.</p>
          <div className="flex items-center gap-2 font-medium">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
