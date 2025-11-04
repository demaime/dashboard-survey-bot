"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { SURVEY_QUESTIONS, getQuestionText, getOptionTitle } from "@/lib/survey-questions"
import { HiChartBar } from "react-icons/hi"

interface Survey {
  answers: Record<string, string>
}

export function ChartsView({ surveys }: { surveys: Survey[] }) {
  const chartData = useMemo(() => {
    const data: Record<string, any> = {}

    // Initialize data structure for each question
    Object.entries(SURVEY_QUESTIONS).forEach(([questionId, question]) => {
      if (question.type === "text") return // Skip text questions

      data[questionId] = {}
      question.options?.forEach((option) => {
        data[questionId][option.id] = 0
      })
    })

    // Count responses
    surveys.forEach((survey) => {
      Object.entries(survey.answers).forEach(([questionId, answerId]) => {
        if (data[questionId] && typeof data[questionId][answerId] === "number") {
          data[questionId][answerId]++
        }
      })
    })

    // Transform to chart format
    return Object.entries(data).map(([questionId, answers]) => ({
      questionId,
      questionText: getQuestionText(questionId),
      data: Object.entries(answers).map(([optionId, count]) => ({
        name: getOptionTitle(questionId, optionId),
        value: count,
      })),
    }))
  }, [surveys])

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid gap-6"
    >
      {chartData.map((chart, index) => (
        <motion.div key={chart.questionId} variants={itemVariants}>
          <Card className="col-span-full bg-gradient-to-br from-card to-card/50 border-2 border-border backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: index * 0.1 }}
                  className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0"
                >
                  <HiChartBar className="text-2xl text-primary-foreground" />
                </motion.div>
                <div className="flex-1">
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Pregunta {chart.questionId}
                  </CardTitle>
                  <CardDescription className="text-base mt-1 font-medium">
                    {chart.questionText}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-lg" />
                <ChartContainer
                  config={{
                    value: {
                      label: "Respuestas",
                      color: "#3f51b5",
                    },
                  }}
                  className="h-80 w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chart.data}
                      margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                    >
                      <defs>
                        <linearGradient
                          id={`colorGradient-${chart.questionId}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#3f51b5"
                            stopOpacity={1}
                          />
                          <stop
                            offset="100%"
                            stopColor="#3f51b5"
                            stopOpacity={0.6}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="currentColor"
                        className="opacity-20"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        interval={0}
                        tick={{ fill: "var(--foreground)", fontSize: 13, fontWeight: 600 }}
                        stroke="var(--foreground)"
                        strokeWidth={2}
                      />
                      <YAxis
                        tick={{ fill: "var(--foreground)", fontSize: 13, fontWeight: 600 }}
                        stroke="var(--foreground)"
                        strokeWidth={2}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        cursor={{ fill: "rgba(63, 81, 181, 0.1)" }}
                      />
                      <Bar
                        dataKey="value"
                        radius={[12, 12, 0, 0]}
                        maxBarSize={60}
                        fill={`url(#colorGradient-${chart.questionId})`}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              
              {/* Stats summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="mt-6 pt-4 border-t border-border/50"
              >
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      Total Respuestas
                    </p>
                    <p className="text-2xl font-bold text-primary mt-1">
                      {chart.data.reduce((sum, item) => sum + item.value, 0)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      Opciones
                    </p>
                    <p className="text-2xl font-bold text-accent mt-1">
                      {chart.data.length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      Más Popular
                    </p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {Math.max(...chart.data.map((d) => d.value))}
                    </p>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
