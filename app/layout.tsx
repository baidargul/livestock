import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Loading from "@/components/ui/Loading";
import { SocketProvider } from "@/socket-client/SocketWrapper";
import Dialog from "@/components/ui/Dialog";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Janwar Markaz",
  description: "Markaz to help you buy and sell animals in Pakistan digitally, and connect with other animal lovers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-w-[350px] overflow-x-hidden antialiased`}
      >
        <SocketProvider>
          <Loading>
            <Dialog>
              {children}
            </Dialog>
          </Loading>
        </SocketProvider>
      </body>
    </html>
  );
}
