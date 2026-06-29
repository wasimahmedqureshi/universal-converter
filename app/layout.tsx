import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import "@/styles/globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Universal Converter – Convert Any File Format",
  description: "Free online file converter. Convert documents, images, video, audio and more.",
  keywords: ["file converter", "pdf converter", "image converter", "video converter"],
  authors: [{ name: "Universal Converter" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Navbar />
            {children}
            <Toaster position="top-right" toastOptions={{ duration: 4000, style: { borderRadius: "8px", fontSize: "14px" } }} />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
