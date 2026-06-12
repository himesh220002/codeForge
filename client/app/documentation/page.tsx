import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ArrowRight, BookOpen, Search, LogIn, Mail } from "lucide-react";

const documentationTopics = [
  {
    title: "AI Job Search RAG Flow",
    description: "Visualize the multi-domain RAG pipeline, ChromaDB nearest-neighbor logic, and Llama-Nemotron reranking workflow.",
    href: "/flowDiagrams/aijobsearch",
    icon: Search,
    colorClass: "from-indigo-500 to-purple-600",
    glowClass: "group-hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] group-hover:border-indigo-500/50"
  },
  {
    title: "Login Architecture",
    description: "Visualize the secure authentication sequence flow, including HttpOnly cookie issuance.",
    href: "/flowDiagrams/loginFlow",
    icon: LogIn,
    colorClass: "from-teal-500 to-emerald-600",
    glowClass: "group-hover:shadow-[0_0_30px_rgba(20,184,166,0.2)] group-hover:border-teal-500/50"
  },
  {
    title: "Contact Form Flow",
    description: "Visualize the contact submission lifecycle and validation layers.",
    href: "/flowDiagrams/contactFlow",
    icon: Mail,
    colorClass: "from-pink-500 to-rose-600",
    glowClass: "group-hover:shadow-[0_0_30px_rgba(236,72,153,0.2)] group-hover:border-pink-500/50"
  },
];

export default function DocumentationPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-slate-100 font-sans">
      <Navbar />

      <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-16 relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <section className="mb-16 relative z-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-indigo-500/10 text-xs uppercase tracking-[0.2em] text-slate-400 font-bold mb-6">
            <BookOpen size={14} className="text-blue-400" />
            System Architecture
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Documentation Hub
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Explore the deep technical flowcharts driving Cypher. Dive into the advanced Retrieval-Augmented Generation workflows, security models, and system logic.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 relative z-10">
          {documentationTopics.map((topic, idx) => (
            <Link
              key={topic.title}
              href={topic.href}
              className={`group flex flex-col justify-between p-6 rounded-2xl bg-gray-900/40 shadow-md shadow-blue-800/10 hover:shadow-blue-800/40 backdrop-blur-sm transition-all duration-300 ${topic.glowClass} ${idx === 0 ? 'md:col-span-2 lg:col-span-3 lg:flex-row lg:items-center' : ''}`}
            >
              <div className={idx === 0 ? "lg:w-2/3 lg:pr-8" : ""}>
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${topic.colorClass} flex items-center justify-center text-white mb-6 shadow-lg`}>
                  <topic.icon size={22} />
                </div>
                <h2 className="text-xl font-bold text-white mb-3  group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-colors">
                  {topic.title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {topic.description}
                </p>
              </div>

              <div className={`mt-auto ${idx === 0 ? "lg:mt-0 lg:w-1/3 lg:flex lg:justify-end" : ""}`}>
                <div className="inline-flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-lg bg-slate-800/50 group-hover:bg-slate-800 transition-colors">
                  View Flowchart
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
