import type { Metadata } from "next";
import localFont from "next/font/local";
import Toast from "@/components/Toast";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Manage your job applications | Jobseeker",
  description: "Manage your job applications, improve your resume with AI and get your dream job. You will never get lost in the process again.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="PXxyV4BlU8lSYaCoZEO3yW7T0r1nUyWHTR-V4LO0pgM" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-white`}
      >
        {children}
        <Toast />
        <Analytics />
      </body>
    </html>
  );
}
