// app/page.tsx
"use client";
import { useState } from "react";
import { createWorker } from "tesseract.js";
import { pdfToImg } from "@/lib/pdf-to-img";

const Home = () => {
  const [text,setText]=useState<string[]|undefined>(undefined);
  // handleExtractPdf function explained above
  const handleExtractPdf = async (file: File) => {
    if (!file) return;
    try {
      const images = await pdfToImg(file);
      const pages = [];
  
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const worker = await createWorker({
          logger: (m) => console.log(m),
        });
  
        await worker.load();
        await worker.loadLanguage("fra");
        await worker.initialize("fra");
        const { data: { text } } = await worker.recognize(image);
  
        // Pushing the extracted text from each page to the pages array
        pages.push(text);
  
        await worker.terminate();
      }
  
      return pages;
    } catch (error) {
      console.error("Error extracting PDF:", error);
    }
  };
  
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;
    const file = files[0];
    const pdfContent = await handleExtractPdf(file);
    setText(pdfContent)
    console.log("Extracted PDF content:", pdfContent);
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileUpload} />
      {JSON.stringify(text)}
    </div>
  );
};

export default Home;