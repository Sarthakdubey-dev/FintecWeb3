"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/components/wallet-provider"

interface Transaction {
  amount: number
  category: string
  note: string
  type: "income" | "expense"
  timestamp: number
}

interface Account {
  name: string
  balance: number
  transactions: Transaction[]
}

export default function FinanceLabPage() {
  const { isConnected, address, connectWallet } = useWallet()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [name, setName] = useState("")
  const [balance, setBalance] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  // Transaction form state
  const [txAmount, setTxAmount] = useState("")
  const [txCategory, setTxCategory] = useState("")
  const [txNote, setTxNote] = useState("")
  const [txType, setTxType] = useState<"income" | "expense">("income")
  const [txError, setTxError] = useState<string | null>(null)

  // Key for localStorage per wallet
  const storageKey = address ? `accounts_${address}` : null

  // Load accounts from localStorage
  useEffect(() => {
    if (!storageKey) return
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      setAccounts(JSON.parse(saved))
    } else {
      setAccounts([])
    }
  }, [storageKey])

  // Save accounts to localStorage
  useEffect(() => {
    if (!storageKey) return
    localStorage.setItem(storageKey, JSON.stringify(accounts))
  }, [accounts, storageKey])

  // Add Account
  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!name.trim()) {
      setError("Account name is required.")
      return
    }
    const parsedBalance = parseFloat(balance)
    if (isNaN(parsedBalance) || parsedBalance < 0) {
      setError("Initial balance must be a non-negative number.")
      return
    }
    setAccounts(prev => [
      ...prev,
      { name: name.trim(), balance: parsedBalance, transactions: [] }
    ])
    setName("")
    setBalance("")
  }

  // Clear all accounts
  const handleClearAccounts = () => {
    setAccounts([])
    setExpandedIdx(null)
  }

  // Add Transaction to Account
  const handleAddTransaction = (accountIdx: number, e: React.FormEvent) => {
    e.preventDefault()
    setTxError(null)
    const amount = parseFloat(txAmount)
    if (isNaN(amount) || amount <= 0) {
      setTxError("Amount must be a positive number.")
      return
    }
    if (!txCategory.trim()) {
      setTxError("Category is required.")
      return
    }
    // Prepare transaction
    const transaction: Transaction = {
      amount,
      category: txCategory.trim(),
      note: txNote.trim(),
      type: txType,
      timestamp: Date.now(),
    }
    setAccounts(prev => prev.map((acc, idx) => {
      if (idx !== accountIdx) return acc
      // Update balance
      const newBalance = txType === "income" ? acc.balance + amount : acc.balance - amount
      return {
        ...acc,
        balance: newBalance,
        transactions: [transaction, ...acc.transactions],
      }
    }))
    // Reset form
    setTxAmount("")
    setTxCategory("")
    setTxNote("")
    setTxType("income")
  }

  // Dashboard summary
  const allTransactions = accounts.flatMap(acc => acc.transactions)
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
  const totalIncome = allTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = allTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const savingsRatio = totalIncome > 0 ? ((totalBalance / totalIncome) * 100).toFixed(1) : "0"

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-2 py-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          <span role="img" aria-label="lab">🧪</span> My Finance Lab
        </h1>
        {/* Dashboard Summary */}
        <div className="bg-white rounded-xl shadow p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-lg font-semibold text-gray-700">Net Balance: <span className="text-blue-600">₹{totalBalance.toFixed(2)}</span></div>
            <div className="text-sm text-gray-500 mt-1">Income: <span className="text-green-600 font-medium">+₹{totalIncome.toFixed(2)}</span> &nbsp; | &nbsp; Expenses: <span className="text-red-500 font-medium">-₹{totalExpense.toFixed(2)}</span></div>
          </div>
          <div className="text-sm text-gray-500">Savings Ratio: <span className="text-blue-500 font-semibold">{savingsRatio}%</span></div>
        </div>
        {!isConnected ? (
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <p className="mb-4 text-gray-700">Connect your wallet to manage your accounts.</p>
            <button
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            {/* Add Account Form */}
            <form
              onSubmit={handleAddAccount}
              className="bg-white rounded-xl shadow p-6 mb-6 flex flex-col gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
                  placeholder="e.g. Bank, Wallet, Savings"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Balance</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={balance}
                  onChange={e => setBalance(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
                  placeholder="0.00"
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
              >
                Add Account
              </button>
            </form>

            {/* Total Balance & Clear Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
              <div className="text-lg font-semibold text-gray-700">
                Accounts: <span className="text-blue-600">{accounts.length}</span>
              </div>
              {accounts.length > 0 && (
                <button
                  onClick={handleClearAccounts}
                  className="bg-red-100 hover:bg-red-200 text-red-600 font-medium px-4 py-1.5 rounded-lg transition"
                >
                  Clear All Accounts
                </button>
              )}
            </div>

            {/* Accounts List */}
            <div className="space-y-4">
              {accounts.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-6 text-center text-gray-400">
                  No accounts added yet.
                </div>
              ) : (
                accounts.map((acc, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl shadow p-4 flex flex-col gap-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="font-medium text-gray-800 text-lg">{acc.name}</div>
                      <div className="text-gray-600">₹{acc.balance.toFixed(2)}</div>
                      <button
                        className="text-blue-600 hover:underline text-sm font-medium"
                        onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                      >
                        {expandedIdx === idx ? "Hide Transactions" : "View Transactions"}
                      </button>
                    </div>
                    {/* Transactions Section */}
                    {expandedIdx === idx && (
                      <div className="mt-2">
                        {/* Add Transaction Form */}
                        <form
                          onSubmit={e => handleAddTransaction(idx, e)}
                          className="bg-gray-50 rounded-lg p-4 mb-3 flex flex-col gap-3"
                        >
                          <div className="flex gap-2">
                            <select
                              value={txType}
                              onChange={e => setTxType(e.target.value as "income" | "expense")}
                              className="rounded-lg border border-gray-200 px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                            >
                              <option value="income">Income</option>
                              <option value="expense">Expense</option>
                            </select>
                            <input
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={txAmount}
                              onChange={e => setTxAmount(e.target.value)}
                              className="w-24 px-2 py-1 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                              placeholder="Amount"
                            />
                            <input
                              type="text"
                              value={txCategory}
                              onChange={e => setTxCategory(e.target.value)}
                              className="flex-1 px-2 py-1 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                              placeholder="Category"
                            />
                          </div>
                          <input
                            type="text"
                            value={txNote}
                            onChange={e => setTxNote(e.target.value)}
                            className="px-2 py-1 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                            placeholder="Note (optional)"
                          />
                          {txError && <div className="text-red-500 text-sm">{txError}</div>}
                          <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1.5 rounded-lg transition self-end"
                          >
                            Add Transaction
                          </button>
                        </form>
                        {/* Transactions List */}
                        <div className="space-y-2">
                          {acc.transactions.length === 0 ? (
                            <div className="text-gray-400 text-sm text-center">No transactions yet.</div>
                          ) : (
                            acc.transactions.map((tx, tIdx) => (
                              <div
                                key={tIdx}
                                className={`flex items-center justify-between rounded-lg px-3 py-2 shadow-sm ${tx.type === "income" ? "bg-green-50" : "bg-red-50"}`}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium text-gray-800">{tx.type === "income" ? "+" : "-"}{tx.amount.toFixed(2)}</span>
                                  <span className="text-xs text-gray-500">{tx.category}{tx.note && ` • ${tx.note}`}</span>
                                </div>
                                <span className={`text-xs font-semibold ${tx.type === "income" ? "text-green-600" : "text-red-500"}`}>{tx.type === "income" ? "Income" : "Expense"}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
} 