import ContactForm from "../../components/contactForm";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { Mail, MessageSquare, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#030014] text-slate-100 font-sans flex flex-col relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-indigo-900/20 blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="relative z-20">
        <Navbar />
      </div>

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-12 md:py-20 relative z-10 flex flex-col">
        
        {/* Header Area */}
        <div className="mb-16">
          <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs uppercase tracking-[0.2em] text-indigo-400 font-bold mb-6 backdrop-blur-sm shadow-[0_0_20px_rgba(99,102,241,0.1)]">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Support Network Online
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            Let's build <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[pulse_4s_ease-in-out_infinite]">something great.</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-2xl drop-shadow-md">
            Whether you have a technical question, need custom RAG integration, or want to discuss enterprise pricing, our engineering team is ready to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start mb-16">
          
          {/* Left Column: Contact Info Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Info Card 1 */}
            <div className="flex items-start gap-5 p-6 rounded-3xl bg-gray-900/40 border border-indigo-500/10 backdrop-blur-md hover:bg-gray-900/60 hover:border-indigo-500/30 shadow-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] transition-all group">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Email Support</h3>
                <p className="text-slate-400 text-sm mb-3">Guaranteed response within 2 hours for enterprise clients.</p>
                <a href="mailto:support@cyphertech.online" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">support@cyphertech.online</a>
              </div>
            </div>

            {/* Info Card 2 */}
            <div className="flex items-start gap-5 p-6 rounded-3xl bg-gray-900/40 border border-indigo-500/10 backdrop-blur-md hover:bg-gray-900/60 hover:border-purple-500/30 shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] transition-all group">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
                <MessageSquare size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Community Discord</h3>
                <p className="text-slate-400 text-sm mb-3">Join 5,000+ developers discussing ATS pipelines and RAG.</p>
                <a href="#" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">Join the Server &rarr;</a>
              </div>
            </div>

            {/* Info Card 3 */}
            <div className="flex items-start gap-5 p-6 rounded-3xl bg-gray-900/40 border border-indigo-500/10 backdrop-blur-md hover:bg-gray-900/60 hover:border-teal-500/30 shadow-lg hover:shadow-[0_0_30px_rgba(20,184,166,0.1)] transition-all group">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 group-hover:bg-teal-500/20 transition-all">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Global HQ</h3>
                <p className="text-slate-400 text-sm mb-1">128 Cybernetics Way</p>
                <p className="text-slate-400 text-sm">San Francisco, CA 94107</p>
              </div>
            </div>

          </div>

          {/* Right Column: The Form */}
          <div className="lg:col-span-7">
            <div className="w-full bg-gray-900/60 backdrop-blur-xl border border-indigo-500/20 shadow-[0_0_50px_rgba(99,102,241,0.05)] rounded-3xl p-8 md:p-10 transition-all">
              <h2 className="text-3xl font-bold text-white mb-8">Send us a message</h2>
              <ContactForm />
              
              <div className="mt-8 pt-8 border-t border-indigo-500/10 flex items-center justify-between text-sm text-slate-500 font-medium">
                <p>Your privacy is secure within CodeForge.</p>
                <div className="flex items-center gap-2 text-indigo-400/80">
                  <Clock size={16} />
                  <span>24/7 Monitoring</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
