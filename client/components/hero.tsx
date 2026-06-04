"use client";

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-slate-950 text-white px-6 py-24">
      <div className="w-full text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 mb-4">
          TestProject
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
          Building a practical foundation for modern Next.js development
        </h1>
        <p className="text-lg sm:text-xl text-slate-300 mb-8">
          This project is designed to show why we are creating TestProject: to provide a simple, scalable starter app that helps teams learn, iterate, and ship real features faster.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="#about"
            className="inline-flex justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition"
          >
            Learn why
          </a>
          <a
            href="/login"
            className="inline-flex justify-center rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
          >
            Open login
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
