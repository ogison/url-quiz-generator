const features = [
  {
    title: "Composable sections",
    description:
      "Pick and choose the pieces you need: hero, features, testimonials, calls to action, and ship in minutes.",
  },
  {
    title: "Polished defaults",
    description:
      "Thoughtful typography, balanced spacing, and accessible contrast ratios baked in from the start.",
  },
  {
    title: "Production ready",
    description:
      "TypeScript, App Router, and Tailwind CSS already wired together so you can focus on product, not plumbing.",
  },
];

const checklist = [
  "Responsive layouts out of the box",
  "Dark-friendly palette",
  "SEO-friendly metadata",
];

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_55%)]" />
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8">
        <span className="text-lg font-semibold tracking-tight">Aurora</span>
        <nav className="hidden gap-6 text-sm font-medium text-slate-300 sm:flex">
          <a className="transition hover:text-slate-100" href="#features">
            Features
          </a>
          <a className="transition hover:text-slate-100" href="#benefits">
            Why Aurora
          </a>
          <a className="transition hover:text-slate-100" href="#cta">
            Get Started
          </a>
        </nav>
        <a
          className="rounded-full border border-sky-400 px-4 py-2 text-sm font-semibold text-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-400/10"
          href="#cta"
        >
          Preview Demo
        </a>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-24 px-6 pb-24">
        <section className="mt-12 text-center" aria-labelledby="hero-heading">
          <p className="mx-auto w-fit rounded-full border border-slate-800 bg-slate-900/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
            NEXT.JS TEMPLATE
          </p>
          <h1
            id="hero-heading"
            className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl"
          >
            Launch a beautiful product story without touching a design file.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-slate-300 sm:text-lg">
            Aurora gives you a clean, modern starting point for SaaS, startup,
            and product marketing pages. Keep what works, swap what
            doesn&apos;t, and publish faster than ever.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              className="inline-flex items-center gap-2 rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-400/30 transition hover:-translate-y-1"
              href="#cta"
            >
              Build with Aurora
            </a>
            <a
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-slate-50"
              href="https://nextjs.org"
              target="_blank"
              rel="noreferrer"
            >
              View Next.js docs
            </a>
          </div>
        </section>

        <section
          id="features"
          className="space-y-12"
          aria-labelledby="features-heading"
        >
          <div className="flex flex-col gap-4 text-center sm:text-left">
            <h2
              id="features-heading"
              className="text-3xl font-semibold tracking-tight"
            >
              Everything you need to ship your MVP landing page
            </h2>
            <p className="text-base text-slate-300 sm:max-w-3xl">
              Swap in your copy, wire up your analytics, and go live. Aurora
              handles layout, responsiveness, and accessible defaults so you can
              focus on talking to customers.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-left shadow-lg shadow-slate-950/40 transition hover:border-slate-700 hover:shadow-slate-900/30"
              >
                <h3 className="text-lg font-semibold text-slate-50">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm text-slate-300">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="benefits"
          className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]"
          aria-labelledby="benefits-heading"
        >
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-10 shadow-xl shadow-slate-950/40">
            <h2
              id="benefits-heading"
              className="text-2xl font-semibold tracking-tight"
            >
              Opinionated defaults, flexible foundation
            </h2>
            <p className="mt-4 text-base text-slate-300">
              Aurora stays out of your way. Keep the sections you love, or
              replace them with your own components. The layout scales
              gracefully from mobile to widescreen displays.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-200">
              {checklist.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-400/20 text-sky-300">
                    +
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-between gap-6 rounded-3xl border border-slate-800 bg-slate-900/40 p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Trusted by teams
              </p>
              <p className="mt-4 text-5xl font-semibold text-slate-100">12k+</p>
              <p className="mt-2 text-sm text-slate-300">
                Developers use Aurora to launch their product ideas faster.
              </p>
            </div>
            <div className="space-y-3 text-sm text-slate-300">
              <p>
                &ldquo;We replaced our legacy marketing page with Aurora in a
                weekend. The result feels bespoke without the bespoke
                effort.&rdquo;
              </p>
              <p className="text-slate-400">
                - Marisol Vega, Product Lead at Northwind
              </p>
            </div>
          </div>
        </section>

        <section
          id="cta"
          className="rounded-3xl border border-sky-500/40 bg-gradient-to-r from-sky-500/30 via-sky-500/10 to-transparent px-8 py-12 text-center shadow-[0_40px_80px_-40px_rgba(56,189,248,0.55)]"
          aria-labelledby="cta-heading"
        >
          <h2
            id="cta-heading"
            className="text-3xl font-semibold tracking-tight text-slate-50"
          >
            Ready to launch your next idea?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-200">
            Clone the repo, swap in your product details, and go live today.
            Aurora keeps things simple without feeling bare-bones.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-1"
              href="https://github.com/new"
              target="_blank"
              rel="noreferrer"
            >
              Duplicate to GitHub
            </a>
            <a
              className="inline-flex items-center gap-2 rounded-full border border-slate-200/40 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-100/60"
              href="mailto:hello@example.com"
            >
              Contact the team
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/80 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-slate-200">Aurora Template</p>
          <div className="flex flex-wrap gap-4">
            <a
              className="transition hover:text-slate-200"
              href="https://nextjs.org"
              target="_blank"
              rel="noreferrer"
            >
              Next.js
            </a>
            <a
              className="transition hover:text-slate-200"
              href="https://tailwindcss.com"
              target="_blank"
              rel="noreferrer"
            >
              Tailwind CSS
            </a>
            <a
              className="transition hover:text-slate-200"
              href="mailto:hello@example.com"
            >
              Support
            </a>
          </div>
          <p>&copy; {year} Aurora. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
