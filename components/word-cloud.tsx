"use client"

import { useEffect, useRef, useMemo } from "react"
import cloud from "d3-cloud"
import { scaleLinear } from "d3-scale"
import { motion } from "framer-motion"

interface WordData {
  text: string
  size: number
}

interface WordCloudProps {
  words: { text: string; value: number }[]
  width?: number
  height?: number
}

export function WordCloud({ words, width = 800, height = 400 }: WordCloudProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  const processedWords = useMemo(() => {
    if (!words.length) return []

    // Calcular escala de tamaños
    const maxValue = Math.max(...words.map(w => w.value))
    const minValue = Math.min(...words.map(w => w.value))
    
    const sizeScale = scaleLinear()
      .domain([minValue, maxValue])
      .range([16, 72])

    return words.map(w => ({
      text: w.text,
      size: sizeScale(w.value),
      value: w.value,
    }))
  }, [words])

  useEffect(() => {
    if (!svgRef.current || !processedWords.length) return

    const svg = svgRef.current
    const g = svg.querySelector("g")
    if (!g) return

    // Limpiar contenido previo
    g.innerHTML = ""

    // Crear layout de nube
    const layout = cloud()
      .size([width, height])
      .words(processedWords)
      .padding(5)
      .rotate(() => (~~(Math.random() * 2)) * 90)
      .font("Inter")
      .fontSize(d => d.size)
      .on("end", (words) => {
        // Colores para las palabras - tonos de azul consistentes
        const colors = [
          "rgb(63, 81, 181)", // primary #3f51b5
          "rgb(48, 63, 159)", // azul más oscuro
          "rgb(92, 107, 192)", // azul medio
          "rgb(121, 134, 203)", // azul claro
          "rgb(159, 168, 218)", // azul muy claro
        ]

        words.forEach((word, i) => {
          const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
          text.setAttribute("text-anchor", "middle")
          text.setAttribute("font-family", "Inter")
          text.setAttribute("font-size", String(word.size))
          text.setAttribute("font-weight", "600")
          text.setAttribute("fill", colors[i % colors.length])
          text.setAttribute("transform", `translate(${word.x}, ${word.y}) rotate(${word.rotate})`)
          text.textContent = word.text
          text.style.cursor = "default"
          text.style.transition = "all 0.2s"
          
          // Tooltip effect
          text.addEventListener("mouseenter", () => {
            text.style.opacity = "0.7"
            text.style.transform = `translate(${word.x}px, ${word.y}px) rotate(${word.rotate}deg) scale(1.1)`
          })
          text.addEventListener("mouseleave", () => {
            text.style.opacity = "1"
            text.style.transform = `translate(${word.x}px, ${word.y}px) rotate(${word.rotate}deg) scale(1)`
          })
          
          g.appendChild(text)
        })
      })

    layout.start()
  }, [processedWords, width, height])

  if (!words.length) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>No hay suficientes respuestas de texto para generar la nube</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center w-full"
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
      >
        <g transform={`translate(${width / 2}, ${height / 2})`} />
      </svg>
    </motion.div>
  )
}

