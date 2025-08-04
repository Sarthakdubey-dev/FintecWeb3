"use client"

import { useWallet } from "@/components/wallet-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { courses } from "@/lib/course-data"
import { BookOpen, Clock, Trophy, Zap, Lock } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function CoursesPage() {
  const { isConnected } = useWallet()
  const [completedCourses, setCompletedCourses] = useState<string[]>([])
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>({})

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem("courseProgress")
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      setCourseProgress(progress)

      // Calculate completed courses
      const completed = Object.entries(progress)
        .filter(([_, percent]) => percent === 100)
        .map(([courseId, _]) => courseId)
      setCompletedCourses(completed)
    }
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Lock className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Connect Your Wallet</h2>
            <p className="text-slate-600 mb-6">
              Please connect your MetaMask wallet to access the courses and start earning tokens.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Financial Literacy Courses</h1>
          <p className="text-xl text-slate-600">
            Master personal finance through interactive lessons and earn FET tokens
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const progress = courseProgress[course.id] || 0
            const isCompleted = completedCourses.includes(course.id)

            return (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{course.badge}</span>
                      <div>
                        <CardTitle className="text-xl">{course.title}</CardTitle>
                        <Badge className={getDifficultyColor(course.difficulty)}>{course.difficulty}</Badge>
                      </div>
                    </div>
                    {isCompleted && <Trophy className="h-6 w-6 text-yellow-500" />}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-slate-600">{course.description}</p>

                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.blocks.length} blocks</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        {/* <Zap className="h-4 w-4 text-amber-500" /> */}
                        {/* <span>{course.totalXP} XP</span> */}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Trophy className="h-6 w-4 text-green-500" />
                        <span>{course.totalTokens} FET</span>
                      </div>
                    </div>
                  </div>

                  <Link href={`/courses/${course.id}`}>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700">
                      {progress > 0 ? "Continue Course" : "Start Course"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
