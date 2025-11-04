import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { SURVEY_QUESTIONS, getQuestionText, getOptionTitle } from "@/lib/survey-questions";

interface PDFDocumentProps {
  surveys: any[];
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  coverPage: {
    backgroundColor: "#3f51b5",
  },
  coverTitle: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },
  coverSubtitle: {
    fontSize: 24,
    color: "#e8eaf6",
    marginBottom: 60,
  },
  coverCardsWrap: {
    width: "80%",
    gap: 30,
  },
  coverBigCard: {
    padding: 25,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    border: "2px solid #e8eaf6",
  },
  coverBigCardLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  coverBigCardValue: {
    fontSize: 56,
    fontWeight: "bold",
    color: "#3f51b5",
  },
  coverRow: {
    flexDirection: "row",
    gap: 16,
  },
  coverCard: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    border: "2px solid #e8eaf6",
  },
  coverCardLabel: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 6,
  },
  coverCardValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#3f51b5",
  },
  coverFooter: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#e8eaf6",
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3f51b5",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: "#666666",
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    gap: 10,
  },
  statCard: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    border: "2px solid #e0e0e0",
  },
  statLabel: {
    fontSize: 9,
    color: "#666666",
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3f51b5",
  },
  questionSection: {
    marginBottom: 30,
    breakBefore: "page",
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  questionIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#3f51b5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  questionIconText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  questionTextContainer: {
    flex: 1,
  },
  questionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 3,
  },
  questionText: {
    fontSize: 11,
    color: "#666666",
  },
  chartArea: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#fafafa",
    borderRadius: 8,
    height: 300,
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: 200,
    borderBottom: "2px solid #333333",
    paddingHorizontal: 10,
  },
  barColumn: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    maxWidth: 80,
  },
  bar: {
    width: "80%",
    backgroundColor: "#3f51b5",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 5,
  },
  barValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#3f51b5",
    marginBottom: 5,
  },
  barLabel: {
    fontSize: 8,
    marginTop: 8,
    color: "#333333",
    textAlign: "center",
    maxWidth: 70,
  },
  statsFooter: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    paddingTop: 15,
    borderTop: "1px solid #e0e0e0",
  },
  statItem: {
    alignItems: "center",
  },
  statItemLabel: {
    fontSize: 8,
    color: "#666666",
    marginBottom: 3,
  },
  statItemValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3f51b5",
  },
});

export function PDFDocument({ surveys }: PDFDocumentProps) {
  const formatDate = (dateObj: any) => {
    try {
      if (!dateObj) return "-";
      
      if (typeof dateObj === "string") {
        return new Date(dateObj).toLocaleDateString("es-AR");
      }
      
      if (dateObj.$date?.$numberLong) {
        const timestamp = parseInt(dateObj.$date.$numberLong);
        return new Date(timestamp).toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      
      return "-";
    } catch (error) {
      return "-";
    }
  };

  const getLastSurveyDate = () => {
    if (surveys.length === 0) return "-";
    return formatDate(surveys[0].createdAt);
  };

  const getTodayCount = () => {
    const today = new Date();
    return surveys.filter((s) => {
      try {
        const surveyDate = new Date(
          s.createdAt?.$date?.$numberLong
            ? parseInt(s.createdAt.$date.$numberLong)
            : s.createdAt
        );
        return (
          surveyDate.getDate() === today.getDate() &&
          surveyDate.getMonth() === today.getMonth() &&
          surveyDate.getFullYear() === today.getFullYear()
        );
      } catch {
        return false;
      }
    }).length;
  };

  const getChartData = () => {
    const data: Record<string, any> = {};

    Object.entries(SURVEY_QUESTIONS).forEach(([questionId, question]) => {
      if (question.type === "text") return;

      data[questionId] = {};
      question.options?.forEach((option) => {
        data[questionId][option.id] = 0;
      });
    });

    surveys.forEach((survey) => {
      Object.entries(survey.answers).forEach(([questionId, answerId]) => {
        if (data[questionId] && typeof data[questionId][answerId] === "number") {
          data[questionId][answerId]++;
        }
      });
    });

    return Object.entries(data).map(([questionId, answers]) => ({
      questionId,
      questionText: getQuestionText(questionId),
      data: Object.entries(answers).map(([optionId, count]) => ({
        name: getOptionTitle(questionId, optionId),
        value: count as number,
      })),
    }));
  };

  const chartData = getChartData();
  const maxValue = Math.max(
    ...chartData.flatMap((chart) => chart.data.map((d) => d.value))
  );

  return (
    <Document>
      {/* Portada */}
      <Page size="A4" orientation="landscape" style={[styles.page, styles.coverPage]}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", position: "relative" }}>
          <Text style={styles.coverTitle}>Encuestas Guazú</Text>
          <Text style={styles.coverSubtitle}>Reporte de Análisis</Text>

          <View style={styles.coverCardsWrap}>
            <View style={styles.coverBigCard}>
              <Text style={styles.coverBigCardLabel}>Total Encuestas</Text>
              <Text style={styles.coverBigCardValue}>{surveys.length}</Text>
            </View>

            <View style={styles.coverRow}>
              <View style={styles.coverCard}>
                <Text style={styles.coverCardLabel}>Encuestas Hoy</Text>
                <Text style={styles.coverCardValue}>{getTodayCount()}</Text>
              </View>

              <View style={styles.coverCard}>
                <Text style={styles.coverCardLabel}>Última respuesta</Text>
                <Text style={styles.coverCardValue}>{getLastSurveyDate()}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.coverFooter}>
            Generado el {new Date().toLocaleDateString("es-AR")} a las {new Date().toLocaleTimeString("es-AR")}
          </Text>
        </View>
      </Page>

      {/* Gráficos - uno por página */}
      {chartData.map((chart) => (
        <Page key={chart.questionId} size="A4" orientation="landscape" style={styles.page}>
          <View style={styles.questionHeader}>
            <View style={styles.questionIcon}>
              <Text style={styles.questionIconText}>Q{chart.questionId}</Text>
            </View>
            <View style={styles.questionTextContainer}>
              <Text style={styles.questionTitle}>Pregunta {chart.questionId}</Text>
              <Text style={styles.questionText}>{chart.questionText}</Text>
            </View>
          </View>

          <View style={styles.chartArea}>
            <View style={styles.barsContainer}>
              {chart.data.map((item, idx) => {
                const heightPercent = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                return (
                  <View key={idx} style={styles.barColumn}>
                    <Text style={styles.barValue}>{item.value}</Text>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${heightPercent}%`,
                        },
                      ]}
                    />
                    <Text style={styles.barLabel}>{item.name}</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.statsFooter}>
              <View style={styles.statItem}>
                <Text style={styles.statItemLabel}>TOTAL RESPUESTAS</Text>
                <Text style={styles.statItemValue}>
                  {chart.data.reduce((sum, item) => sum + item.value, 0)}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statItemLabel}>OPCIONES</Text>
                <Text style={styles.statItemValue}>{chart.data.length}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statItemLabel}>MÁS POPULAR</Text>
                <Text style={styles.statItemValue}>
                  {Math.max(...chart.data.map((d) => d.value))}
                </Text>
              </View>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
}

