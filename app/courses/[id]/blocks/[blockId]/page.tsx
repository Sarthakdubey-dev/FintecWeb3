"use client"

import { useParams, useRouter } from "next/navigation"
import { getCourse, getBlock } from "@/lib/course-data"
import { useWallet } from "@/components/wallet-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, ArrowLeft, Lightbulb, Trophy, Zap } from "lucide-react"
import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"

export default function BlockPage() {
  const params = useParams()
  const router = useRouter()
  const { addXP, claimTokens, address } = useWallet()

  const courseId = params.id as string
  const blockId = params.blockId as string

  const course = getCourse(courseId)
  const block = getBlock(courseId, blockId)

  const [isCompleted, setIsCompleted] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [quizScore, setQuizScore] = useState(0)

  useEffect(() => {
    // Check if block is already completed for this wallet
    if (!address) return
    const courseKey = `completed_${courseId}_${address}`
    const savedBlocks = localStorage.getItem(courseKey)
    if (savedBlocks) {
      const completedBlocks = JSON.parse(savedBlocks)
      setIsCompleted(completedBlocks.includes(blockId))
    }
  }, [courseId, blockId, address])

  if (!course || !block) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Block Not Found</h1>
          <p className="text-slate-600">The content you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const currentBlockIndex = course.blocks.findIndex((b) => b.id === blockId)
  const nextBlock = course.blocks[currentBlockIndex + 1]
  const prevBlock = course.blocks[currentBlockIndex - 1]

  const markAsCompleted = async () => {
    if (isCompleted) return

    // Save to localStorage for this wallet
    if (!address) return
    const courseKey = `completed_${courseId}_${address}`
    const savedBlocks = localStorage.getItem(courseKey)
    const completedBlocks = savedBlocks ? JSON.parse(savedBlocks) : []

    if (!completedBlocks.includes(blockId)) {
      completedBlocks.push(blockId)
      localStorage.setItem(courseKey, JSON.stringify(completedBlocks))

      // Update course progress for this wallet
      const progress = (completedBlocks.length / course.blocks.length) * 100
      const progressKey = `courseProgress_${address}`
      const savedProgress = localStorage.getItem(progressKey) || "{}"
      const courseProgress = JSON.parse(savedProgress)
      courseProgress[courseId] = progress
      localStorage.setItem(progressKey, JSON.stringify(courseProgress))

      // Add tokens only (XP comes from streaks only)
      await claimTokens(block.tokenReward)

      setIsCompleted(true)
    }
  }

  const handleQuizSubmit = () => {
    if (!block.questions) return

    let correct = 0
    block.questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++
      }
    })

    const score = (correct / block.questions.length) * 100
    setQuizScore(score)
    setShowResults(true)

    if (score >= 70) {
      // Pass threshold
      markAsCompleted()
    }
  }

  const renderQuiz = () => {
    if (!block.questions) return null

    return (
      <div className="space-y-6">
        {block.questions.map((question, qIndex) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                Question {qIndex + 1}: {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {question.options.map((option, oIndex) => (
                <label
                  key={oIndex}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedAnswers[question.id] === oIndex ? "bg-teal-50 border-teal-300" : "hover:bg-slate-50"
                  } ${
                    showResults
                      ? oIndex === question.correctAnswer
                        ? "bg-green-50 border-green-300"
                        : selectedAnswers[question.id] === oIndex && oIndex !== question.correctAnswer
                          ? "bg-red-50 border-red-300"
                          : ""
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={oIndex}
                    checked={selectedAnswers[question.id] === oIndex}
                    onChange={() =>
                      setSelectedAnswers((prev) => ({
                        ...prev,
                        [question.id]: oIndex,
                      }))
                    }
                    disabled={showResults}
                    className="text-teal-600"
                  />
                  <span>{option}</span>
                </label>
              ))}

              {showResults && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Explanation:</strong> {question.explanation}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {showResults && (
          <Card className={`${quizScore >= 70 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            <CardContent className="p-6 text-center">
              <div className={`text-3xl font-bold mb-2 ${quizScore >= 70 ? "text-green-600" : "text-red-600"}`}>
                {Math.round(quizScore)}%
              </div>
              <p className={`text-lg mb-4 ${quizScore >= 70 ? "text-green-800" : "text-red-800"}`}>
                {quizScore >= 70 ? "Congratulations! You passed!" : "Keep studying and try again!"}
              </p>
              {quizScore >= 70 && (
                <div className="flex items-center justify-center space-x-4">

                  <div className="flex items-center space-x-1">
                    <Trophy className="h-5 w-5 text-green-500" />
                    <span className="font-semibold">+{block.tokenReward} FET</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-slate-500 mb-4">
            <span>{course.title}</span>
            <ArrowRight className="h-4 w-4" />
            <span>{block.title}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{block.title}</h1>
              <div className="flex items-center space-x-4">
                <Badge variant={block.type === "quiz" ? "destructive" : "secondary"}>
                  {block.type === "quiz" ? "Quiz" : "Lesson"}
                </Badge>
                                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <Trophy className="h-4 w-4" />
                    <span>{block.tokenReward} FET</span>
                  </div>
              </div>
            </div>

            {isCompleted && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-6 w-6" />
                <span className="font-semibold">Completed</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {block.type === "lesson" ? (
            <>
              {/* Lesson Content */}
              <Card>
                <CardContent className="p-8">
                  <div className="prose prose-slate max-w-none">
                    <ReactMarkdown>{block.content || ""}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>

              {/* Tips Section */}
              {block.tips && block.tips.length > 0 && (
                <Card className="bg-amber-50 border-amber-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-amber-800">
                      <Lightbulb className="h-5 w-5" />
                      <span>Pro Tips</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {block.tips.map((tip, index) => (
                        <li key={index} className="flex items-start space-x-2 text-amber-700">
                          <span className="text-amber-500 mt-1">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            /* Quiz Content */
            renderQuiz()
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-between">
          <div>
            {prevBlock && (
              <Button variant="outline" asChild>
                <a href={`/courses/${courseId}/blocks/${prevBlock.id}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </a>
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {block.type === "lesson" && !isCompleted && (
              <Button onClick={markAsCompleted} className="bg-teal-600 hover:bg-teal-700">
                Mark as Completed
              </Button>
            )}

            {block.type === "quiz" && !showResults && (
              <Button
                onClick={handleQuizSubmit}
                disabled={Object.keys(selectedAnswers).length !== (block.questions?.length || 0)}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Submit Quiz
              </Button>
            )}

            {nextBlock && (isCompleted || (block.type === "quiz" && quizScore >= 70)) && (
              <Button asChild>
                <a href={`/courses/${courseId}/blocks/${nextBlock.id}`}>
                  Next Block
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </Button>
            )}

            {!nextBlock && (isCompleted || (block.type === "quiz" && quizScore >= 70)) && (
              <Button asChild>
                <a href={`/courses/${courseId}`}>Back to Course</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
