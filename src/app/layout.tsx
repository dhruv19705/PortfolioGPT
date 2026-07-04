import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-gpt-tau.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Dhruv Amit Shah - AI & Data Science Engineer | Portfolio",
    template: "%s | Dhruv Amit Shah Portfolio"
  },
  description: "Portfolio of Dhruv Amit Shah — AI & Data Science engineer, IEEE researcher, and Veefin intern. Projects in blockchain forensics, RAG, NLP, and quantitative finance.",
  keywords: [
    "Dhruv Amit Shah",
    "AI Engineer",
    "Data Science Engineer",
    "Machine Learning",
    "Blockchain",
    "NLP",
    "RAG",
    "Portfolio",
    "Python Developer",
    "Next.js",
    "React",
    "FastAPI",
    "LangChain",
    "IEEE Research",
    "CipherCop",
    "ChainBreak",
    "Internship",
    "Veefin",
    "Quantitative Finance",
    "AI Chatbot",
  ],
  authors: [
    {
      name: "Dhruv Amit Shah",
      url: siteUrl,
    },
  ],
  creator: "Dhruv Amit Shah",
  publisher: "Dhruv Amit Shah",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Dhruv Amit Shah - AI & Data Science Engineer | Portfolio",
    description: "AI & Data Science portfolio with IEEE research, blockchain forensics (ChainBreak), RAG systems, and finance ML projects.",
    siteName: "Dhruv Amit Shah Portfolio",
    images: [
      {
        url: `${siteUrl}/portfolio.png`,
        width: 1200,
        height: 630,
        alt: "Dhruv Amit Shah - Professional Portfolio with AI Chatbot",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhruv Amit Shah - AI & Data Science Engineer",
    description: "AI & Data Science portfolio — IEEE research, ChainBreak, RAG, NLP, and finance ML projects.",
    creator: "@Dhruvainbatu",
    site: "@Dhruvainbatu",
    images: [{
      url: `${siteUrl}/portfolio.png`,
      alt: "Dhruv Amit Shah Professional Portfolio"
    }],
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      }
    ],
    shortcut: "/favicon.ico?v=2",
    apple: "/apple-touch-icon.svg?v=2",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: siteUrl,
  },
  category: "technology",
  classification: "Portfolio Website",
  other: {
    "google-site-verification": "your-google-verification-code-here",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="canonical" href={siteUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Dhruv Amit Shah",
              "jobTitle": "AI & Data Science Engineer",
              "url": siteUrl,
              "image": `${siteUrl}/profile.jpeg`,
              "sameAs": [
                "https://github.com/dhruv19705",
                "https://www.linkedin.com/in/dhruv-shah-670141282",
                "https://x.com/Dhruvainbatu"
              ],
              "worksFor": {
                "@type": "Organization",
                "name": "Veefin"
              },
              "alumniOf": {
                "@type": "Organization",
                "name": "KJ Somaiya College of Engineering"
              },
              "knowsAbout": [
                "Artificial Intelligence",
                "Machine Learning",
                "Natural Language Processing",
                "Blockchain Analytics",
                "Retrieval-Augmented Generation",
                "Quantitative Finance",
                "Cybersecurity Research"
              ],
              "description": "AI & Data Science engineer and IEEE researcher. Summer Intern at Veefin building RAG and enterprise AI systems. Creator of ChainBreak blockchain forensics platform."
            })
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <main className="flex min-h-screen flex-col">
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
