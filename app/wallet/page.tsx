"use client"

import { useWallet } from "@/components/wallet-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wallet, Trophy, Zap, Copy, ExternalLink, Award } from "lucide-react"
import { useState, useEffect } from "react"

export default function WalletPage() {
  const { isConnected, address, balance, xp, isLoading, error, refreshBalance } = useWallet()
  const [rewardHistory, setRewardHistory] = useState<any[]>([])
  const [badges, setBadges] = useState<string[]>([])
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    // Load reward history and badges from localStorage
    const savedHistory = localStorage.getItem("rewardHistory")
    if (savedHistory) {
      setRewardHistory(JSON.parse(savedHistory))
    }

    if (!address) return
    const streakKey = `currentStreak_${address}`;
    const longestStreakKey = `longestStreak_${address}`;
    const savedStreak = localStorage.getItem(streakKey);
    const savedLongestStreak = localStorage.getItem(longestStreakKey);
    if (savedStreak) setCurrentStreak(parseInt(savedStreak));
    if (savedLongestStreak) setLongestStreak(parseInt(savedLongestStreak));

    // Calculate badges based on balance and streaks only
    const earnedBadges = []
    if (balance >= 50) earnedBadges.push("💰 Token Collector")
    if (balance >= 100) earnedBadges.push("💎 Wealth Builder")
    if (currentStreak >= 7) earnedBadges.push("🔥 Streak Master")
    if (currentStreak >= 21) earnedBadges.push("⚡ Learning Legend")
    if (longestStreak >= 50) earnedBadges.push("🏅 Consistency King")

    setBadges(earnedBadges)
  }, [balance, currentStreak, longestStreak])

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  const mockRewardHistory = [
    { date: "2024-01-15", course: "Budgeting 101", type: "Course Completion", amount: 50, xp: 500 },
    { date: "2024-01-14", course: "Budgeting 101", type: "Quiz Passed", amount: 10, xp: 100 },
    { date: "2024-01-13", course: "Budgeting 101", type: "Lesson Completed", amount: 5, xp: 50 },
    { date: "2024-01-12", course: "Saving Basics", type: "Lesson Completed", amount: 5, xp: 50 },
  ]

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Wallet className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Connect Your Wallet</h2>
            <p className="text-slate-600 mb-6">
              Please connect your MetaMask wallet to view your rewards and progress.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Your Wallet & Rewards</h1>
          <p className="text-xl text-slate-600">Track your learning progress and token rewards</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Wallet Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Wallet Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5" />
                  <span>Wallet Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between bg-slate-100 p-4 rounded-lg">
                  <span className="font-mono text-sm">{address}</span>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={copyAddress}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={`https://etherscan.io/address/${address}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Token Balance */}
            <Card className="token-glow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-green-600" />
                  <span>FET Token Balance</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={refreshBalance}
                    disabled={isLoading}
                    className="ml-auto"
                  >
                    {isLoading ? "Loading..." : "Refresh"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}
                  <div className="text-5xl font-bold text-green-600 mb-2">
                    {isLoading ? "..." : balance}
                  </div>
                  <div className="text-lg text-slate-600">FET Tokens</div>
                  <div className="text-sm text-slate-500 mt-2">≈ ${(balance * 0.45).toFixed(2)} USD</div>
                </div>
              </CardContent>
            </Card>

            {/* Reward History */}
            <Card>
              <CardHeader>
                <CardTitle>Reward History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRewardHistory.map((reward, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-slate-900">{reward.type}</div>
                        <div className="text-sm text-slate-600">{reward.course}</div>
                        <div className="text-xs text-slate-500">{reward.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-800">+{reward.amount} FET</Badge>
                          <Badge className="bg-amber-100 text-amber-800">+{reward.xp} XP</Badge>
                        </div>
                      </div>
                    </div>
                  ))}

                  {mockRewardHistory.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No rewards yet. Complete courses to start earning!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* XP Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  <span>Experience Points</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="text-4xl font-bold text-amber-600 mb-2">{xp}</div>
                  <div className="text-lg text-slate-600">Total XP</div>

                  <div className="mt-4">
                    <div className="text-sm text-slate-500 mb-2">Level {Math.floor(xp / 100) + 1}</div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${xp % 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{xp % 100}/100 to next level</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-purple-500" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {badges.map((badge, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <span className="text-2xl">{badge.split(" ")[0]}</span>
                      <span className="font-medium text-purple-800">{badge.split(" ").slice(1).join(" ")}</span>
                    </div>
                  ))}

                  {badges.length === 0 && (
                    <div className="text-center py-6 text-slate-500">
                      <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">Complete courses to earn badges!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Courses Started</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Courses Completed</span>
                  <span className="font-semibold">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Quizzes Passed</span>
                  <span className="font-semibold">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Learning Streak</span>
                  <span className="font-semibold">5 days</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
