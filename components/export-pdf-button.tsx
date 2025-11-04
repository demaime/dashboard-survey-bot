"use client";

import { useState } from "react";
import { HiDownload } from "react-icons/hi";
import { motion } from "framer-motion";
import { pdf } from "@react-pdf/renderer";
import { toPng } from "html-to-image";
import { PDFDocument } from "./pdf-document";

interface ExportPDFButtonProps {
  surveys: any[];
}

export function ExportPDFButton({ surveys }: ExportPDFButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const formatDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const exportToPDF = async () => {
    if (isExporting || surveys.length === 0) return;

    setIsExporting(true);

    try {
      // Capturar la nube de palabras como imagen si existe
      let wordCloudImage: string | null = null;
      const wordCloudElement = document.querySelector(
        '[data-wordcloud="true"]'
      );

      if (wordCloudElement) {
        try {
          wordCloudImage = await toPng(wordCloudElement as HTMLElement, {
            quality: 1.0,
            pixelRatio: 2,
            backgroundColor: "#ffffff",
            skipFonts: true, // 👈 Ignora fuentes externasimage.png
          });
        } catch (err) {
          console.warn("No se pudo capturar la nube de palabras:", err);
        }
      }

      // Generar el documento PDF
      const blob = await pdf(
        <PDFDocument surveys={surveys} wordCloudImage={wordCloudImage} />
      ).toBlob();

      // Descargar
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `encuestas-guazu-${formatDate()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      alert("Hubo un error al generar el PDF. Por favor intenta nuevamente.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.button
      onClick={exportToPDF}
      disabled={isExporting || surveys.length === 0}
      className="relative w-12 h-12 rounded-full border-2 border-border backdrop-blur-sm bg-card/50 hover:bg-card transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      whileHover={{ scale: isExporting ? 1 : 1.05 }}
      whileTap={{ scale: isExporting ? 1 : 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      title="Exportar a PDF"
    >
      {isExporting ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full"
        />
      ) : (
        <HiDownload className="w-5 h-5 text-foreground" />
      )}
    </motion.button>
  );
}
