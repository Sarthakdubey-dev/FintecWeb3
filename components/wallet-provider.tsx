"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ethers } from "ethers"
import { CONTRACT_CONFIG, formatTokenAmount, parseTokenAmount } from "@/lib/contract-config"
import { parseUnits } from "ethers";

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
  isLoading: boolean
  error: string | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  addXP: (amount: number) => void
  claimTokens: (amount: number) => Promise<void>
  refreshBalance: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)
  const [xp, setXP] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Persist wallet connection and auto-reconnect
  useEffect(() => {
    // Load saved data from localStorage (will be updated when address changes)
    if (address) {
      loadData()
    }

    // Check if wallet was previously connected
    const wasConnected = localStorage.getItem("walletConnected") === "true"
    if (wasConnected && window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
        if (accounts && accounts.length > 0) {
          setIsConnected(true)
          setAddress(accounts[0])
          loadData() // Load wallet-specific data
          refreshBalance()
        } else {
          setIsConnected(false)
          setAddress(null)
        }
      })
    }

    // Listen for MetaMask events
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setIsConnected(true)
          setAddress(accounts[0])
          localStorage.setItem("walletConnected", "true")
          loadData() // Load wallet-specific data
          refreshBalance()
        } else {
          setIsConnected(false)
          setAddress(null)
          localStorage.removeItem("walletConnected")
        }
      }
      const handleChainChanged = () => {
        // Optionally refresh balance or force reload
        refreshBalance()
      }
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  const saveData = (newBalance: number, newXP: number) => {
    if (!address) return
    const walletKey = `financePlayground_${address}`
    localStorage.setItem(
      walletKey,
      JSON.stringify({
        balance: newBalance,
        xp: newXP,
      }),
    )
  }

  const loadData = () => {
    if (!address) return
    const walletKey = `financePlayground_${address}`
    const savedData = localStorage.getItem(walletKey)
    if (savedData) {
      const data = JSON.parse(savedData)
      setBalance(data.balance || 0)
      setXP(data.xp || 0)
    } else {
      // Reset data for new wallet
      setBalance(0)
      setXP(0)
    }
  }

  const connectWallet = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        setIsConnected(true)
        setAddress(accounts[0])
        localStorage.setItem("walletConnected", "true")
        loadData() // Load wallet-specific data
        // Fetch initial balance after connecting
        await refreshBalance()
      } else {
        alert("Please install MetaMask!")
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      setError("Failed to connect wallet")
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress(null)
    localStorage.removeItem("walletConnected")
  }

  const addXP = (amount: number) => {
    const newXP = xp + amount
    setXP(newXP)
    saveData(balance, newXP)
  }

  const claimTokens = async (amount: number) => {
    if (!address || !window.ethereum) {
      setError("Wallet not connected")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(
        CONTRACT_CONFIG.CONTRACT_ADDRESS,
        CONTRACT_CONFIG.ABI,
        signer
      )

      // Mint tokens to the user's address
      const tx = await contract.mint(parseUnits("5", 18))
      await tx.wait()

      // Refresh balance after minting
      await refreshBalance()
    } catch (err) {
      console.error("Error claiming tokens:", err)
      setError(err instanceof Error ? err.message : "Failed to claim tokens")
    } finally {
      setIsLoading(false)
    }
  }

  const refreshBalance = async () => {
    if (!address || !window.ethereum) return

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(
        CONTRACT_CONFIG.CONTRACT_ADDRESS,
        CONTRACT_CONFIG.ABI,
        provider
      )

      const balance = await contract.balanceOf(address)
      setBalance(Number(formatTokenAmount(balance)))
    } catch (err) {
      console.error("Error fetching balance:", err)
      setError("Failed to fetch balance")
    }
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
        xp,
        isLoading,
        error,
        connectWallet,
        disconnectWallet,
        addXP,
        claimTokens,
        refreshBalance,
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
