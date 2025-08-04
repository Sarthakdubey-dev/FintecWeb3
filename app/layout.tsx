import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { WalletProvider } from "@/components/wallet-provider"
import { Navbar } from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Financial Literacy Playground",
  description: "Learn personal finance and earn tokens",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main>{children}</main>
          </div>
        </WalletProvider>
      </body>
    </html>
  )
}
