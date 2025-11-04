export const SURVEY_QUESTIONS = {
  1: {
    type: "list",
    text: "¿Qué imagen tenés del gobierno de Javier Milei?",
    options: [
      { id: "muy_buena", title: "Muy buena" },
      { id: "buena", title: "Buena" },
      { id: "regular", title: "Regular" },
      { id: "mala", title: "Mala" },
      { id: "muy_mala", title: "Muy mala" },
      { id: "no_se", title: "No sé" },
    ],
  },
  2: {
    type: "button",
    text: "¿Pensás que la economía en los próximos meses va a estar...",
    options: [
      { id: "mejor", title: "📈 Mejor" },
      { id: "igual", title: "➡ Igual" },
      { id: "peor", title: "📉 Peor" },
    ],
  },
  3: {
    type: "list",
    text: "¿Cuál es el máximo nivel de estudios que alcanzaste?",
    options: [
      { id: "universitario_completo", title: "Universitario completo" },
      { id: "universitario_incompleto", title: "Universitario incompleto" },
      { id: "terciario_completo", title: "Terciario completo" },
      { id: "terciario_incompleto", title: "Terciario incompleto" },
      { id: "secundario_completo", title: "Secundario completo" },
      { id: "secundario_incompleto", title: "Secundario incompleto" },
      { id: "primario_completo", title: "Primario completo" },
      { id: "primario_incompleto", title: "Primario incompleto" },
    ],
  },
  4: {
    type: "button",
    text: "Por último, ¿podés indicarme tu género?",
    options: [
      { id: "masculino", title: "👨 Masculino" },
      { id: "femenino", title: "👩 Femenino" },
      { id: "otro", title: "⚧ Otro" },
    ],
  },
}

export function getQuestionText(questionId: string | number): string {
  const q = SURVEY_QUESTIONS[questionId as keyof typeof SURVEY_QUESTIONS]
  return q?.text || ""
}

export function getOptionTitle(questionId: string | number, optionId: string): string {
  const q = SURVEY_QUESTIONS[questionId as keyof typeof SURVEY_QUESTIONS]
  if (!q || q.type === "text") return optionId
  const option = q.options?.find((opt) => opt.id === optionId)
  return option?.title || optionId
}
