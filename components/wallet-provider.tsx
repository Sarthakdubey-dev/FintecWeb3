"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}

interface WalletContextType {
  isConnected: boolean
  address: string | null
  balance: number
  xp: number
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  addXP: (amount: number) => void
  claimTokens: (amount: number) => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)
  const [xp, setXP] = useState(0)

  useEffect(() => {
    // Load saved data from localStorage
    const savedData = localStorage.getItem("financePlayground")
    if (savedData) {
      const data = JSON.parse(savedData)
      setBalance(data.balance || 0)
      setXP(data.xp || 0)
    }
  }, [])

  const saveData = (newBalance: number, newXP: number) => {
    localStorage.setItem(
      "financePlayground",
      JSON.stringify({
        balance: newBalance,
        xp: newXP,
      }),
    )
  }

  const connectWallet = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        setIsConnected(true)
        setAddress(accounts[0])
      } else {
        alert("Please install MetaMask!")
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress(null)
  }

  const addXP = (amount: number) => {
    const newXP = xp + amount
    setXP(newXP)
    saveData(balance, newXP)
  }

  const claimTokens = (amount: number) => {
    const newBalance = balance + amount
    setBalance(newBalance)
    saveData(newBalance, xp)
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
        xp,
        connectWallet,
        disconnectWallet,
        addXP,
        claimTokens,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
