"use client"

import { useParams } from "next/navigation"
import { getCourse } from "@/lib/course-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckCircle, Lock, BookOpen, HelpCircle, Trophy, Zap } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.id as string
  const course = getCourse(courseId)
  const [completedBlocks, setCompletedBlocks] = useState<string[]>([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Load completed blocks from localStorage
    const savedBlocks = localStorage.getItem(`completed_${courseId}`)
    if (savedBlocks) {
      const blocks = JSON.parse(savedBlocks)
      setCompletedBlocks(blocks)
      setProgress((blocks.length / (course?.blocks.length || 1)) * 100)
    }
  }, [courseId, course])

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Course Not Found</h1>
          <p className="text-slate-600">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const isBlockUnlocked = (blockIndex: number) => {
    if (blockIndex === 0) return true
    return completedBlocks.includes(course.blocks[blockIndex - 1].id)
  }

  const getBlockIcon = (block: any, blockIndex: number) => {
    const isCompleted = completedBlocks.includes(block.id)
    const isUnlocked = isBlockUnlocked(blockIndex)

    if (isCompleted) {
      return <CheckCircle className="h-6 w-6 text-green-500" />
    } else if (isUnlocked) {
      return block.type === "quiz" ? (
        <HelpCircle className="h-6 w-6 text-blue-500" />
      ) : (
        <BookOpen className="h-6 w-6 text-slate-500" />
      )
    } else {
      return <Lock className="h-6 w-6 text-slate-400" />
    }
  }

  const totalXPEarned = completedBlocks.reduce((total, blockId) => {
    const block = course.blocks.find((b) => b.id === blockId)
    return total + (block?.xpReward || 0)
  }, 0)

  const totalTokensEarned = completedBlocks.reduce((total, blockId) => {
    const block = course.blocks.find((b) => b.id === blockId)
    return total + (block?.tokenReward || 0)
  }, 0)

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">{course.badge}</span>
                <div>
                  <CardTitle className="text-2xl md:text-3xl">{course.title}</CardTitle>
                  <p className="text-slate-600 mt-2">{course.description}</p>
                  <div className="flex items-center space-x-4 mt-4">
                    <Badge className="bg-teal-100 text-teal-800">{course.difficulty}</Badge>
                    <span className="text-sm text-slate-500">{course.duration}</span>
                  </div>
                </div>
              </div>
              {progress === 100 && <Trophy className="h-8 w-8 text-yellow-500" />}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-100 rounded-lg">
                <div className="text-2xl font-bold text-slate-900">{Math.round(progress)}%</div>
                <div className="text-sm text-slate-600">Complete</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-700">
                  {totalXPEarned}/{course.totalXP}
                </div>
                <div className="text-sm text-amber-600">XP Earned</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {totalTokensEarned}/{course.totalTokens}
                </div>
                <div className="text-sm text-green-600">FET Earned</div>
              </div>
            </div>

            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Course Blocks */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Course Content</h2>

          {course.blocks.map((block, index) => {
            const isCompleted = completedBlocks.includes(block.id)
            const isUnlocked = isBlockUnlocked(index)

            return (
              <Card key={block.id} className={`${isCompleted ? "bg-green-50 border-green-200" : ""}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getBlockIcon(block, index)}
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{block.title}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <Badge variant={block.type === "quiz" ? "destructive" : "secondary"}>
                            {block.type === "quiz" ? "Quiz" : "Lesson"}
                          </Badge>
                          <div className="flex items-center space-x-2 text-sm text-slate-500">
                            <Zap className="h-4 w-4" />
                            <span>{block.xpReward} XP</span>
                            <Trophy className="h-4 w-4" />
                            <span>{block.tokenReward} FET</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isCompleted && <Badge className="bg-green-100 text-green-800">Completed</Badge>}

                      {isUnlocked ? (
                        <Link href={`/courses/${courseId}/blocks/${block.id}`}>
                          <Button variant={isCompleted ? "outline" : "default"}>
                            {isCompleted ? "Review" : "Start"}
                          </Button>
                        </Link>
                      ) : (
                        <Button disabled variant="outline">
                          Locked
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {progress === 100 && (
          <Card className="mt-8 bg-gradient-to-r from-teal-500 to-blue-600 text-white">
            <CardContent className="p-8 text-center">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
              <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
              <p className="text-lg mb-4">You've completed the {course.title} course and earned your badge!</p>
              <div className="flex items-center justify-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{course.totalXP}</div>
                  <div className="text-sm opacity-90">Total XP</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{course.totalTokens}</div>
                  <div className="text-sm opacity-90">FET Tokens</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
