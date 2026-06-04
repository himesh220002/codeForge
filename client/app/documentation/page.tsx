import Link from "next/link";

const documentationTopics = [
  {
    title: "Login flow diagram",
    description: "Open the login/auth sequence flow for the project.",
    href: "/Topics/login/loginFlowDaigram.html",
  },
];

export default function DocumentationPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="space-y-3">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-700">Documentation</p>
          <h1 className="text-3xl font-semibold">Choose a topic to open</h1>
          <p className="max-w-2xl text-zinc-600">
            The navbar now exposes the available documentation topics directly from the app.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {documentationTopics.map((topic) => (
            <article key={topic.title} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">{topic.title}</h2>
              <p className="mt-2 text-zinc-600">{topic.description}</p>
              <Link
                href={topic.href}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
              >
                Open topic
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
