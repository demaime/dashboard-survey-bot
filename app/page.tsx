"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { DataTable } from "@/components/data-table";
import { ChartsView } from "@/components/charts-view";
import { HiChartBar, HiDatabase } from "react-icons/hi";
import { RiSurveyLine } from "react-icons/ri";
import { Card } from "@/components/ui/card";

export default function Page() {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSurveys() {
      try {
        const res = await fetch("/api/surveys");
        const data = await res.json();
        setSurveys(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSurveys();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <header className="relative border-b border-border/50 backdrop-blur-sm bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30"
              >
                <RiSurveyLine className="text-3xl text-primary-foreground" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Encuestas Guazú
                </h1>
                <p className="text-muted-foreground text-sm mt-1 font-medium">
                  Dashboard de análisis de respuestas
                </p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <ThemeToggle />
            </motion.div>
          </motion.div>

          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6"
            >
              <Card className="p-4 bg-gradient-to-br from-card to-card/50 border-2 border-border backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Total Encuestas
                    </p>
                    <motion.p
                      className="text-3xl font-bold text-foreground mt-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        delay: 0.6,
                      }}
                    >
                      {surveys.length}
                    </motion.p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <RiSurveyLine className="text-2xl text-primary" />
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-card to-card/50 border-2 border-border backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Encuestas Hoy
                    </p>
                    <motion.p
                      className="text-3xl font-bold text-foreground mt-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        delay: 0.7,
                      }}
                    >
                      {
                        surveys.filter((s) => {
                          const surveyDate = new Date(
                            s.createdAt?.$date?.$numberLong
                              ? parseInt(s.createdAt.$date.$numberLong)
                              : s.createdAt
                          );
                          const today = new Date();
                          return (
                            surveyDate.getDate() === today.getDate() &&
                            surveyDate.getMonth() === today.getMonth() &&
                            surveyDate.getFullYear() === today.getFullYear()
                          );
                        }).length
                      }
                    </motion.p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <HiDatabase className="text-2xl text-accent" />
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-card to-card/50 border-2 border-border backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Última respuesta recibida
                    </p>
                    <motion.p
                      className="text-2xl font-bold text-foreground mt-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        delay: 0.8,
                      }}
                    >
                      {surveys.length > 0
                        ? new Date(
                            surveys[0].createdAt?.$date?.$numberLong
                              ? parseInt(surveys[0].createdAt.$date.$numberLong)
                              : surveys[0].createdAt
                          ).toLocaleString("es-AR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </motion.p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <HiChartBar className="text-2xl text-primary" />
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-96"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full"
              />
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-muted-foreground font-medium"
              >
                Cargando datos...
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Tabs defaultValue="charts" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-card/50 backdrop-blur-sm border-2 border-border p-1">
                  <TabsTrigger
                    value="charts"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground transition-all duration-300"
                  >
                    <HiChartBar className="mr-2 text-lg" />
                    Gráficos
                  </TabsTrigger>
                  <TabsTrigger
                    value="base"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground transition-all duration-300"
                  >
                    <HiDatabase className="mr-2 text-lg" />
                    Base de Datos
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="charts" className="space-y-4">
                  <ChartsView surveys={surveys} />
                </TabsContent>

                <TabsContent value="base" className="space-y-4">
                  <DataTable surveys={surveys} />
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
