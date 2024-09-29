import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import ProgressBarProvider from "@/lib/ProgressBar";
import Navbar from "../components/utils/Navbar";
const inter = Inter({ subsets: ["latin"] });
import AuthProviders from "@/lib/AuthProvider";
import { Toaster } from "react-hot-toast";
import Footer from "../components/utils/Footer";

export const metadata: Metadata = {
  title: "SKL Moklet",
  description: "to create skilled mokleters",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <AuthProviders>
      <ProgressBarProvider>
        <Navbar />
        {children}
        <Toaster />
       </ProgressBarProvider>
       <Footer/>
      </AuthProviders>
        </body>
    </html>
  );
}
