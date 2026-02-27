import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CopyGuard from "@/components/CopyGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "세특 큐레이터 | 22개정 교육과정 이공계 세특 추천",
  description:
    "2022 개정 교육과정 기반 이공계 세특 탐구 주제 큐레이션 및 프리미엄 보고서 생성 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} antialiased`}>
        <CopyGuard>
          <Navbar />
          {children}
        </CopyGuard>
      </body>
    </html>
  );
}
