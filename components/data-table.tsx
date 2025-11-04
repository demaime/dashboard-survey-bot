"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { getQuestionText, getOptionTitle } from "@/lib/survey-questions"
import { HiChevronDown, HiChevronUp, HiSearch, HiUser, HiPhone, HiCheckCircle } from "react-icons/hi"

interface Survey {
  _id: string
  phoneNumber: string
  userName: string
  answers: Record<string, string>
  createdAt: any
  status: string
}

export function DataTable({ surveys }: { surveys: Survey[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const filteredSurveys = useMemo(() => {
    return surveys.filter((survey) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        survey.phoneNumber.toLowerCase().includes(searchLower) ||
        survey.userName.toLowerCase().includes(searchLower) ||
        Object.values(survey.answers).some((answer) => getOptionTitle("1", answer).toLowerCase().includes(searchLower))
      )
    })
  }, [surveys, searchTerm])

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const formatDate = (dateObj: any) => {
    try {
      if (!dateObj) return "Sin fecha"
      
      // Si es un string ISO
      if (typeof dateObj === "string") {
        return new Date(dateObj).toLocaleString("es-AR")
      }
      
      // Si es un Date object
      if (dateObj instanceof Date) {
        return dateObj.toLocaleString("es-AR")
      }
      
      // Si tiene formato MongoDB $date
      if (dateObj.$date) {
        if (dateObj.$date.$numberLong) {
          const timestamp = Number.parseInt(dateObj.$date.$numberLong)
          return new Date(timestamp).toLocaleString("es-AR")
        }
        if (typeof dateObj.$date === "string") {
          return new Date(dateObj.$date).toLocaleString("es-AR")
        }
      }
      
      return "Fecha inválida"
    } catch (error) {
      console.error("Error formatting date:", error, dateObj)
      return "Error en fecha"
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, teléfono o respuesta..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-12 bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary transition-all duration-300"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between px-1"
      >
        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <HiCheckCircle className="text-primary" />
          {filteredSurveys.length} de {surveys.length} encuestas
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {filteredSurveys.map((survey, index) => (
          <motion.div key={survey._id} variants={itemVariants}>
            <Card className="overflow-hidden bg-gradient-to-br from-card to-card/50 border-2 border-border backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
              <motion.button
                onClick={() => toggleRow(survey._id)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-primary/5 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex-1 flex items-center gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center flex-shrink-0"
                  >
                    <HiUser className="text-xl text-primary" />
                  </motion.div>
                  <div className="flex-1 text-left space-y-1">
                    <p className="font-semibold text-foreground text-lg">{survey.userName}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <HiPhone className="text-primary" />
                      <span className="font-medium">{survey.phoneNumber}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground font-medium bg-muted/50 px-3 py-1 rounded-full">
                    {formatDate(survey.createdAt)}
                  </span>
                  <motion.div
                    animate={{ rotate: expandedRows.has(survey._id) ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {expandedRows.has(survey._id) ? (
                      <HiChevronUp className="w-5 h-5 text-primary" />
                    ) : (
                      <HiChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </motion.div>
                </div>
              </motion.button>

              <AnimatePresence>
                {expandedRows.has(survey._id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 py-5 bg-gradient-to-br from-muted/30 to-muted/10 border-t border-border/50 space-y-4">
                      {Object.entries(survey.answers).map(([questionId, answer], idx) => (
                        <motion.div
                          key={questionId}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="space-y-2 p-3 bg-card/50 rounded-lg border border-border/30"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded uppercase tracking-wide">
                              Pregunta {questionId}
                            </span>
                          </div>
                          <p className="text-sm text-foreground font-medium leading-relaxed">
                            {getQuestionText(questionId)}
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <HiCheckCircle className="text-accent flex-shrink-0" />
                            <p className="text-sm font-semibold text-accent">
                              {getOptionTitle(questionId, answer)}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredSurveys.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-4">
            <HiSearch className="w-10 h-10 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">No se encontraron resultados</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Intenta con otro término de búsqueda</p>
        </motion.div>
      )}
    </div>
  )
}
