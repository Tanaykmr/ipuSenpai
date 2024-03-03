import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React, {ReactNode} from "react";
import Header from "@/components/ui/header/Header";
import {FloatingNav} from "@/components/ui/navbar/FloatingNavbar";
import { SpeedInsights } from "@vercel/speed-insights/next"
import {cn} from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const navItems = [
    {
        name: "Home",
        link: "/",
    },
    {
        name: "Ranklist",
        link: "/ranklist",
    },
    {
        name: "Student Profile",
        link: "/student",
    },
    {
        name: "Search",
        link: "/search",
    },
    {
        name: "Statistics",
        link: "/statistics",
    },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "flex flex-col")}>
      <FloatingNav navItems={navItems} />
      {children}
      <SpeedInsights />
      </body>
    </html>
  );
}

