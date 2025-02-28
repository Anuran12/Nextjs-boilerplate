import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hopping Cars",
  description: "Car Services App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} bg-[#1A1919]`}>
        <div className="mx-auto max-w-full md:max-w-4xl lg:max-w-6xl text-white">
          {children}
        </div>
      </body>
    </html>
  );
}
