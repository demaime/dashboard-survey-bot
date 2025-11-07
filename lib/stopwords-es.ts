// Stopwords en español para filtrar palabras comunes
export const STOPWORDS_ES = new Set([
  // Artículos
  "el", "la", "los", "las", "un", "una", "unos", "unas",
  // Pronombres
  "yo", "tú", "tu", "él", "ella", "nosotros", "nosotras", "vosotros", "vosotras", "ellos", "ellas",
  "me", "te", "se", "le", "lo", "nos", "os", "les",
  "mi", "mis", "su", "sus", "nuestro", "nuestra", "nuestros", "nuestras",
  // Preposiciones
  "a", "ante", "bajo", "con", "contra", "de", "desde", "en", "entre", "hacia", "hasta", "para", "por", "según", "sin", "sobre", "tras",
  // Conjunciones
  "y", "e", "o", "u", "pero", "sino", "que", "si", "como", "porque", "aunque",
  // Verbos auxiliares
  "es", "son", "está", "están", "era", "eran", "ser", "estar", "he", "ha", "han", "hay",
  "fue", "fueron", "sido", "siendo",
  // Otros
  "más", "muy", "mucho", "mucha", "muchos", "muchas", "poco", "poca", "pocos", "pocas",
  "todo", "toda", "todos", "todas", "algún", "alguna", "algunos", "algunas",
  "ningún", "ninguna", "ningunos", "ningunas", "otro", "otra", "otros", "otras",
  "este", "esta", "estos", "estas", "ese", "esa", "esos", "esas", "aquel", "aquella", "aquellos", "aquellas",
  "del", "al", "ya", "no", "ni", "también", "tan", "tanto", "tanta", "tantos", "tantas",
  "qué", "cuál", "cuáles", "quién", "quiénes", "cómo", "cuándo", "dónde", "cuánto", "cuánta", "cuántos", "cuántas",
]);

export function cleanText(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()¿?¡!]/g, " ") // Remover puntuación
    .split(/\s+/) // Dividir por espacios
    .filter(word => word.length > 2) // Palabras de más de 2 caracteres
    .filter(word => !STOPWORDS_ES.has(word)); // Filtrar stopwords
}


