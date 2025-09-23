export const deploymentUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const siteConfig = {
  name: "Aurora",
  description:
    "A minimal Next.js marketing template with a hero, feature highlights, and calls to action to launch faster.",
  url: deploymentUrl,
  locale: "en_US",
  creator: "Aurora Team",
  publisher: "Aurora",
  authors: [
    {
      name: "Aurora Team",
      url: deploymentUrl,
    },
  ],
  keywords: [
    "Next.js template",
    "React landing page",
    "SaaS marketing page",
    "Tailwind CSS",
    "Aurora",
  ],
  twitter: "@aurora_template",
  ogImage: "/images/social-card.png",
} as const;
