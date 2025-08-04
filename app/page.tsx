"use client"

import { useWallet } from "@/components/wallet-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Trophy, Zap, Shield, TrendingUp, PiggyBank } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { isConnected, connectWallet } = useWallet()

  const benefits = [
    {
      icon: BookOpen,
      title: "Interactive Learning",
      description: "Learn through engaging mini-courses and real-world scenarios",
    },
    {
      icon: Trophy,
      title: "Earn Rewards",
      description: "Get FET tokens for completing courses and quizzes",
    },
    {
      icon: Zap,
      title: "Track Progress",
      description: "Monitor your XP, badges, and learning milestones",
    },
    {
      icon: Shield,
      title: "Secure & Decentralized",
      description: "Your progress and rewards are secured on the blockchain",
    },
  ]

  const features = [
    {
      icon: PiggyBank,
      title: "Budgeting Mastery",
      description: "Learn to create and stick to effective budgets",
    },
    {
      icon: TrendingUp,
      title: "Investment Basics",
      description: "Understand stocks, bonds, and portfolio management",
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Protect your wealth with insurance and emergency funds",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Master Your <span className="text-teal-400">Financial Future</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Learn personal finance through interactive courses and earn crypto tokens for your progress. No passwords,
              just your wallet.
            </p>

            {!isConnected ? (
              <Button
                onClick={connectWallet}
                size="lg"
                className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 text-lg font-semibold rounded-xl"
              >
                Connect Wallet to Start Learning
              </Button>
            ) : (
              <Link href="/courses">
                <Button
                  size="lg"
                  className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 text-lg font-semibold rounded-xl"
                >
                  Explore Courses
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Learn Financial Literacy?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Build the skills you need to make smart financial decisions and secure your future
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What You'll Learn</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive courses covering all aspects of personal finance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Your Financial Journey?</h2>
          <p className="text-xl text-teal-100 mb-8">
            Connect your wallet and begin earning tokens while learning essential financial skills
          </p>

          {!isConnected ? (
            <Button
              onClick={connectWallet}
              size="lg"
              className="bg-white text-teal-600 hover:bg-slate-100 px-8 py-4 text-lg font-semibold rounded-xl"
            >
              Get Started Now
            </Button>
          ) : (
            <Link href="/courses">
              <Button
                size="lg"
                className="bg-white text-teal-600 hover:bg-slate-100 px-8 py-4 text-lg font-semibold rounded-xl"
              >
                View All Courses
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
