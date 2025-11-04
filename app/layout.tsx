import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import LenisProvider from "@/context/LenisProvider";
import { Poppins } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import { SocketProvider } from "@/hooks/videosocket";
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"], // optional, adjust as needed
});

export const metadata: Metadata = {
  title: "SkillX - Worlds Leading Platform",
  description: "SkillX - Worlds Leading Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      {/* @tsignore*/ }
      <body       className={`font-poppins antialiased bg-zinc-900`}  style={{ fontFamily: "var(--font-poppins), sans-serif",}}
      >
         <LenisProvider>
          <AppProvider>
              <Navbar/>
            <SocketProvider>
              {children}
            </SocketProvider>
          </AppProvider>
          </LenisProvider>
      </body>
    </html>
  );
}
