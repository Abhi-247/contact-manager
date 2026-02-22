import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./_components/navbar";



export const metadata: Metadata = {
  title: "Contact Manager",
  description: "A Simple contact management App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <div className="min-h-screen bg-gray-100">
          <Navbar/>
          <main className="container mx-auto p-4">
          {children}
          </main>
          
          </div>
      </body>
    </html>
  );
}
