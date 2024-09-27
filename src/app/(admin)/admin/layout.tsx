import Sidebar from "@/app/components/utils/Sidebar";
import type { Metadata } from "next";
import "./../../globals.css";
import AuthProviders from "@/lib/AuthProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Admin | SKL MOklet",
  description: "Find the Best Competition Partner to Succeed Together!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex">
          <AuthProviders>
            <Sidebar />
            {children}
          </AuthProviders>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
