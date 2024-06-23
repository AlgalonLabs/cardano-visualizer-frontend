import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "./theme-provider";
import React from "react";
import {NavigationBar} from "@/components/navigation-bar";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Cardano Visualizer",
    description: "Cardano's Graph Visualizer",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
        <body className={inter.className}>

        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <NavigationBar/>
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}
