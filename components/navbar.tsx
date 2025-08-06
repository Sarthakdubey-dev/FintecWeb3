"use client"

import Link from "next/link"
import { useWallet } from "./wallet-provider"
import { Button } from "@/components/ui/button"
import { Wallet, Trophy, Zap, BookOpen } from "lucide-react"

export function Navbar() {
  const { isConnected, address, balance, xp, connectWallet, disconnectWallet } = useWallet()

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-teal-600" />
              <span className="text-xl font-bold text-slate-900">FinancePlay</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link href="/courses" className="text-slate-600 hover:text-slate-900 font-medium">
                Courses
              </Link>
              <Link href="/wallet" className="text-slate-600 hover:text-slate-900 font-medium">
                Wallet
              </Link>
              <Link href="/accounts" className="text-slate-600 hover:text-slate-900 font-medium">
                Your Account
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isConnected && (
              <>
                <div className="hidden sm:flex items-center space-x-4">
                  <div className="flex items-center space-x-1 bg-amber-50 px-3 py-1 rounded-full">
                    <Zap className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">{xp} XP</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-full">
                    <Trophy className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">{balance} FET</span>
                  </div>
                </div>
              </>
            )}

            {isConnected ? (
              <div className="flex items-center space-x-2">
                <span className="hidden sm:block text-sm text-slate-600">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnectWallet}
                  className="flex items-center space-x-1 bg-transparent"
                >
                  <Wallet className="h-4 w-4" />
                  <span>Disconnect</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                className="bg-teal-600 hover:bg-teal-700 text-white flex items-center space-x-2"
              >
                <Wallet className="h-4 w-4" />
                <span>Connect Wallet</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
