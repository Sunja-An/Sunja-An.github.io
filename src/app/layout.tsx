import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

const pretendardJP = localFont({
  src: "./fonts/PretendardJPVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendardJP",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const oswald = localFont({
  src: "./fonts/Oswald_VariableFont_wght.ttf",
  variable: "--font-oswald",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "JapanBlog",
  description: "Korean Japanese Japan Exchange Experience Blog [2024 ~ 2025]",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${pretendard.variable} ${pretendardJP.variable}`}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pretendard.variable} ${oswald.variable} scroll-smooth antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
