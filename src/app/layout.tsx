import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Hopping Cars",
  description: "Car Services App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${GeistSans.className} bg-[#1A1919]`}>
        <SessionProvider session={session}>
          <div className="mx-auto max-w-full md:max-w-4xl lg:max-w-6xl text-white">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
