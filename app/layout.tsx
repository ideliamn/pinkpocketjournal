import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PinkPocketJournal 💖",
  description: "Track your money effortlessly ✨",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-pink-50 text-gray-800">
        {children}
      </body>
    </html>
  );
}